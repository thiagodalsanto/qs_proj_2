import globals from "globals";
import pluginJs from "@eslint/js";
import jqueryPlugin from "eslint-plugin-jquery";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module", // Use "module" para suportar import/export
      globals: {
        ...globals.browser, // Variáveis globais do navegador
        ...globals.node, // Variáveis globais do Node.js
        $: "readonly", // Adiciona $ como uma variável global
        jQuery: "readonly", // Adiciona jQuery como uma variável global
      },
    },
    plugins: {
      jquery: jqueryPlugin, // Adiciona o plugin jQuery
      import: pluginImport,
    },
    rules: {
      "jquery/no-ajax": "error", // Exemplo de regra do plugin jQuery
      "jquery/no-animate": "error", // Exemplo de regra do plugin jQuery
    },
  },
  pluginJs.configs.recommended, // Configurações recomendadas do ESLint
];
