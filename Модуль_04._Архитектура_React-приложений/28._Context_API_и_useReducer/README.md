# Context API и useReducer

Интерактивный учебный проект для темы `Модуль 4 / 28. Context API и useReducer`.

## Что покрывает тема

- `createContext`, `useContext` и context как способ доставки данных через дерево;
- `useReducer` для сложной логики и цепочек переходов состояния;
- архитектуру `Context + Reducer`;
- масштабирование обновлений и границы providers;
- сравнение с lifting state up;
- правила, которые помогают убрать prop drilling там, где он мешает, но не превращать приложение в глобальный контейнер для всего подряд.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Context delivery`
   Сравнивает prop drilling и context как delivery layer через дерево.
2. `useReducer logic`
   Показывает сложные transitions, actions и action log на одной reducer-модели.
3. `Context + Reducer`
   Собирает delivery и update logic в scoped workspace architecture.
4. `Provider boundaries`
   Показывает sibling providers, nested providers и независимые state islands.
5. `Strategy compare`
   Помогает понять, когда хватит lifting state up, а когда уже нужен context и reducer.
6. `Global container`
   Разбирает анти-паттерн одного AppContext для всех несвязанных concerns.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о границах применения и типичных ошибках.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому сам shell урока уже построен на `Context + Reducer`, а внутри лабораторий есть реальные scoped providers, reducer-модели, hooks чтения/dispatch и pure functions для архитектурных решений.

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
