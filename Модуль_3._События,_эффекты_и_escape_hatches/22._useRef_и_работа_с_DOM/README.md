# useRef и работа с DOM

Интерактивный учебный проект для темы `Модуль 3 / 22. useRef и работа с DOM`.

## Что покрывает тема

- `useRef` как способ хранить mutable значение без ререндера;
- ссылки на DOM-элементы;
- `focus`;
- `scroll`;
- измерение DOM;
- `refs vs state`;
- хранение таймеров и внешних объектов;
- прямой доступ к DOM и его ограничения;
- когда imperatively управлять DOM допустимо, а когда это начинает конфликтовать с декларативной моделью React.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Mutable ref`
   Показывает, как ref меняется без render и чем это отличается от state.
2. `Focus и DOM refs`
   Разбирает `focus()`, jump to invalid field и восстановление последнего DOM-узла.
3. `Scroll`
   Показывает `scrollIntoView()` и map из id в DOM-элементы списка.
4. `Measure DOM`
   Разбирает `getBoundingClientRect()`, `clientWidth` и `ResizeObserver`.
5. `Таймеры и объекты`
   Показывает timer handles и внешние mutable objects в refs.
6. `Imperative boundary`
   Сравнивает допустимый imperative DOM и конфликт с React-owned JSX.

На каждой лаборатории есть:

- живые переключатели, формы и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о последствиях выбранного подхода.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальные `focus()`, `scrollIntoView()`, `getBoundingClientRect()`, `ResizeObserver`, timer handles, внешние mutable objects и намеренно конфликтные ручные DOM-мутации рядом с declarative JSX.

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
