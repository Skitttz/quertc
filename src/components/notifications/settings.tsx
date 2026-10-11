"use client";

import { BellIcon, BellOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  disablePush,
  enablePush,
  getPushStatus,
  type PushStatus,
} from "@/lib/push-client";
import { useDoNotDisturb } from "@/use-cases/do-not-disturb";

const STATUS_TEXT: Record<PushStatus, string> = {
  unsupported: "Este navegador não tem suporte a notificações.",
  unconfigured: "As notificações ainda não foram configuradas neste servidor.",
  blocked:
    "As notificações estão bloqueadas para este site nas permissões do navegador.",
  off: "Receba um aviso quando chegar mensagem, mesmo com o app fechado.",
  on: "Notificações ativadas neste navegador.",
};

export function NotificationSettings() {
  const { doNotDisturb, toggle, pending: togglingDnd } = useDoNotDisturb();
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getPushStatus().then(setStatus);
  }, []);

  const handleTogglePush = async () => {
    setPending(true);
    setFailed(false);
    try {
      const wanted = status === "on" ? "off" : "on";
      const next = await (status === "on" ? disablePush() : enablePush());
      setStatus(next);
      setFailed(next !== wanted && next !== "blocked");
    } catch (error) {
      console.error(error);
      setFailed(true);
      setStatus(await getPushStatus());
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <span className="text-xs text-muted-foreground">Notificações</span>

      {status && (
        <p className="text-sm text-muted-foreground">{STATUS_TEXT[status]}</p>
      )}

      {failed && (
        <p className="text-xs text-destructive">
          Não foi possível alterar as notificações neste navegador.
        </p>
      )}

      {(status === "off" || status === "on") && (
        <Button
          variant="outline"
          size="sm"
          loading={pending}
          onClick={handleTogglePush}
        >
          {status === "on" ? "Desativar notificações" : "Ativar notificações"}
        </Button>
      )}

      <Button
        variant={doNotDisturb ? "default" : "outline"}
        size="sm"
        aria-pressed={doNotDisturb}
        loading={togglingDnd}
        onClick={toggle}
      >
        {doNotDisturb ? <BellOffIcon /> : <BellIcon />}
        {doNotDisturb ? "Não Perturbe ativado" : "Ativar Não Perturbe"}
      </Button>
    </div>
  );
}
