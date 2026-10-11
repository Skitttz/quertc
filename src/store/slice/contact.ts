import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IPublicUserWithName } from "@/interfaces/user";
import { fetchContacts } from "../thunks/contact";

export interface ContactState {
  contacts: IPublicUserWithName[];
  loading: boolean;
}

const initialState: ContactState = {
  contacts: [],
  loading: false,
};

const byName = (a: IPublicUserWithName, b: IPublicUserWithName) =>
  a.name.localeCompare(b.name, "pt-BR");

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    AddContact: (state, action: PayloadAction<IPublicUserWithName>) => {
      if (state.contacts.some((user) => user._id === action.payload._id))
        return;
      state.contacts = [...state.contacts, action.payload].sort(byName);
    },
    RemoveContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(
        (user) => user._id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { AddContact, RemoveContact } = contactSlice.actions;
export default contactSlice.reducer;
