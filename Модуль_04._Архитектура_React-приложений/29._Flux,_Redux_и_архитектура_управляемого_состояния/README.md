# Flux, Redux и архитектура управляемого состояния

Интерактивный учебный проект для темы `Модуль 4 / 29. Flux, Redux и архитектура управляемого состояния`.

## Что покрывает тема

- принципы Flux и однонаправленный поток данных на уровне приложения;
- Redux: actions, reducers, centralized state и selectors;
- когда Redux действительно нужен, а когда становится overkill;
- сравнение `Context` vs `Redux` и границы их ответственности;
- trade-offs при выборе централизованной модели;
- то, как меняются структура кода и способ мышления при переходе от локального state к store-driven архитектуре.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Flux loop`
   Показывает, как событие превращается в action, проходит через store и reducer, а затем возвращается в UI как новое состояние.
2. `Redux store`
   Даёт живой centralized store с actions, reducers, selectors и несколькими ветками интерфейса, которые читают один slice.
3. `One-way flow`
   Показывает, как один dispatch меняет несколько view-веток без прямой координации компонентов друг с другом.
4. `Context vs Redux`
   Помогает сравнить local state, lifting state up, context, context + reducer и Redux на разных сценариях.
5. `Overkill check`
   Показывает, как centralized store теряет пользу, если в него складывать local, URL и server concerns.
6. `Mental shift`
   Разбирает, как меняются структура проекта и архитектурное мышление при переходе к store-centric модели.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о границах применения и типичных ошибках.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому сам shell урока уже построен на Redux: активная лаборатория и глобальные режимы просмотра лежат в store, а feature-лаборатории используют реальные slices, typed hooks, selectors и pure functions вместо декоративной имитации.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- Redux Toolkit `2.11.2`
- React Redux `9.2.0`
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
