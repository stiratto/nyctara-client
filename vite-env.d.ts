/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;
  // Agrega otras variables de entorno que uses, por ejemplo:
  // VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

