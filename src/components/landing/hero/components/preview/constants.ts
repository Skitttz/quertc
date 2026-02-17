import type { MessageType } from "./types";

export const DEFAULT_MESSAGES: MessageType[] = [
  {
    id: "1",
    lines: ["Opa, conseguiu ver o link que te mandei?"],
    received: true,
  },
  {
    id: "2",
    lines: ["Vi sim! Muito bom"],
    received: false,
  },
  {
    id: "3",
    lines: ["Vamos fechar isso então?"],
    received: true,
  },
  {
    id: "4",
    lines: ["Bora! Amanhã eu confirmo"],
    received: false,
  },
];
