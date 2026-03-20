# Система событий в React

Интерактивный учебный проект для темы `Модуль 3 / 19. Система событий в React`.

## Что покрывает тема

- `SyntheticEvent` и то, что именно React передаёт в обработчики;
- назначение обработчиков через direct reference, inline wrapper и curried factory;
- bubbling и `stopPropagation()`;
- различия между React-событиями и нативными DOM events;
- `preventDefault()` и браузерные действия по умолчанию;
- связь между пользовательским событием, обновлением state и новым render;
- типичные ошибки с `event.target`, `event.currentTarget`, вызовом handler во время render и передачей аргументов.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Synthetic Events`
   Показывает разные паттерны назначения обработчиков и снимок `SyntheticEvent`.
2. `Bubbling и stopPropagation`
   Даёт живой nested sandbox с журналом всплытия.
3. `React vs DOM`
   Сравнивает JSX-handlers и native `addEventListener` на одном и том же клике.
4. `preventDefault`
   Разбирает browser default behavior на ссылке и checkbox.
5. `Event → State → UI`
   Показывает, как одно действие пользователя меняет state и приводит к новому визуальному результату.
6. `Паттерны и ошибки`
   Собирает типичные баги при работе с обработчиками и объектом события.

На каждой лаборатории есть:

- живые переключатели, клики и состояния;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о том, как выбранный паттерн влияет на поведение интерфейса.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому в проекте есть отдельные React-sandboxes для bubbling, default actions, native listeners и event-driven rerender, а рядом лежат pure models, которые фиксируют правила темы отдельно от UI.

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
