import { updateUserAvatar } from "@/actions/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppRoutesEnum } from "@/shared/route";
import { patchCurrentUserData } from "@/store/userSlice";
import { formatLongDatePtBr } from "@/utils/date-helpers";
import { getNameInitials } from "@/utils/text-helpers";
import { beforeUpload, uploadFileToFirebase } from "@/utils/upload-helpers";
import { useClerk } from "@clerk/nextjs";
import { Calendar, Hash, Loader2, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AvatarOverlay } from "./avatar";
import { AvatarOverlayEnum } from "./constants";
import { ItemInfo } from "./itemInfo";
import { drawerStyles } from "./styles";
import type { IProfileDrawerProps, IUploadStateProps } from "./types";

export function ProfileDrawer({
  closeDrawer,
  name,
  userId,
  defaultAvatar,
  registrationDate,
  onAvatarChange,
  onAvatarLoaded,
  isAvatarLoading,
}: IProfileDrawerProps) {
  const { signOut } = useClerk();
  const { icon, avatarOverlay } = drawerStyles();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [isLoadingSignout, setIsLoadingSignOut] = useState(false);
  const [upload, setUpload] = useState<IUploadStateProps>({
    status: "idle",
    progress: 0,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const avatarUrl = preview ?? defaultAvatar;

  const avatarOverlayState =
    upload.status === "uploading"
      ? AvatarOverlayEnum.uploading
      : isAvatarLoading
        ? AvatarOverlayEnum.loading
        : AvatarOverlayEnum.idle;
  const isOverlayAlwaysVisible =
    avatarOverlayState === AvatarOverlayEnum.uploading ||
    avatarOverlayState === AvatarOverlayEnum.loading;

  const isShowingPreview = Boolean(preview);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!beforeUpload(file)) return;
    setPreview(URL.createObjectURL(file));
    uploadToFirebase(file);
  };

  const uploadToFirebase = async (file: File) => {
    try {
      setUpload({ status: "uploading", progress: 0 });

      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `avatars/${userId}.${extension}`;

      const downloadURL = await uploadFileToFirebase(
        { file, path },
        {
          onProgress: (progress) =>
            setUpload((prev) => ({ ...prev, progress })),
        },
      );

      await updateUserAvatar({ avatarUrl: downloadURL });
      onAvatarChange?.(downloadURL);
      setUpload({ status: "success", progress: 100 });
      dispatch(
        patchCurrentUserData({
          profilePicture: downloadURL,
        }),
      );
    } catch (error) {
      console.error(error);
      setUpload({ status: "error", progress: 0 });
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoadingSignOut(true);
      closeDrawer();
      await signOut({ redirectUrl: AppRoutesEnum.HOME });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSignOut(false);
    }
  };

  useEffect(() => {
    if (preview && defaultAvatar === preview) {
      setPreview(null);
    }
  }, [defaultAvatar, preview]);

  return (
    <SheetContent
      side="right"
      className="w-[280px] sm:w-[320px] p-6 flex flex-col gap-6"
    >
      <SheetHeader className="sr-only">
        <SheetTitle>Perfil do Usuário</SheetTitle>
      </SheetHeader>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          type="button"
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.status === "uploading"}
        >
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage
              key={avatarUrl}
              src={avatarUrl}
              alt={name}
              onLoad={() => {
                if (!isShowingPreview) {
                  onAvatarLoaded?.();
                }
              }}
              onError={() => {
                if (!isShowingPreview) {
                  onAvatarLoaded?.();
                }
              }}
            />
            {!avatarUrl && (
              <AvatarFallback className="text-2xl">
                {getNameInitials({ text: name })}
              </AvatarFallback>
            )}
          </Avatar>

          <div
            className={avatarOverlay({
              overlayVisible: isOverlayAlwaysVisible,
            })}
          >
            <AvatarOverlay
              progress={upload.progress}
              state={avatarOverlayState}
            />
          </div>
        </button>

        <span className="text-xs text-muted-foreground">
          Clique para alterar sua foto
        </span>
      </div>

      <div className="flex flex-col gap-4 border-t pt-4">
        <ItemInfo
          name="Seu nome"
          value={name}
          icon={<User className={icon()} />}
        />
        <ItemInfo
          name="Seu ID"
          value={userId}
          icon={<Hash className={icon()} />}
          tooltip={{
            content: "Compartilhe este ID para iniciar uma nova conversa",
          }}
        />
        <ItemInfo
          name="Iniciou em"
          value={formatLongDatePtBr(registrationDate)}
          icon={<Calendar className={icon()} />}
        />
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="mt-auto w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente sair?</AlertDialogTitle>
            <AlertDialogDescription>
              Você será desconectado da sua conta e precisará fazer login
              novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleSignOut}
              disabled={isLoadingSignout}
            >
              {isLoadingSignout && (
                <Loader2 className="animate-spin mr-2 size-4" />
              )}
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SheetContent>
  );
}
