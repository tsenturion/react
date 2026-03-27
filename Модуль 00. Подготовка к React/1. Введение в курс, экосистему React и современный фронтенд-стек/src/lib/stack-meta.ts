export const stackVersions = {
  react: '19.2.4',
  reactDom: '19.2.4',
  reactRouterDom: '7.13.1',
  typescript: '5.7.3',
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
  `React Router DOM ${stackVersions.reactRouterDom}`,
  `TypeScript ${stackVersions.typescript}`,
  `Vite ${stackVersions.vite}`,
  `@vitejs/plugin-react ${stackVersions.viteReactPlugin}`,
  `Tailwind CSS ${stackVersions.tailwindcss}`,
  `@tailwindcss/vite ${stackVersions.tailwindcssVite}`,
  `Vitest ${stackVersions.vitest}`,
  `Node ${stackVersions.nodeImage}`,
  `Nginx ${stackVersions.nginxImage}`,
] as const;

export const stackSummary = `React ${stackVersions.react}, React Router DOM ${stackVersions.reactRouterDom}, Vite ${stackVersions.vite}, @vitejs/plugin-react ${stackVersions.viteReactPlugin}, Tailwind CSS ${stackVersions.tailwindcss}, Vitest ${stackVersions.vitest} и контейнерный запуск через Node ${stackVersions.nodeImage} + Nginx ${stackVersions.nginxImage}.`;
