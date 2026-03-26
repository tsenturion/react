# Продвинутая типизация компонентов и архитектуры

Интерактивный учебный проект для темы `Модуль 12 / Урок 59. Продвинутая типизация компонентов и архитектуры`.

## Что покрывает тема

- `useReducer` и discriminated unions как typed-модель сложной UI-логики;
- generics и generic-компоненты для reusable API;
- polymorphic components и typed `as`-pattern;
- design-system typing, variant maps и выразительные контракты primitives;
- типизацию сложных reusable API без потери читаемости;
- архитектурную роль типов: не только safety, но и дизайн интерфейса компонента.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: reducer unions, generics, polymorphism, design-system typing и rollout.
2. `Reducers & unions`
   Показывает, как typed reducer удерживает сложный editor flow в предсказуемых ветках.
3. `Generic APIs`
   Разбирает generic helpers и generic-компоненты на живых списках разных сущностей.
4. `Polymorphic components`
   Показывает, как `as`-pattern меняет семантику компонента и почему его контракт должен быть строгим.
5. `Design-system typing`
   Связывает token maps, variant recipes и reusable API primitives.
6. `Playbook`
   Помогает выбрать, где advanced typing действительно окупается и как вводить его без overengineering.

## Как тема выражена в коде проекта

Урок не только рассказывает о типах, но и выражает тему через структуру текущего проекта:

- `src/components/advanced-types-labs/ReducerUnionLab.tsx`
  Интерактивный typed editor на `useReducer` и discriminated unions.
- `src/components/advanced-types-labs/GenericComponentsLab.tsx`
  Generic list primitives и reusable contracts для разных типов данных.
- `src/components/advanced-types-labs/PolymorphicComponentsLab.tsx`
  Typed `as`-pattern и смена семантики без распада component API.
- `src/components/advanced-types-labs/DesignSystemTypingLab.tsx`
  Design-system recipes, token maps и выразительные reusable primitives.
- `src/components/advanced-types-labs/AdvancedTypingPlaybookLab.tsx`
  Итоговая стратегия внедрения advanced typing по типу проблемы и масштабу rollout.
- `src/lib/reducer-union-model.ts`
  Typed reducer, action union и helper-функции для editor workflow.
- `src/lib/generic-components-model.ts`
  Generic helpers и модели reusable API.
- `src/lib/polymorphic-components-model.ts`
  Базовая polymorphic-типизация и карта семантических различий.
- `src/lib/design-system-typing-model.ts`
  Token maps, recipes и typed primitives для design-system слоя.
- `src/lib/advanced-typing-playbook-model.ts`
  Архитектурный playbook внедрения продвинутой типизации.

## Важная оговорка про тему

Продвинутая типизация полезна не сама по себе.
Внутри урока это показано специально:

- generics не должны делать API “умным, но нечитаемым”;
- polymorphic components полезны только там, где реально нужен перенос семантики;
- design-system typing должен укреплять primitive layer, а не превращаться в лабиринт utility types;
- если тип начинает мешать понять компонент, значит контракт уже перегружен.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- Tailwind CSS `4.2.1`
- Vitest `2.1.9`
- Testing Library
- ESLint `9`
- Prettier `3`
- Docker + Nginx

## Команды

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Docker

```bash
docker compose up --build
```
