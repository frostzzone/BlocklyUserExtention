import { fileURLToPath, URL } from "url";
import { join, parse, resolve } from "path";

import { defineConfig, normalizePath } from "vite";
import vue from "@vitejs/plugin-vue";

import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            [
              "field",
              "block",
              "category",
              "xml",
              "mutation",
              "value",
              "sep",
              "shadow",
            ].includes(tag),
        },
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: fileURLToPath(
            new URL("./node_modules/blockly/media/*", import.meta.url)
          ),
          dest: "media",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
	build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'docs/index.html'),
      },
    },
  },
});