import { Models } from "appwrite";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type States = {
  chats: Array<Models.Document> | [];
};

type Actions = {
  addChat: (data: Models.Document) => void;
  addChats: (data: Array<Models.Document>) => void;
  deleteChat: (id: string) => void;
};

export const chatStore = create<States & Actions>()(
  devtools((set) => ({
    chats: [],
    addChat: (data: Models.Document) =>
      set((state) => ({
        chats: [...state.chats, data],
      })),

    addChats: (data: Array<Models.Document>) =>
      set(() => ({
        chats: data,
      })),

    deleteChat: (id: string) =>
      set((state) => ({
        chats: state.chats.filter((item) => item.$id !== id),
      })),
  }))
);
