# Escape hatches React

Интерактивный учебный проект для темы `Модуль 3 / 24. Escape hatches React`.

## Что покрывает тема

- `createPortal`;
- portals;
- `flushSync`;
- редкие imperative-приёмы и точечные выходы за пределы обычной декларативной модели;
- модальные окна и вынос дерева в другую часть DOM;
- синхронные обновления в особых ситуациях;
- интеграция с внешними imperative API;
- границы применения escape hatches и архитектурные риски избыточного использования.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Portal modal`
   Показывает modal layer через `createPortal` и отдельный DOM-host.
2. `Portal events`
   Разбирает bubbling событий из portal по React-дереву.
3. `Layer escape`
   Сравнивает inline overlay и portal overlay в сценарии clipping/stacking traps.
4. `flushSync`
   Показывает редкий сценарий immediate DOM read после add-step.
5. `Imperative bridge`
   Разбирает state bridge к нативному `dialog.showModal()` / `close()`.
6. `Boundaries`
   Сводит тему в архитектурные правила: где escape hatch нужен, а где уже лишний.

На каждой лаборатории есть:

- живые переключатели, формы и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о последствиях выбранного подхода.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальные `createPortal`, `flushSync`, отдельный `#escape-hatches-root` в `index.html`, bridge к нативному `<dialog>` и сценарии, где escape hatch намеренно не нужен.

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
