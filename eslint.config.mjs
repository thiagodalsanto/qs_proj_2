import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {} */
export default [
  {
    files: ["**/www/scripts/*.js", "**/scripts/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jquery,
      },
    },
  },
  pluginJs.configs.recommended,
];
