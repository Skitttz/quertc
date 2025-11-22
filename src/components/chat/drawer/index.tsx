import { useClerk } from "@clerk/nextjs";
import { Calendar, Hash, Loader2, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { formatLongDatePtBr } from "@/utils/date-helpers";
import { getNameInitials } from "@/utils/text-helpers";
import { ItemInfo } from "./itemInfo";
import { drawerStyles } from "./styles";
import type { IProfileDrawerProps } from "./types";

export function ProfileDrawer({
  closeDrawer,
  name,
  userId,
  registrationDate,
  avatarUrl,
  onAvatarChange,
}: IProfileDrawerProps) {
  const { signOut } = useClerk();
  const [isLoadingSignout, setIsLoadingSignOut] = useState<boolean>(false);
  const { icon } = drawerStyles();

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

  const handleAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onAvatarChange) {
        onAvatarChange(file);
      }
    };
    input.click();
  };

  return (
    <SheetContent
      side="right"
      className="w-[280px] sm:w-[320px] p-6 flex flex-col gap-6"
    >
      <SheetHeader className="sr-only">
        <SheetTitle>Perfil do Usuário</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-2xl">
                {getNameInitials({ text: name })}
              </AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Alterar</span>
            </div>
          </button>

          <span className="text-xs text-muted-foreground">
            Clique para alterar sua foto
          </span>
        </div>
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
        />
        <ItemInfo
          name="Iniciou em"
          value={formatLongDatePtBr(registrationDate)}
          icon={<Calendar className={icon()} />}
        />
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="mt-auto w-full">
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
