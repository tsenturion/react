# Основы TypeScript в React

Интерактивный учебный проект для темы `Модуль 12 / Урок 58. Основы TypeScript в React`.

## Что покрывает тема

- введение в TypeScript как часть современного React DX;
- типизацию компонентов, props и `children`;
- типизацию событий, `state` и `refs`;
- связь между типами данных, API компонента и устойчивостью интерфейса;
- discriminated unions для UI-состояний;
- ошибки типов как инструмент проектирования более предсказуемого интерфейса.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: component contracts, events, state, refs и UI reliability.
2. `Props & children`
   Показывает, как типы оформляют API компонента и запрещают конфликтующие варианты использования.
3. `Events & state`
   Разбирает типизацию форм, пользовательских событий и state-машины экрана.
4. `Refs & DOM`
   Показывает, как TypeScript помогает работать с DOM-узлами, таймерами и `currentTarget`.
5. `UI states`
   Связывает типы данных, загрузку, пустые состояния и устойчивость интерфейса.
6. `Playbook`
   Помогает выбрать, с чего начинать типизацию в реальном React-проекте.

## Как тема выражена в коде проекта

Урок не только рассказывает о TypeScript, но и выражает тему через структуру текущего проекта:

- `src/components/typescript-labs/PropsContractsLab.tsx`
  Интерактивный пример typed component API с `children` и взаимоисключающими props.
- `src/components/typescript-labs/EventsStateLab.tsx`
  Typed form handlers, `currentTarget`, state union и submit workflow.
- `src/components/typescript-labs/RefsDomLab.tsx`
  Типизированные `refs` для DOM-элементов и таймера автосохранения.
- `src/components/typescript-labs/UiStatesLab.tsx`
  Discriminated union для loading/error/empty/ready состояний.
- `src/components/typescript-labs/TypeScriptPlaybookLab.tsx`
  Итоговый chooser стратегии внедрения типов.
- `src/lib/props-contract-model.ts`
  Модель component contracts и сравнение loose/typed API.
- `src/lib/events-state-model.ts`
  Модель typed events и state workflow.
- `src/lib/refs-dom-model.ts`
  Практические сценарии типизации refs и DOM.
- `src/lib/ui-states-model.ts`
  Модель устойчивых UI-состояний и exhaustive handling.
- `src/lib/typescript-playbook-model.ts`
  Стратегия внедрения TypeScript в React-кодовую базу.

## Важная оговорка про тему

TypeScript не делает интерфейс автоматически правильным.
Внутри урока это показано честно:

- типы помогают раньше поймать несовместимые props и пропущенные ветки состояния;
- но типы не заменяют хорошую архитектуру, разумный API компонента и проверку поведения;
- поэтому sandboxes сравнивают не только синтаксис, но и последствия для UI-логики.

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
