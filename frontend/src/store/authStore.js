import { create } from "zustand";

const parseStoredSession = () => {
  const data = localStorage.getItem("safernest_session");
  return data ? JSON.parse(data) : null;
};

const initialSession = parseStoredSession();

export const useAuthStore = create((set) => ({
  token: initialSession?.token || null,
  user: initialSession?.user || null,
  setSession: (token, user) => {
    localStorage.setItem("safernest_session", JSON.stringify({ token, user }));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("safernest_session");
    set({ token: null, user: null });
  },
}));
