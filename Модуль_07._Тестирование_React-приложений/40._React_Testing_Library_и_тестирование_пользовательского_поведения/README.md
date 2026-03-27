# React Testing Library и тестирование пользовательского поведения

Интерактивный учебный проект для темы `Модуль 7 / 40. React Testing Library и тестирование пользовательского поведения`.

## Что покрывает тема

- `React Testing Library`;
- user-centric assertions;
- queries по ролям, лейблам и видимому тексту;
- `userEvent` и реальные пользовательские действия;
- тестирование форм, ошибок, success-state и доступных ролей;
- `act` как часть корректной синхронизации теста с интерфейсом;
- `custom render helpers`;
- отказ от implementation details.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- в коде самого проекта есть реальные RTL-компоненты, тесты и helper для провайдеров.

Внутри приложения 6 лабораторий:

1. `RTL overview`
   Показывает user-centric подход и общую карту темы.
2. `Query priority`
   Показывает роли, лейблы, `alert`, `status` и приоритет query.
3. `User interactions`
   Показывает `userEvent`, асинхронный UI-результат и границы `act`.
4. `Forms and errors`
   Показывает ввод, submit flow, ошибки и success-state.
5. `Custom render`
   Показывает helper с provider и router без лишней магии.
6. `Anti-patterns`
   Показывает границы темы: className hooks, чтение state и другие implementation details.

## Как тема выражена в коде проекта

Урок сам использует `React Testing Library`:

- `src/components/testing-library/QueryPriorityWorkbench.test.tsx`
  Проверяет доступные роли и query strategy.
- `src/components/testing-library/InteractionSequenceLab.test.tsx`
  Проверяет реальные пользовательские действия и асинхронный видимый результат.
- `src/components/testing-library/FeedbackFormLab.test.tsx`
  Проверяет форму, ошибки и success-state через `alert` и `status`.
- `src/components/testing-library/ProviderHarnessLab.test.tsx`
  Использует `custom render helper`, который скрывает provider/router-шум.
- `src/test/test-utils.tsx`
  Реальный helper для повторного рендера компонентов с провайдерами.

Ключевые файлы:

- `src/router.tsx`
  Общий shell урока и навигация лабораторий.
- `src/lib/rtl-runtime.ts`
  Pure-модели рекомендаций по query strategy, form coverage и test boundaries.
- `src/components/testing-library/FeedbackFormLab.tsx`
  Форма, намеренно спроектированная под пользовательские проверки.
- `src/components/testing-library/ProviderHarnessLab.tsx`
  Компонент, которому для теста нужен и provider, и router.
- `src/state/LessonTestPreferencesContext.tsx`
  Provider, который используется и в приложении, и в test helper.
- `src/lib/project-study.ts`
  Ссылки на файлы проекта и листинги для каждой лаборатории.

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
