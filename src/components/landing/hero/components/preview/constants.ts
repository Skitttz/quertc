import * as THREE from "three";
import type { MessageType } from "./types";

const DEFAULT_MESSAGE_ERROR = "Canvas 2D context unavailable.";
const DPR = 1;

export const DEFAULT_MESSAGES: MessageType[] = [
  {
    id: "1",
    lines: ["Opa, conseguiu ver o link que te mandei?"],
    received: true,
    avatarColor: 0xffd54f,
  },
  {
    id: "2",
    lines: ["Vi sim! Muito bom"],
    received: false,
    avatarColor: 0xc2c3c2,
  },
  {
    id: "3",
    lines: ["Vamos fechar isso então?"],
    received: true,
    avatarColor: 0xffd54f,
  },
  {
    id: "4",
    lines: ["Bora! Amanhã eu confirmo"],
    received: false,
    avatarColor: 0xc2c3c2,
  },
];

export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const R = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + R, y);
  ctx.arcTo(x + w, y, x + w, y + h, R);
  ctx.arcTo(x + w, y + h, x, y + h, R);
  ctx.arcTo(x, y + h, x, y, R);
  ctx.arcTo(x, y, x + w, y, R);
  ctx.closePath();
};

export function createTextCanvasTexture(
  textLines: string[],
  opts: {
    fontFamily?: string;
    fontSize?: number;
    padding?: number;
    bgColor?: string;
    textColor?: string;
    radius?: number;
  },
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const fontSize = opts.fontSize ?? 28;
  const padding = opts.padding ?? 12;
  const radius = opts.radius ?? 12;
  const fontFamily = opts.fontFamily ?? "Segoe UI, Roboto, sans-serif";
  const textColor = opts.textColor ?? "#fff";
  const bgColor = opts.bgColor ?? "#25D366";
  const lineHeight = fontSize * 1.3;

  const font = `${fontSize}px ${fontFamily}`;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(DEFAULT_MESSAGE_ERROR);

  ctx.font = font;
  const maxTextWidth = Math.max(
    ...textLines.map((t) => ctx.measureText(t).width),
  );
  const bubbleWidth = Math.ceil(maxTextWidth + padding * 2);
  const bubbleHeight = Math.ceil(lineHeight * textLines.length + padding * 2);

  canvas.width = bubbleWidth * dpr;
  canvas.height = bubbleHeight * dpr;

  ctx.scale(dpr, dpr);

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  const r = Math.min(radius, bubbleWidth / 2, bubbleHeight / 2);
  ctx.moveTo(r, 0);
  ctx.arcTo(bubbleWidth, 0, bubbleWidth, bubbleHeight, r);
  ctx.arcTo(bubbleWidth, bubbleHeight, 0, bubbleHeight, r);
  ctx.arcTo(0, bubbleHeight, 0, 0, r);
  ctx.arcTo(0, 0, bubbleWidth, 0, r);
  ctx.closePath();
  ctx.fill();

  ctx.font = font;
  ctx.fillStyle = textColor;
  ctx.textBaseline = "top";

  let y = padding;
  for (const line of textLines) {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return { texture, bubbleWidth, bubbleHeight };
}

export const createAvatarSprite = (colorInput: string | number) => {
  const size = 64;
  const cvs = document.createElement("canvas");
  cvs.width = size * DPR;
  cvs.height = size * DPR;
  cvs.style.width = `${size}px`;
  cvs.style.height = `${size}px`;

  const ctx = cvs.getContext("2d");
  if (!ctx) throw new Error(DEFAULT_MESSAGE_ERROR);

  ctx.scale(DPR, DPR);

  const colorHex =
    typeof colorInput === "number"
      ? `#${colorInput.toString(16).padStart(6, "0")}`
      : colorInput || "#aaaaaa";

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.fill();

  const tex = new THREE.CanvasTexture(cvs);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);

  const result = { sprite, sizePx: size };

  return result;
};
