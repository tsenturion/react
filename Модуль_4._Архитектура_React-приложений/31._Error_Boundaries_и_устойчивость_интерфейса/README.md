# Error Boundaries и устойчивость интерфейса

Интерактивный учебный проект для темы `Модуль 4 / 31. Error Boundaries и устойчивость интерфейса`.

## Что покрывает тема

- обработку ошибок в React;
- `Error Boundaries` и `fallback UI`;
- локализацию сбоев и safe degradation;
- reset strategies: retry, `resetKeys`, remount по `key`;
- что boundaries ловят, а что остаётся вне их зоны;
- архитектурную роль boundaries при работе с рискованными и сторонними частями интерфейса.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Boundary basics`
   Показывает реальный class-based `Error Boundary`, fallback UI и журнал срабатываний.
2. `Isolation`
   Сравнивает локальные и общие boundaries по blast radius.
3. `Reset strategies`
   Разбирает retry, `resetKeys` и remount через `key`.
4. `What boundaries miss`
   Показывает, почему event handlers и async-код не попадают в boundary автоматически.
5. `Fallback UX`
   Сравнивает слабый и сильный fallback UI на одном и том же сбое.
6. `Architecture`
   Помогает выбрать слой boundary: widget, section, route или shell-safeguard.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о том, где boundary помогает, а где одного boundary уже недостаточно.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть настоящий class-based boundary, shell урока сам обёрнут в безопасный fallback, локальная и общая изоляция показаны на реальных subtree, а архитектурные рекомендации вынесены в pure models и тестируются отдельно.

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

- `clsx` `2.1.1`;
- `@testing-library/react` `16.3.2`, `@testing-library/jest-dom` `6.9.1`, `@testing-library/user-event` `14.6.1` и `jsdom` `26.1.0`.

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
