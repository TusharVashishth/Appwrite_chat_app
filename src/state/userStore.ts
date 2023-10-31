import { create } from "zustand";
import { Models } from "appwrite";
import { devtools, persist } from "zustand/middleware";

type States = {
  userSession: Models.Session | object;
  user: Models.User<Models.Preferences> | object;
};

type Actions = {
  updateUserSession: (session: Models.Session) => void;
  updateUser: (user: Models.User<Models.Preferences>) => void;
  resetState: () => void;
};

export const userStore = create<States & Actions>()(
  devtools(
    persist(
      (set) => ({
        userSession: {},
        user: {},
        updateUserSession: (session: Models.Session) =>
          set(() => ({
            userSession: session,
          })),
        updateUser: (user: Models.User<Models.Preferences>) =>
          set(() => ({
            user: user,
          })),
        resetState: () =>
          set(() => ({
            user: {},
            userSession: {},
          })),
      }),
      { name: "chat_app_user_store" }
    )
  )
);
