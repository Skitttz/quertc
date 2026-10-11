"use client";

import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { updateProfile } from "@/actions/user";
import { BIO_MAX_LENGTH, NAME_MAX_LENGTH } from "@/actions/user/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { patchCurrentUserData } from "@/store/slice/user";

export function ProfileForm() {
  const dispatch = useAppDispatch();
  const currentUserData = useAppSelector((state) => state.user.currentUserData);

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setFirstName(currentUserData?.firstName ?? "");
    setLastName(currentUserData?.lastName ?? "");
    setBio(currentUserData?.bio ?? "");
    setError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const result = await updateProfile({ firstName, lastName, bio });
    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    dispatch(patchCurrentUserData(result.data));
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex flex-col gap-2">
        {currentUserData?.bio && (
          <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
            {currentUserData.bio}
          </p>
        )}
        <Button variant="outline" size="sm" onClick={startEditing}>
          <PencilIcon />
          Editar perfil
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        aria-label="Nome"
        value={firstName}
        maxLength={NAME_MAX_LENGTH}
        onChange={(event) => setFirstName(event.target.value)}
        placeholder="Nome"
      />
      <Input
        aria-label="Sobrenome"
        value={lastName}
        maxLength={NAME_MAX_LENGTH}
        onChange={(event) => setLastName(event.target.value)}
        placeholder="Sobrenome"
      />
      <Textarea
        aria-label="Bio"
        value={bio}
        maxLength={BIO_MAX_LENGTH}
        onChange={(event) => setBio(event.target.value)}
        placeholder="Bio (opcional)"
        className="min-h-20 resize-none"
      />
      <span className="self-end text-xs text-muted-foreground">
        {bio.length}/{BIO_MAX_LENGTH}
      </span>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={saving}
          onClick={() => setEditing(false)}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1"
          loading={saving}
          disabled={!firstName.trim()}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
