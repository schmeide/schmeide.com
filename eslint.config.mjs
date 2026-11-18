import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const noClasses = [
  {
    selector: "ClassDeclaration",
    message: "No classes. Use functions and plain data.",
  },
  {
    selector: "ClassExpression",
    message: "No classes. Use functions and plain data.",
  },
];

const restrictImports = (patterns) => [
  "error",
  {
    patterns: patterns.map(({ group, message, allowTypeImports = false }) => ({
      group,
      message,
      allowTypeImports,
    })),
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "out-open/**",
    "build/**",
    "design/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-syntax": ["error", ...noClasses],
      "no-param-reassign": ["error", { props: true }],
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "react/forbid-component-props": [
        "error",
        {
          forbid: ["style", { propName: "className", allowedFor: ["Link"] }],
        },
      ],
      "react/jsx-no-literals": ["error", { ignoreProps: true }],
    },
  },
  {
    files: ["src/app/**/route.tsx"],
    rules: {
      "react/forbid-dom-props": "off",
    },
  },
  {
    files: ["src/{components,content,lib}/**/*.{ts,tsx}"],
    rules: {
      "import/no-default-export": "error",
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-restricted-imports": restrictImports([
        {
          group: ["@/content", "@/content/*"],
          message:
            "Components receive content as props. Only type imports from the content module are allowed here.",
          allowTypeImports: true,
        },
        {
          group: ["@/app", "@/app/*"],
          message: "Components do not import from the app directory.",
        },
      ]),
    },
  },
  {
    files: ["src/content/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": restrictImports([
        {
          group: ["@/components", "@/components/*", "@/app", "@/app/*"],
          message: "The content module is data only. It may import from lib.",
        },
      ]),
    },
  },
  {
    files: ["src/lib/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": restrictImports([
        {
          group: [
            "@/components",
            "@/components/*",
            "@/content",
            "@/content/*",
            "@/app",
            "@/app/*",
          ],
          message: "lib is the bottom layer. It imports nothing from above.",
        },
      ]),
    },
  },
]);

export default eslintConfig;
