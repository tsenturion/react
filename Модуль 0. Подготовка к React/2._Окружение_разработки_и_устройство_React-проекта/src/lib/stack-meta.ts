export const stackVersions = {
  react: '19.2.4',
  reactDom: '19.2.4',
  typescript: '5.7.3',
  eslint: '9.38.0',
  prettier: '3.6.2',
  vite: '7.1.4',
  viteReactPlugin: '5.0.2',
  tailwindcss: '4.2.1',
  tailwindcssVite: '4.2.1',
  vitest: '2.1.9',
  nodeImage: '22-alpine',
  nginxImage: '1.27-alpine',
} as const;

export const stackBadges = [
  `React ${stackVersions.react}`,
  `TypeScript ${stackVersions.typescript}`,
  `ESLint ${stackVersions.eslint}`,
  `Prettier ${stackVersions.prettier}`,
  `Vite ${stackVersions.vite}`,
  `@vitejs/plugin-react ${stackVersions.viteReactPlugin}`,
  `Tailwind CSS ${stackVersions.tailwindcss}`,
  `@tailwindcss/vite ${stackVersions.tailwindcssVite}`,
  `Vitest ${stackVersions.vitest}`,
  `Node ${stackVersions.nodeImage}`,
  `Nginx ${stackVersions.nginxImage}`,
] as const;

export const stackSummary = `React ${stackVersions.react}, TypeScript ${stackVersions.typescript}, ESLint ${stackVersions.eslint}, Prettier ${stackVersions.prettier}, Vite ${stackVersions.vite}, Tailwind CSS ${stackVersions.tailwindcss}, Vitest ${stackVersions.vitest} и контейнерный запуск через Node ${stackVersions.nodeImage} + Nginx ${stackVersions.nginxImage}.`;
