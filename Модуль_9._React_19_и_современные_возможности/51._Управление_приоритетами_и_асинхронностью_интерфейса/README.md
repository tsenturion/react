# Управление приоритетами и асинхронностью интерфейса

Интерактивный учебный проект для темы `Модуль 9 / 51. Управление приоритетами и асинхронностью интерфейса`.

## Что покрывает тема

- `useTransition` и `startTransition` на практике;
- `useDeferredValue` в современном search/filter сценарии;
- `useEffectEvent` как effect-local callback без лишних resubscribe;
- `Activity` как boundary для управления видимостью поддеревьев;
- различие между urgent и non-urgent обновлениями;
- выбор между стабильным повседневным API и более редкими advanced boundary-инструментами.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту urgent/non-urgent обновлений, effect-local callback logic и hidden subtree boundaries.
2. `Transitions`
   Показывает `useTransition` и `startTransition` на одной рабочей доске.
3. `useDeferredValue`
   Показывает отстающее heavy-представление рядом со свежим input.
4. `useEffectEvent`
   Показывает стабильную внешнюю подписку с актуальным callback-поведением.
5. `Activity`
   Сравнивает hidden subtree через `Activity` и обычный conditional render.
6. `Playbook`
   Помогает выбирать между обычным state, transitions, deferred value, effect event и Activity.

## Как тема выражена в коде проекта

Урок не только рассказывает о concurrent и visibility API, но и использует их в самом коде:

- `src/components/priority-async/TransitionPriorityLab.tsx`
  Разводит urgent input и background work через `useTransition` и `startTransition`.
- `src/components/priority-async/DeferredValueLab.tsx`
  Показывает тяжёлое представление, которое читает `deferredQuery`, а не raw input.
- `src/components/priority-async/EffectEventLab.tsx`
  Реализует внешний pulse source и сравнение dependency-bound effect c `useEffectEvent`.
- `src/components/priority-async/ActivityVisibilityLab.tsx`
  Сравнивает `Activity` с обычной условной веткой и показывает сохранение локального draft.
- `src/components/priority-async/PriorityPlaybookLab.tsx`
  Даёт архитектурный advisor по выбору concurrent/visibility инструмента.
- `src/lib/priority-workbench-model.ts`
  Содержит тяжёлую модель рабочей доски и deferred/transition данные.
- `src/lib/effect-event-model.ts`
  Формализует pulse rooms, themes и смысл стабильной подписки.
- `src/lib/activity-visibility-model.ts`
  Описывает режимы `Activity` и contrast со стандартным unmount.
- `src/lib/priority-playbook-model.ts`
  Помогает выбирать правильный инструмент по типу проблемы интерфейса.

## Важная оговорка про тему

Не каждое торможение требует concurrent API, и не каждое hide/show оправдывает `Activity`.
Сначала нужно понять, что именно является срочным, что может догонять, какая подписка
реально лишняя и где локальный state действительно нельзя терять.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- `@vitejs/plugin-react` `5.0.2`
- Tailwind CSS `4.2.1`
- `@tailwindcss/vite` `4.2.1`
- Vitest `2.1.9`
- `@testing-library/react` `16.3.2`
- `@testing-library/jest-dom` `6.9.1`
- `@testing-library/user-event` `14.6.1`
- ESLint `9.38.0`
- Prettier `3.6.2`
- Docker Compose + Node `22-alpine` + Nginx `1.27-alpine`

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

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
