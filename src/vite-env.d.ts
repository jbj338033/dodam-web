/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GIT_URL: string;
  readonly VITE_AUTH_URL: string;
  readonly MODE?: "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
