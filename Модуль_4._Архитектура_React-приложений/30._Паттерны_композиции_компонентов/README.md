# Паттерны композиции компонентов

Интерактивный учебный проект для темы `Модуль 4 / 30. Паттерны композиции компонентов`.

## Что покрывает тема

- compound components;
- render props;
- higher-order components;
- `cloneElement` и `Children API`;
- разные способы строить гибкие API-компонентов;
- современные альтернативы и границы применения этих подходов;
- стоимость, anti-patterns и архитектурные trade-offs при проектировании гибкого component API.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Compound`
   Показывает compound components на реальном shell урока и отдельном учебном surface.
2. `Render props`
   Даёт одну поведенческую модель и несколько разных render-слоёв поверх неё.
3. `HOC`
   Показывает wrapper-архитектуру, injected props и границы higher-order components.
4. `Children API`
   Разбирает `cloneElement` и `Children.map` на прямых и обёрнутых детях.
5. `Alternatives`
   Сравнивает паттерны и современные альтернативы по требованиям сценария.
6. `Boundaries`
   Считает архитектурную стоимость паттерна: hidden contracts, wrapper layers и typing pressure.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о том, где паттерн помогает, а где начинает вредить.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому shell урока уже построен на compound components, render props и cloneElement показаны в реальных primitives, а HOC, recommendation models и cost models лежат в отдельных файлах как самостоятельный слой предметной логики.

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
