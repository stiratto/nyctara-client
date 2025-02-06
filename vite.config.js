import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import compression from 'vite-plugin-compression';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    var env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react(), compression({
                algorithm: 'brotliCompress',
                ext: '.br', // Extensión del archivo comprimido
                deleteOriginFile: false, // No borres los archivos originales
            })],
        server: {
            proxy: {
                "/api/": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: function (path) { return path.replace(/^\/api/, ""); },
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
