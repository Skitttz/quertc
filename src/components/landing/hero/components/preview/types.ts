interface IMouseCoords {
  x: number;
  y: number;
}

type TypeMessage = {
  id: string;
  lines: string[];
  received: boolean;
  avatarColor?: number;
};

export type { IMouseCoords, TypeMessage };
