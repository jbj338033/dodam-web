import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStore {
  accessToken: string;
  refreshToken: string;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearTokens: () => void;
}

export const useTokenStore = create(
  persist<TokenStore>(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearTokens: () => set({ accessToken: "", refreshToken: "" }),
    }),
    {
      name: "token-storage",
    },
  ),
);
