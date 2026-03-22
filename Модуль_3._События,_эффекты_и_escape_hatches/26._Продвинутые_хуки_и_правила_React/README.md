# Продвинутые хуки и правила React

Интерактивный учебный проект для темы `Модуль 3 / 26. Продвинутые хуки и правила React`.

## Что покрывает тема

- `useId`;
- `useDebugValue`;
- `useSyncExternalStore`;
- реальные кейсы применения advanced hooks;
- `rules of hooks`;
- purity;
- `lint-first` discipline;
- `exhaustive-deps`;
- ref pitfalls;
- `eslint-plugin-react-hooks`;
- смысл правил React как ограничений для предсказуемого выполнения компонента.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `useId`
   Показывает стабильные DOM-id для формы и сравнивает их с id из рендера.
2. `useDebugValue`
   Разбирает custom hook, который отдаёт читаемую summary-сводку в DevTools.
3. `useSyncExternalStore`
   Показывает подключение React к внешнему store и согласованные snapshot-ы.
4. `Rules of Hooks`
   Разбирает порядок hook slots через интерактивный симулятор двух рендеров.
5. `Purity и refs`
   Показывает render-phase нарушения, ref pitfalls и safe moves.
6. `Lint-first`
   Связывает реальные React-правила с `eslint-plugin-react-hooks` и preset-ами `recommended` / `recommended-latest`.

На каждой лаборатории есть:

- живые переключатели, формы и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о последствиях выбранного подхода.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальные `useId`, `useDebugValue`, `useSyncExternalStore`, внешний store с `subscribe/getSnapshot`, симулятор правил hooks, pure-модели для purity/lint решений и настоящий `eslint-plugin-react-hooks` в preset `recommended-latest`.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- TypeScript `5.7.3`
- ESLint `9.38.0`
- `eslint-plugin-react-hooks` `7.0.0`
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
npm run format
npm run lint
npm test
npm run build
```
