"use client";

import { useState } from "react";
import { ZoomableAvatar } from "@/components/chat/avatar-zoom";
import { Button } from "@/components/ui/button";
import type { IPublicUser } from "@/interfaces/user";
import { useContacts } from "@/use-cases/contacts";

export function ContactDetails({ user }: { user: IPublicUser }) {
  const { add, isContact, remove } = useContacts();
  const [pending, setPending] = useState(false);

  const name = `${user.firstName} ${user.lastName}`.trim();
  const saved = isContact(user._id);

  const handleToggle = async () => {
    setPending(true);
    await (saved ? remove(user._id) : add(user._id));
    setPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-4 text-center">
      <ZoomableAvatar
        className="size-24 border-2 border-border"
        fallbackClassName="text-2xl"
        name={name || user.username}
        src={user.profilePicture}
      />

      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{name || user.username}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>

      {user.bio && (
        <p className="whitespace-pre-wrap break-words text-sm">{user.bio}</p>
      )}

      <Button
        variant={saved ? "outline" : "default"}
        className="w-full"
        loading={pending}
        onClick={handleToggle}
      >
        {saved ? "Remover dos contatos" : "Adicionar aos contatos"}
      </Button>
    </div>
  );
}
