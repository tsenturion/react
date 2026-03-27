import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Compiler включён прямо в build pipeline проекта, чтобы урок показывал тему
// не только через UI-сравнения, но и через реальную конфигурацию toolchain.
const reactCompilerPlugin = [
  'babel-plugin-react-compiler',
  {
    compilationMode: 'infer',
    panicThreshold: 'none',
  },
] as const;

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [reactCompilerPlugin],
      },
    }),
    tailwindcss(),
  ],
});
