# Доступность как часть качества React-приложения

Интерактивный учебный проект для темы `Модуль 7 / 43. Доступность как часть качества React-приложения`.

## Что покрывает тема

- labels и accessible names;
- focus order, keyboard support и возврат фокуса;
- semantic HTML, landmarks, роли и названия интерактивных элементов;
- `ARIA only when needed` и типичные злоупотребления;
- проверка доступности через живой интерфейс и `React Testing Library`;
- связь доступности с формами, событиями, навигацией и архитектурой компонента;
- типичные anti-patterns: placeholder вместо label, click-only hot spots, лишний `ARIA`, тесты по классам вместо поведения.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока с `skip link`, landmarks и route-aware announcement;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- в коде самого проекта есть реальные формы, keyboard flow, semantic shell и component tests.

Внутри приложения 6 лабораторий:

1. `Accessibility overview`
   Показывает карту темы и как доступность проходит через shell, формы, навигацию и тесты.
2. `Labels and names`
   Показывает связь между видимой подписью, accessible name, helper text и ошибкой.
3. `Keyboard and focus`
   Показывает keyboard support, порядок фокуса, диалог и возврат к триггеру.
4. `Semantics and roles`
   Показывает различие между native semantics, `div soup` и лишним или неверным `ARIA`.
5. `Testing and audits`
   Показывает, как проверять доступность через роли, имена, keyboard-поведение и user-centric assertions.
6. `A11y architecture`
   Показывает, как доступность влияет на компоненты, формы, маршруты, async-status и стратегию тестирования.

## Как тема выражена в коде проекта

Урок сам использует accessibility-паттерны в приложении:

- `src/router.tsx`
  Shell урока построен через `header`, `nav`, `main`, `footer`, `skip link` и `aria-live`.
- `src/components/accessibility/LabelAndErrorsLab.tsx`
  Показывает разницу между visible label, placeholder-only и `aria-label`.
- `src/components/accessibility/KeyboardFocusLab.tsx`
  Показывает keyboard flow, диалог, `Escape` и возврат фокуса.
- `src/components/accessibility/SemanticsAriaLab.tsx`
  Показывает native semantics, landmarks и границы применения `ARIA`.
- `src/components/accessibility/AccessibilityAuditLab.tsx`
  Показывает user-centric accessibility checks и живой чек-лист аудита.
- `src/test/test-utils.tsx`
  Содержит минимальный router helper для component tests без лишнего инфраструктурного шума.

Ключевые файлы:

- `src/lib/accessibility-domain.ts`
  Предметные данные: карта лабораторий, accessibility guides и shell surfaces.
- `src/lib/accessibility-runtime.ts`
  Pure-модели labels, keyboard flow, semantics, test strategy и архитектурных решений.
- `src/lib/project-study.ts`
  Ссылки на файлы проекта и листинги для каждой лаборатории.
- `src/lib/learning-model.test.ts`
  Unit tests для предметной логики урока.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- `@vitejs/plugin-react` `5.0.2`
- Tailwind CSS `4.2.1`
- `@tailwindcss/vite` `4.2.1`
- Vitest `2.1.9`
- `@testing-library/react` `16.3.2`
- `@testing-library/jest-dom` `6.9.1`
- `@testing-library/user-event` `14.6.1`
- ESLint `9.38.0`
- Prettier `3.6.2`
- Docker Compose + Node `22-alpine` + Nginx `1.27-alpine`

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

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
