import eslintPluginNext from 'eslint-plugin-next';

export default [
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json', // Adjust this path if needed
      },
    },
    plugins: {
      next: eslintPluginNext, // Correctly importing the Next.js plugin
    },
    rules: {
      'next/no-img-element': 'warn', // Example of a Next.js specific rule
    },
  },
];
