import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { 
      js,
      prettier: pluginPrettier 
    }, 
    extends: [
      "js/recommended", 
      "next/core-web-vitals", 
      "plugin:prettier/recommended"
    ], 
    languageOptions: { 
      globals: {...globals.browser, ...globals.node} 
    },
    rules: { "prettier/prettier": "error" },
    settings: { react: { version: "detect" } }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
