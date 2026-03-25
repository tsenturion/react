# Современные хуки React 19 для форм и оптимистичного UI

Интерактивный учебный проект для темы `Модуль 9 / 50. Современные хуки React 19 для форм и оптимистичного UI`.

## Что покрывает тема

- `useActionState` как returned state модели для async submit;
- `useFormStatus` как nearest-form status context для pending и snapshot текущей отправки;
- `useOptimistic` как способ показать ожидаемый результат до server confirmation;
- `pending / error / result UX` как единый поток формы;
- rollback optimistic UI при серверной ошибке;
- выбор между plain form action, одним hook и связкой нескольких hooks.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Hooks overview`
   Даёт карту современных form hooks и связывает API с реальным async UX формы.
2. `useActionState`
   Показывает validation, failure и result-state как returned state action.
3. `useFormStatus`
   Показывает nearest-form pending и snapshot payload без props drilling.
4. `useOptimistic`
   Показывает мгновенную optimistic карточку и rollback при отказе сервера.
5. `Full workflow`
   Соединяет `useActionState`, `useFormStatus` и `useOptimistic` в одном submit flow.
6. `Playbook`
   Помогает выбирать между plain action, отдельным hook и связкой нескольких API.

## Как тема выражена в коде проекта

Урок не только рассказывает о React 19 hooks, но и использует их в самом коде:

- `src/components/form-hooks/ActionStateFeedbackLab.tsx`
  Показывает returned state формы через `useActionState`.
- `src/components/form-hooks/FormStatusInspectorLab.tsx`
  Даёт форму с nested pending indicators на `useFormStatus`.
- `src/components/form-hooks/OptimisticQueueLab.tsx`
  Показывает optimistic overlay и rollback через `useOptimistic`.
- `src/components/form-hooks/UnifiedFeedbackFlowLab.tsx`
  Соединяет три hook API в одном async submit workflow.
- `src/components/form-hooks/FormStatusProbe.tsx`
  Даёт переиспользуемый дочерний компонент для чтения ближайшего form context.
- `src/lib/modern-form-hooks-domain.ts`
  Содержит `FormData` parser, payload types, receipt model и confirmed/optimistic entries.
- `src/lib/action-hooks-state-model.ts`
  Формализует success, validation и failure snapshots формы.
- `src/lib/modern-hooks-playbook-model.ts`
  Помогает выбирать правильный уровень абстракции для формы и optimistic UX.

## Важная оговорка про тему

Современные form hooks полезны там, где действительно есть submit формы, понятный payload,
ожидаемый async результат и необходимость локально выразить pending, error, result или
optimistic overlay. Если этого нет, они быстро превращаются в лишний слой сложности.

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
