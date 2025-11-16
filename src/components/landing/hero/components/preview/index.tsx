"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { TypeMessage } from "./types";

const DEFAULT_MESSAGES: TypeMessage[] = [
  { id: "1", lines: ["Opa"], received: true, avatarColor: 0xffd54f },
  { id: "2", lines: ["Eai, como vao as coisas?"], received: true },
  {
    id: "3",
    lines: ["Aqui estao bem e ai?"],
    received: false,
  },
  {
    id: "4",
    lines: ["Po por aqui tudo suave"],
    received: false,
  },
];

export const ChatPreview3D: React.FC<{
  messages?: TypeMessage[];
  width?: string | number;
  height?: string | number;
}> = ({ messages = DEFAULT_MESSAGES, width = "100%", height = "100%" }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const rect = mount.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(
      25,
      rect.width / rect.height,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const root = new THREE.Group();
    scene.add(root);

    const createBubble = (textLines: string[], color: string) => {
      const padding = 16;
      const fontSize = 32;
      const lineHeight = fontSize * 1.3;
      const maxWidth = 220;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      ctx.font = `${fontSize}px 'Segoe UI', Roboto, sans-serif`;

      const textHeight = lineHeight * textLines.length;
      const bubbleWidth = Math.min(
        maxWidth,
        Math.max(...textLines.map((l) => ctx.measureText(l).width)) + padding,
      );
      const bubbleHeight = textHeight;

      canvas.width = bubbleWidth * 2;
      canvas.height = bubbleHeight * 2;
      ctx.scale(2, 2);

      const radius = 18;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(bubbleWidth - radius, 0);
      ctx.quadraticCurveTo(bubbleWidth, 0, bubbleWidth, radius);
      ctx.lineTo(bubbleWidth, bubbleHeight - radius);
      ctx.quadraticCurveTo(
        bubbleWidth,
        bubbleHeight,
        bubbleWidth - radius,
        bubbleHeight,
      );
      ctx.lineTo(radius, bubbleHeight);
      ctx.quadraticCurveTo(0, bubbleHeight, 0, bubbleHeight - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.textBaseline = "top";

      let y = padding;
      textLines.forEach((line) => {
        ctx.fillText(line, padding, y);
        y += lineHeight;
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      const geometry = new THREE.PlaneGeometry(
        bubbleWidth / 200,
        bubbleHeight / 200,
      );
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      return { mesh, bubbleWidth };
    };

    const createAvatar = (color: number) => {
      const size = 64;
      const cvs = document.createElement("canvas");
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext("2d")!;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      ctx.fill();

      const tex = new THREE.CanvasTexture(cvs);
      tex.needsUpdate = true;
      const mat = new THREE.SpriteMaterial({ map: tex });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.3, 0.3, 1);
      return sprite;
    };

    const content = new THREE.Group();
    root.add(content);

    let currentY = 1.2;
    for (const msg of messages) {
      const color = msg.received ? "#056162" : "#25D366";
      const { mesh: bubble, bubbleWidth } = createBubble(msg.lines, color);

      const offsetX = msg.received ? -1.2 : 1.2;
      const zDepth = msg.received ? 0.01 : -0.01;
      bubble.position.set(offsetX, currentY, 0);
      bubble.scale.setScalar(0.001);
      content.add(bubble);

      const avatarColor =
        msg.avatarColor ?? (msg.received ? 0xaaaaaa : 0x6b21a8);
      const avatar = createAvatar(avatarColor);

      const avatarOffsetX = msg.received
        ? offsetX - bubbleWidth / 400 - 0.25
        : offsetX + bubbleWidth / 400 + 0.25;

      avatar.position.set(avatarOffsetX, currentY, zDepth - 0.05);
      avatar.scale.setScalar(0.001);
      content.add(avatar);

      new THREE.Vector3(offsetX, currentY, 0);
      currentY -= 0.6;

      const start = performance.now();
      const animateIn = () => {
        const p = Math.min(1, (performance.now() - start) / 500);
        const eased = 1 - (1 - p) ** 3;

        const scaleVal = THREE.MathUtils.lerp(0.001, 1, eased);

        bubble.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, p));
        avatar.scale.setScalar(scaleVal * 0.3);
        if (p < 1) requestAnimationFrame(animateIn);
      };
      animateIn();
    }

    // --- Animate & mouse interaction ---
    const animate = () => {
      requestAnimationFrame(animate);

      if (mouseRef.current.inside) {
        const targetRy = mouseRef.current.x * 0.05;
        const targetRx = mouseRef.current.y * 0.03;
        root.rotation.y += (targetRy - root.rotation.y) * 0.08;
        root.rotation.x += (targetRx - root.rotation.x) * 0.08;
      } else {
        root.rotation.x *= 0.9;
        root.rotation.y *= 0.9;
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Event listeners (only inside div) ---
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        mouseRef.current.inside = false;
        return;
      }
      mouseRef.current.inside = true;
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = mount;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(mount);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [messages]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[420px] overflow-hidden rounded-xl bg-[#e5ddd5] shadow-sm flex items-center justify-center"
    />
  );
};

export default ChatPreview3D;
