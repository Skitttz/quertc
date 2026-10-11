"use client";

import { BellIcon, BellOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoNotDisturb } from "@/use-cases/do-not-disturb";

export function DoNotDisturbToggle() {
  const { doNotDisturb, toggle, pending } = useDoNotDisturb();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={doNotDisturb}
      aria-label={
        doNotDisturb ? "Desativar o Não Perturbe" : "Ativar o Não Perturbe"
      }
      title={doNotDisturb ? "Não Perturbe ativado" : "Não Perturbe"}
      disabled={pending}
      onClick={toggle}
    >
      {doNotDisturb ? (
        <BellOffIcon className="size-5 text-destructive" />
      ) : (
        <BellIcon className="size-5" />
      )}
    </Button>
  );
}
