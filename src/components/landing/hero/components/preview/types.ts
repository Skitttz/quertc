import type * as THREE from "three";

interface IMouseCoords {
  x: number;
  y: number;
}

type MessageType = {
  id: string;
  lines: string[];
  received: boolean;
  avatarColor?: number;
};

type AnimEntryType = {
  mesh: THREE.Object3D;
  sprite: THREE.Sprite;
  start: number;
  avatarSize: number;
};

interface IChatPreviewProps {
  messages?: MessageType[];
  width?: string | number;
  height?: string | number;
}

export type { AnimEntryType, IChatPreviewProps, IMouseCoords, MessageType };
