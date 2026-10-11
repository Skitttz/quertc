import { createAsyncThunk } from "@reduxjs/toolkit";
import { getContacts } from "@/actions/user";
import type { IPublicUserWithName } from "@/interfaces/user";

export const fetchContacts = createAsyncThunk<IPublicUserWithName[]>(
  "contact/fetch",
  async () => getContacts(),
);
