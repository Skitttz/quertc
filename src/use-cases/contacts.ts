"use client";

import { addContact, removeContact } from "@/actions/user";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { AddContact, RemoveContact } from "@/store/slice/contact";

export function useContacts() {
  const dispatch = useAppDispatch();
  const { contacts, loading } = useAppSelector((state) => state.contact);

  return {
    contacts,
    loading,
    isContact: (userId: string) => contacts.some((user) => user._id === userId),
    add: async (userId: string) => {
      const contact = await addContact({ userId });
      if (contact) dispatch(AddContact(contact));
      return contact;
    },
    remove: async (userId: string) => {
      const removed = await removeContact({ userId });
      if (removed) dispatch(RemoveContact(userId));
      return removed;
    },
  };
}
