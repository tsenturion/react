# DevTools, линтинг, правила React и отладка

Интерактивный учебный проект для темы `Модуль 14 / Урок 64. DevTools, линтинг, правила React и отладка`.

## Что покрывает тема

- React DevTools и инспекцию `props`, `state`, `context`;
- eslint для React и `eslint-plugin-react-hooks`;
- Rules of React как систему ограничений: hooks order, purity, refs, component factories и unsupported syntax;
- debugging workflow: symptom → signal → confirmation → guardrail;
- связь между DevTools, линтером, тестами и architectural checks;
- понимание инструментов разработки как системы контроля качества, а не как набора разрозненных утилит.

## Что внутри

Проект сделан как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блоки `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Связывает DevTools, lint, Rules of React и debugging flow в одну модель.
2. `DevTools`
   Показывает component tree, props/state/context snapshot и render reasons.
3. `Linting`
   Сравнивает baseline hooks lint и strict architecture lint.
4. `Rules of React`
   Разбирает conditional hooks, factories, purity, refs и unsupported syntax.
5. `Debug flow`
   Помогает выбрать правильный первый инструмент по типу симптома.
6. `Quality system`
   Собирает DevTools, lint, tests и architectural guardrails в единый контур.

## Как тема выражена в коде проекта

Урок не только описывает tooling, но и использует его идеи прямо в собственном коде:

- `src/components/tooling-labs/DevToolsInspectorLab.tsx`
  Живой sandbox для чтения props/state/context snapshot и render reasons.
- `src/components/tooling-labs/LintRulesLab.tsx`
  Интерактивное сравнение baseline и strict lint-конфигов.
- `src/components/tooling-labs/RulesOfReactLab.tsx`
  Карта правил React через реальные smells и pressure-зоны.
- `src/components/tooling-labs/DebuggingWorkflowLab.tsx`
  Scenario-driven выбор первого диагностического инструмента.
- `src/components/tooling-labs/QualityControlSystemLab.tsx`
  Сборка quality loop из формы codebase и реальных gaps.
- `src/lib/*.ts`
  Чистые модели урока: overview, inspector, lint findings, Rules of React, debugging workflow и quality plan.
- `eslint.config.js`
  Тема выражена инфраструктурно: проект подключает `react-hooks` `recommended-latest`, а не только базовый hooks preset.

## Важная оптика урока

Инструменты разработки здесь рассматриваются не как отдельные экраны:

- DevTools полезен, когда помогает локализовать живой snapshot данных;
- lint полезен, когда отражает реальные архитектурные инварианты проекта;
- Rules of React полезны, когда ограничивают shape кода заранее;
- тесты полезны, когда закрепляют найденный баг как guardrail;
- вместе они образуют engineering loop, а не конкурирующие способы “искать проблему”.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- Tailwind CSS `4.2.1`
- ESLint `9.38.0`
- `eslint-plugin-react-hooks` `7.0.0`
- Vitest `2.1.9`
- Testing Library
- Prettier `3`
- Docker + Nginx

## Команды

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm test
npm run build
```

## Docker

```bash
docker compose up --build
```
