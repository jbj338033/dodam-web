/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DODAM_API_URL: string;
  readonly VITE_DAUTH_API_URL: string;
  readonly VITE_DGIT_API_URL: string;
  readonly MODE?: "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
