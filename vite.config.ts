import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import compression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), compression({
      algorithm: 'brotliCompress',
      ext: '.br', 
      deleteOriginFile: false, 
    })],
    test: {
      globals: true,
      environment: "jsdom",
      // setupFiles: './src/setupTests.ts'
    },
    server: {
      proxy: {
        "/api/": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
