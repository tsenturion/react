# Новая модель форм, actions и асинхронных обновлений

Интерактивный учебный проект для темы `Модуль 9 / 49. Новая модель форм, actions и асинхронных обновлений`.

## Что покрывает тема

- `form action` как новая базовая модель async submit;
- `formAction` и разные исходы одной формы;
- `useActionState` для validation, returned state и submit result;
- `useFormStatus` для pending и snapshot текущей отправки внутри формы;
- формы без лишней ручной orchestration-логики через `onSubmit`, `preventDefault`, цепочки `setState` и `useEffect`;
- выбор подходящего action-паттерна под реальный поток submit и асинхронного действия.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Actions overview`
   Даёт карту новой модели форм и связывает API с реальным submit flow.
2. `Form action`
   Показывает async submit формы без лишней ручной обвязки.
3. `useActionState`
   Показывает validation, returned state и pending внутри action-модели.
4. `formAction`
   Разводит draft, review и publish по отдельным button-specific actions.
5. `useFormStatus`
   Даёт pending и snapshot текущего FormData прямо из контекста формы.
6. `Playbook`
   Помогает выбирать между plain action, `useActionState`, `formAction` и `useFormStatus`.

## Как тема выражена в коде проекта

Урок не только рассказывает о React 19 forms, но и использует их в самом коде:

- `src/components/form-actions/ActionBasicsLab.tsx`
  Показывает plain `form action` и async submit без ручного `onSubmit`-boilerplate.
- `src/components/form-actions/ActionStateLab.tsx`
  Использует `useActionState` для returned validation/result state.
- `src/components/form-actions/FormActionButtonsLab.tsx`
  Выражает разные submit intents через `formAction` на кнопках.
- `src/components/form-actions/FormStatusWorkflowLab.tsx`
  Показывает pending и payload snapshot через `useFormStatus`.
- `src/components/form-actions/FormStatusProbe.tsx`
  Даёт вложенный статус-компонент для чтения ближайшего form context.
- `src/lib/forms-actions-domain.ts`
  Содержит `FormData`-parser, payload types и records отправки.
- `src/lib/action-state-model.ts`
  Формализует validation и returned action state.
- `src/lib/workflow-playbook-model.ts`
  Помогает выбирать action-паттерн под форму и её async flow.

## Важная оговорка про тему

Новая модель форм не означает, что любую кнопку нужно превращать в `action`. Эти API
полезны там, где действительно есть submit формы, payload `FormData`, async outcome и
ясный жизненный цикл отправки.

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
