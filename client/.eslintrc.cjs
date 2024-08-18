module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-undef": "off", // Disable no-undef rule
    "react/prop-types": "off", // Disable react/prop-types rule
    "no-unused-vars": "off", // Disable no-unused-vars rule
    "react/no-unescaped-entities": "off", // Disable react/no-unescaped-entities rule
    "react-hooks/exhaustive-deps": "off", // Disable react-hooks/exhaustive-deps rule
  },
};
