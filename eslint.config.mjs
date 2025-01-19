import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {} */
export default [
  {
    files: ["**/*.js"],
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