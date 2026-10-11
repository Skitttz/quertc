"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { searchUsers } from "@/actions/user";
import { USER_SEARCH_MIN_LENGTH } from "@/actions/user/constants";
import { UserAvatar } from "@/components/chat/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IUserSearchResult } from "@/interfaces/user";
import { useContacts } from "@/use-cases/contacts";
import { NewChatListUsersShimmer } from "../list/shimmer";

const SEARCH_DEBOUNCE_MS = 300;

export function AddContactForm() {
  const { add, isContact, remove } = useContacts();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<IUserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const query = search.trim();

  useEffect(() => {
    if (query.length < USER_SEARCH_MIN_LENGTH) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timeout = setTimeout(async () => {
      const users = await searchUsers({ query }).catch(() => []);
      if (cancelled) return;

      setResults(users);
      setLoading(false);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  const handleToggle = async (userId: string) => {
    setPendingId(userId);
    await (isContact(userId) ? remove(userId) : add(userId));
    setPendingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        autoFocus
        aria-label="Buscar pessoa"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Nome, usuário ou ID"
        icon={<SearchIcon size={18} />}
      />

      {query.length < USER_SEARCH_MIN_LENGTH ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Busque pelo nome ou usuário, ou cole o ID que a pessoa compartilhou
          com você.
        </p>
      ) : loading ? (
        <NewChatListUsersShimmer />
      ) : results.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Ninguém encontrado para “{query}”.
        </p>
      ) : (
        <div className="max-h-[50vh] space-y-2 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <UserAvatar
                  className="size-12 border-2 border-border"
                  fallbackClassName="text-2xl"
                  name={user.username}
                  src={user.profilePicture}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </div>
              </div>

              <Button
                variant={isContact(user._id) ? "outline" : "default"}
                loading={pendingId === user._id}
                onClick={() => handleToggle(user._id)}
              >
                {isContact(user._id) ? "Remover" : "Adicionar"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
