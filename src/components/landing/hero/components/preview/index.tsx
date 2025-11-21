"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  DEFAULT_MESSAGES,
  createAvatarSprite,
  createTextCanvasTexture,
} from "./constants";
import type { AnimEntryType, IChatPreviewProps } from "./types";

export function ChatPreview3D({
  messages = DEFAULT_MESSAGES,
  width = "100%",
  height = "100%",
}: IChatPreviewProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const initial = mount.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(
      30,
      initial.width / initial.height,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initial.width, initial.height);
    mount.appendChild(renderer.domElement);

    const content = new THREE.Group();
    root.add(content);

    const worldScaleFactor = 1 / 240;
    let cursorY = 1.2;
    const minGap = 0.12;

    const animations: AnimEntryType[] = [];

    for (const msg of messages) {
      const isReceived = !!msg.received;
      const bgColor = isReceived ? "#056162" : "#25D366";

      const { texture, bubbleWidth, bubbleHeight } = createTextCanvasTexture(
        msg.lines,
        {
          fontSize: 24,
          padding: 16,
          bgColor,
          textColor: "#fff",
          radius: 12,
        },
      );

      const planeW = bubbleWidth * worldScaleFactor;
      const planeH = bubbleHeight * worldScaleFactor;

      const bubble = new THREE.Mesh(
        new THREE.PlaneGeometry(planeW, planeH),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
      );

      const half = planeW / 2;
      const margin = 0.6;

      let bubbleX = 0;
      let avatarX = 0;

      /* Avatar */
      const avatarColor = msg.avatarColor ?? (isReceived ? 0xaaaaaa : 0x6b21a8);
      const { sprite: avatar, sizePx } = createAvatarSprite(avatarColor);
      const avatarSize = sizePx * worldScaleFactor * 0.9;

      if (isReceived) {
        bubbleX = -2.2 + margin + half;
        avatarX = bubbleX - half - avatarSize * 0.7;
      } else {
        bubbleX = 2.2 - margin - half;
        avatarX = bubbleX + half + avatarSize * 0.7;
      }

      bubble.position.set(bubbleX, cursorY - planeH / 2, 0);
      avatar.position.set(avatarX, cursorY - planeH / 2, 0.05);
      avatar.material.depthTest = false;

      content.add(bubble);
      content.add(avatar);

      const gap = Math.max(minGap, planeH + 0.05);
      cursorY -= gap;

      animations.push({
        mesh: bubble,
        sprite: avatar,
        start: performance.now(),
        avatarSize,
      });

      bubble.scale.setScalar(0.2);
      avatar.scale.setScalar(0.2);
    }

    const animate = () => {
      const now = performance.now();
      let needsRender = false;

      if (mouseRef.current.inside) {
        const targetY = mouseRef.current.x * 0.45;
        const targetX = mouseRef.current.y * 0.35;

        root.rotation.y += (targetY - root.rotation.y) * 0.18;
        root.rotation.x += (targetX - root.rotation.x) * 0.18;

        needsRender = true;
      } else {
        if (
          Math.abs(root.rotation.x) > 0.001 ||
          Math.abs(root.rotation.y) > 0.001
        ) {
          root.rotation.x *= 0.92;
          root.rotation.y *= 0.92;
          needsRender = true;
        }
      }

      for (let i = animations.length - 1; i >= 0; i--) {
        const anim = animations[i];

        const elapsed = now - anim.start;
        const progress = Math.min(1, elapsed / 450);

        const easedProgress = 1 - (1 - progress) ** 3;

        const bubbleScale = THREE.MathUtils.lerp(0.2, 1, easedProgress);
        anim.mesh.scale.setScalar(bubbleScale);

        const avatarScale = THREE.MathUtils.lerp(
          0.2,
          anim.avatarSize,
          easedProgress,
        );
        anim.sprite.scale.set(avatarScale, avatarScale, 1);

        needsRender = true;

        if (progress === 1) {
          animations.splice(i, 1);
        }
      }

      if (needsRender) renderer.render(scene, camera);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;

      mouseRef.current.inside = inside;
      if (!inside) return;

      mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    const onLeave = () => {
      mouseRef.current.inside = false;
    };

    window.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerleave", onLeave);

    const resizeObs = new ResizeObserver(() => {
      const r = mount.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    });

    resizeObs.observe(mount);

    return () => {
      window.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      resizeObs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry)
          (obj as THREE.Mesh).geometry.dispose();

        const mat = (obj as THREE.Mesh).material as
          | THREE.Material
          | THREE.Material[]
          | null;

        if (Array.isArray(mat))
          mat.forEach((m) => {
            m.dispose();
          });
        else if (mat) mat.dispose();

        if ((obj as THREE.Sprite).material instanceof THREE.SpriteMaterial) {
          const tex = (obj as THREE.Sprite).material.map;
          tex?.dispose();
        }
      });

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [messages]);

  return (
    <div
      ref={mountRef}
      style={{ width, height }}
      className="w-full h-full min-h-[420px] overflow-hidden rounded-xl bg-transparent shadow-sm flex items-center justify-center"
    />
  );
}
