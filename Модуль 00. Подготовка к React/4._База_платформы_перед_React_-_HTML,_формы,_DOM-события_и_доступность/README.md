# Platform Foundations Before React Lab

Интерактивный учебный проект для темы `Модуль 0 / 4. База платформы перед React: HTML, формы, DOM-события и доступность`.

## Что покрывает тема

- семантический HTML как основу качественного React UI;
- native-структуру форм: `form`, `label`, `input`, `select`, `textarea`, `fieldset`, `legend`, `button`, `required`, `disabled`, `readonly`, `FormData`;
- DOM events до React-абстракций: capture, bubble, default actions, `preventDefault`, `stopPropagation`;
- фокус, клавиатурную навигацию, `tabIndex`, natural tab order и programmatic focus;
- accessibility basics, accessible names и принцип `ARIA only when needed`;
- связь между нативным поведением браузера и последующим React-уровнем: формами, роутингом, событиями, refs и тестированием.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню переключения лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы есть 6 практических лабораторий:

1. `Семантический HTML`
   Показывает разницу между semantic landmarks и generic `div`-структурой на реальных шаблонах страниц.
2. `Формы платформы`
   Даёт живую форму с `FormData`, browser validation и различием `name`, `disabled`, `readonly`, `required`.
3. `DOM-события`
   Строит настоящий путь события через native listeners и показывает capture/bubble, `preventDefault` и `stopPropagation`.
4. `Фокус и клавиатура`
   Сравнивает button, link и fake-control по tab order, keyboard activation и `ref.focus()`.
5. `Доступность и ARIA`
   Разбирает accessible names, labels, native roles и случаи, когда ARIA нужен, а когда только дублирует платформу.
6. `Платформа под React`
   Связывает HTML, forms, events, focus и a11y с роутингом, refs и тестированием в будущих React-приложениях.

Во всех лабораториях есть:

- интерактивные переключатели и сценарии;
- ссылки на файлы текущего проекта и листинги из него;
- блоки `до/после` там, где они действительно помогают увидеть разницу поведения;
- типичные ошибки;
- короткие объяснения того, где это проявится на React-уровне.

Важный принцип проекта: тема показывается не только в UI-демо, но и в самом коде приложения. Поэтому в ключевых и неочевидных местах есть комментарии, а концепции стараются быть реализованы в их естественной форме: через семантические контейнеры, настоящие формы, native event listeners, focus management через refs и доступные роли/имена.

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

- `clsx` `2.1.1` для сборки состояний интерфейса;
- `@testing-library/react` `16.3.2`, `@testing-library/jest-dom` `6.9.1`, `@testing-library/user-event` `14.6.1` и `jsdom` `26.1.0` для тестовой среды;
- никаких внешних UI-библиотек поверх темы: HTML-элементы и поведение платформы остаются видимыми напрямую.

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
