import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "out/**",
      "coverage/**",
      "scripts/**",
      "src/data/**",
    ],
  },
  ...nextCoreWebVitals,
]

export default config

