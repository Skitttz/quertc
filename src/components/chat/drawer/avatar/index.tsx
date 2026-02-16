import { Loader2 } from "lucide-react";
import { AvatarOverlayEnum } from "../constants";

function AvatarOverlay({
  state,
  progress,
}: {
  state: AvatarOverlayEnum;
  progress: number;
}) {
  if (state === AvatarOverlayEnum.uploading) {
    return <span className="text-white text-xs">{progress}%</span>;
  }

  if (state === AvatarOverlayEnum.loading) {
    return <Loader2 className="animate-spin text-white w-4 h-4" />;
  }

  return <span className="text-white text-xs font-medium">Alterar</span>;
}

export { AvatarOverlay };
