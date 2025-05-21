/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUI_RPC: string;
  readonly VITE_PACKAGE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}