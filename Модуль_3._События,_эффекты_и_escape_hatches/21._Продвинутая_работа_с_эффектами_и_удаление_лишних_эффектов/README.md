# Продвинутая работа с эффектами и удаление лишних эффектов

Интерактивный учебный проект для темы `Модуль 3 / 21. Продвинутая работа с эффектами и удаление лишних эффектов`.

## Что покрывает тема

- `async` внутри effect;
- race conditions;
- `abort` / cancel;
- stale closures;
- разделение событий и эффектов;
- `when you might not need an effect`;
- типичные anti-patterns;
- `useEffectEvent`;
- effect-local logic;
- способы избегать гонок данных, лишних перезапусков и скрытой связи между state и side effects;
- перестройку логики так, чтобы effect отвечал только за синхронизацию, а не за всю бизнес-логику компонента.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Async внутри effect`
   Показывает effect-local async function, cleanup и неправильную форму `async` callback.
2. `Race conditions`
   Разбирает stale responses, ignore stale work и `AbortController`.
3. `Stale closures`
   Показывает, как interval читает старый snapshot и чем отличаются `[count]` и functional updates.
4. `Events vs effects`
   Сравнивает business action в event handler и тот же flow, размазанный по `state + useEffect`.
5. `useEffectEvent`
   Показывает stale theme, reconnect storm и чтение свежих props без лишнего reconnect.
6. `Удаление лишних эффектов`
   Сводит mirrored state и derived state в один sandbox, где drift виден сразу.

На каждой лаборатории есть:

- живые переключатели, формы и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о последствиях выбранной архитектуры effect-а.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальные `useEffect`-сценарии с `fetch`, `AbortController`, stale closure sandboxes, `useEffectEvent` и сравнение mirrored vs derived state на одном наборе данных.

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
