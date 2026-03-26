# Server Functions, директивы и формы с серверной логикой

Интерактивный учебный проект для темы `Модуль 10 / Урок 55. Server Functions, директивы и формы с серверной логикой`.

## Что покрывает тема

- что меняют `use client` и `use server` в full-stack React приложении;
- `Server Functions` как новая форма server boundary;
- формы как естественная точка асинхронного серверного действия;
- вызовы через серверную границу без привычного ручного API-слоя;
- отличие submit-driven сценариев от browser-driven local interaction;
- ограничения: сериализация, browser APIs, live typing, protected writes;
- архитектурный выбор между form action, client island, manual API и client-only сценарием.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: directives, server boundaries, формы, ограничения и новый full-stack mindset.
2. `Directives`
   Позволяет перемещать узлы между server и client и видеть цену этого решения.
3. `Invocation`
   Сравнивает manual API, server function и purely client flow.
4. `Forms`
   Показывает форму с server logic, `useActionState`, `useFormStatus`, pending/error/result UX.
5. `Constraints`
   Демонстрирует реальные ограничения server boundary: сериализация, browser APIs, live typing.
6. `Playbook`
   Помогает выбрать правильный transport-паттерн по свойствам реального экрана.

## Как тема выражена в коде проекта

Урок не только рассказывает о `Server Functions`, но и выражает тему через структуру текущего проекта:

- `src/components/server-functions-labs/DirectiveBoundaryLab.tsx`
  Интерактивная карта server/client placement.
- `src/components/server-functions-labs/InvocationFlowLab.tsx`
  Сравнение full-stack invocation flow.
- `src/components/server-functions-labs/ServerFormsLab.tsx`
  Форма с server-side submit и возвращаемым UI state.
- `src/components/server-functions-labs/ConstraintsLab.tsx`
  Проверка правил и ограничений server boundaries.
- `src/components/server-functions-labs/ServerFunctionsPlaybookLab.tsx`
  Playbook выбора правильной архитектуры.
- `src/lib/server-function-boundary-model.ts`
  Предметная модель узлов, presets и стоимости границы.
- `src/lib/server-function-flow-model.ts`
  Сравнение путей от submit до серверной мутации.
- `src/lib/server-function-form-model.ts`
  Парсинг `FormData` и возврат UI state после server action.
- `src/lib/server-function-constraints-model.ts`
  Правила применимости server functions.
- `src/lib/server-function-playbook-model.ts`
  Архитектурный выбор между server action, client island и manual API.
- `src/server/server-functions-runtime.ts`
  Учебная серверная логика с `use server`, валидацией и результатами мутаций.

## Важная оговорка про тему

Полноценные server functions в production зависят от framework/runtime-интеграции.
Внутри этого урока используется честная учебная модель:

- server/client boundaries анализируются как архитектурная система;
- submit-driven flow выражен в sandboxes проекта;
- `src/server/server-functions-runtime.ts` показывает server-side слой прямо в коде урока;
- при этом урок не притворяется полным framework transport для продакшн full-stack React.

Это ограничение показано осознанно, чтобы фокус оставался на реальной архитектуре границ, форм и серверной логики.

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
