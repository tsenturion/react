# Расширенные DOM-хуки и imperative integration

Интерактивный учебный проект для темы `Модуль 3 / 23. Расширенные DOM-хуки и imperative integration`.

## Что покрывает тема

- `useLayoutEffect`;
- `useInsertionEffect`;
- `useImperativeHandle`;
- синхронные эффекты до и после рисования;
- критичные сценарии измерений, позиционирования и инъекции стилей;
- expose imperative API наружу;
- интеграция со сторонними библиотеками и виджетами;
- границы применения этих инструментов и типичные случаи избыточного усложнения.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Timing`
   Показывает, чем отличается sync before paint от correction после paint.
2. `Positioning`
   Разбирает критичное измерение underline и remeasure через `ResizeObserver`.
3. `Insertion`
   Показывает реальную инъекцию style tag через `useInsertionEffect`.
4. `Imperative handle`
   Разбирает, как child-компонент отдаёт наружу только узкий imperative API.
5. `Widget bridge`
   Показывает bridge к внешнему imperative widget через отдельный host node.
6. `Boundaries`
   Сводит тему в архитектурные правила: где hook нужен, а где только усложняет код.

На каждой лаборатории есть:

- живые переключатели, формы и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о последствиях выбранного подхода.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальные `useLayoutEffect`, `useInsertionEffect`, `useImperativeHandle`, `ResizeObserver`, runtime style tags и bridge к внешнему imperative widget.

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
