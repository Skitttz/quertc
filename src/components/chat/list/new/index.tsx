"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { NewChatDialog } from "./components/dialog";
import type { NewChatDialogVariant } from "./components/dialog/types";
import { newChatDropdownItems } from "./constants";

export function NewChatDropdown() {
  const [openVariant, setOpenVariant] = useState<NewChatDialogVariant | null>(
    null,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex gap-2">
            <MessageCirclePlusIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {newChatDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => setOpenVariant(item.dialogKey)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {openVariant && (
        <NewChatDialog
          open={openVariant !== null}
          variant={openVariant}
          onOpenChange={(open) => {
            if (!open) setOpenVariant(null);
          }}
        />
      )}
    </>
  );
}
