# React Project Anatomy Lab

Интерактивный учебный проект для темы `Модуль 0 / 2. Окружение разработки и устройство React-проекта`.

## Что покрывает тема

- `Node.js`, `npm`, `package.json` и `scripts` как реальный контракт проекта;
- `ES-модули`, `type="module"`, entry HTML и роль `src/main.tsx` как физической точки входа;
- `bundler`, `dev server`, `Vite` и разницу между исходниками, модульным графом и готовыми артефактами;
- `dev`/`prod` режимы, `hot reload`/`HMR` и отличие `dev`-поведения от production-сборки;
- структуру frontend-проекта: `index.html`, `main`, `App`, `pages`, `lib`, конфиги и delivery-файлы;
- жизненный цикл запуска проекта от `npm install` до браузера и контейнерной поставки;
- роль `ESLint` и `Prettier` как части среды разработки, а не отдельных факультативных инструментов;
- типичные ошибки окружения, `scripts`, импортов, сборки и их влияние на итоговый интерфейс.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню переключения лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы есть 6 практических лабораторий:

1. `Старт проекта`
   Показывает путь от `npm install` и `npm run dev` до первого рендера в браузере через `index.html`, `type="module"`, `src/main.tsx` и Vite pipeline.
2. `package.json и scripts`
   Позволяет менять manifest, `scripts`, `type: module`, lockfile, entry HTML и сразу смотреть, как ведут себя команды проекта.
3. `Структура проекта`
   Разбирает роли `index.html`, `src/main.tsx`, `src/App.tsx`, `src/pages`, `src/lib`, `vite.config.ts`, `eslint.config.js` и `Dockerfile`, чтобы было видно устройство frontend-проекта от root до delivery.
4. `Dev и production`
   Сравнивает `vite dev`, `vite build`, `vite preview` и `Docker + Nginx` по реальным ожиданиям от режима, включая `HMR`, production-ассеты и поведение браузера.
5. `Типовые поломки`
   Даёт диагностические сценарии для `scripts`, `ES-модулей`, imports, root element, env, dist и deployment.
6. `Качество кода`
   Показывает, как `TypeScript`, `ESLint`, `Prettier`, `Vitest` и `StrictMode` ловят разные классы ошибок на разных слоях проекта.

Во всех лабораториях есть:

- интерактивные переключатели и сценарии;
- ссылки на файлы текущего проекта и листинги из него;
- состояния `до/после` там, где они действительно помогают увидеть смену модели;
- типичные ошибки;
- короткие объяснения, где это применяется на практике.

Важный принцип проекта: тема показывается не только в UI-демо, но и в самом коде приложения. Поэтому в ключевых и неочевидных местах есть комментарии, а концепции стараются быть реализованы в их естественной форме: через React-компоненты, состояние, чистые функции JavaScript, реальный `package.json`, настоящие `eslint`/`prettier` конфиги, unit tests и Docker-файлы.

Отдельный архитектурный принцип этой темы: текущий проект намеренно остаётся простым `Vite`-приложением без дополнительного framework-слоя. Так здесь можно прямо разбирать `index.html`, `src/main.tsx`, `type="module"`, `HMR`, `dist`, `preview`, quality-gates и доставку без скрытой инфраструктуры поверх темы.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- TypeScript `5.7.3`
- ESLint `9.38.0`
- Prettier `3.6.2`
- Vite `7.1.4`
- `@vitejs/plugin-react` `5.0.2`
- Tailwind CSS `4.2.1`
- `@tailwindcss/vite` `4.2.1`
- Vitest `2.1.9`
- Docker Compose + Node `22-alpine` + Nginx `1.27-alpine`

Дополнительно:

- `clsx` `2.1.1` для сборки состояний интерфейса;
- `@testing-library/react` `16.3.2`, `@testing-library/jest-dom` `6.9.1`, `@testing-library/user-event` `14.6.1` и `jsdom` `26.1.0` для тестовой среды;
- `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` и `globals` как реальный слой статического анализа проекта.

## Запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm run lint
npm run format:check
npm test
npm run build
```

## Preview

```bash
npm run preview
```

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
