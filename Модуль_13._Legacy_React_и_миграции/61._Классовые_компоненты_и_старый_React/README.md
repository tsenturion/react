# Классовые компоненты и старый React

Интерактивный учебный проект для темы `Модуль 13 / Урок 61. Классовые компоненты и старый React`.

## Что покрывает тема

- классовые компоненты как старую модель описания интерфейса в React;
- `state`, `setState`, callback после commit и очередь обновлений;
- lifecycle methods: `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`;
- `createRef` и старые imperative DOM-паттерны;
- `PureComponent`, shallow compare и типичные ошибки с мутациями;
- class-based `Error Boundaries`;
- чтение и поддержка legacy-кода через современную оптику hooks и migration-first мышления.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту legacy mental model и показывает, где классы всё ещё встречаются.
2. `Class state`
   Показывает очередь `setState`, разницу между object-form и updater-form и callback после commit.
3. `Lifecycle methods`
   Разбирает mount/update/unmount, remount через `key` и guard discipline в `componentDidUpdate`.
4. `createRef`
   Показывает старый imperative подход к DOM и uncontrolled input через refs.
5. `PureComponent`
   Сравнивает обычный `Component` и `PureComponent`, включая баг от мутации объекта по ссылке.
6. `Maintenance`
   Объединяет class-based `Error Boundaries`, reset strategies и playbook чтения legacy React-кода.

## Как тема выражена в коде проекта

Урок не только рассказывает о классах, но и использует их в собственном коде:

- `src/components/legacy-react-labs/ClassStateLab.tsx`
  Реальный class component с очередью `setState`, updater-form и callback после commit.
- `src/components/legacy-react-labs/LifecycleLab.tsx`
  Два class components: workbench и probe с lifecycle logging.
- `src/components/legacy-react-labs/LegacyRefsLab.tsx`
  `createRef`, uncontrolled input и imperative DOM actions.
- `src/components/legacy-react-labs/PureComponentLab.tsx`
  Настоящий `React.PureComponent` и демонстрация shallow compare trap.
- `src/components/legacy-react-labs/LegacyErrorBoundary.tsx`
  Универсальный class-based boundary, который используется и в shell, и в maintenance laboratory.
- `src/components/legacy-react-labs/ErrorBoundariesLab.tsx`
  Падение части интерфейса, reset через `resetKey` и поддержка соседнего UI без полного сбоя.
- `src/main.tsx`
  Урок намеренно рендерится без `StrictMode`, чтобы жизненный цикл legacy classes читался прямо и без dev-only двойных mount probes.

## Важная оговорка про тему

Классовые компоненты не исчезли полностью:

- они всё ещё встречаются в старых кодовых базах, enterprise dashboards и старых design-system слоях;
- `Error Boundaries` в обычном React до сих пор остаются class-based API;
- поэтому важно не только уметь переписывать legacy-код на hooks, но и уверенно читать его, локализовать ошибки и поддерживать без лишней паники.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- Tailwind CSS `4.2.1`
- Vitest `2.1.9`
- Testing Library
- ESLint `9`
- Prettier `3`
- Docker + Nginx

## Команды

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Docker

```bash
docker compose up --build
```
