# React Compiler и автоматическая оптимизация

Интерактивный учебный проект для темы `Модуль 11 / Урок 57. React Compiler и автоматическая оптимизация`.

## Что покрывает тема

- что такое React Compiler и чем он отличается от ручной мемоизации;
- автоматическая мемоизация и compiler-friendly стиль компонентов;
- конфигурация compiler plugin и compiler-aware linting;
- gradual rollout и безопасное включение компилятора по шагам;
- compiler bailouts, ограничения и типичные причины пропуска оптимизации;
- profiling workflow: как сравнивать поведение до и после по реальным симптомам;
- граница между тем, что компилятор оптимизирует автоматически, и тем, что остаётся задачей архитектуры.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: mental model, rollout, profiling, bailouts и architectural limits.
2. `Auto memoization`
   Сравнивает ручной memo-шум, compiler-friendly код и переусложнённую мемоизацию.
3. `Config & rollout`
   Показывает настройку compiler plugin, `recommended-latest` lint preset и стратегию постепенного включения.
4. `Bailouts`
   Разбирает случаи, где компилятор отказывается от оптимизации или помогает только частично.
5. `Profiling`
   Показывает workflow: сначала симптомы и Profiler, потом compiler, потом повторная проверка.
6. `Playbook`
   Помогает выбрать стратегию внедрения React Compiler для разных типов приложений.

## Как тема выражена в коде проекта

Урок не только рассказывает о React Compiler, но и выражает тему через структуру текущего проекта:

- `vite.config.ts`
  Подключает `babel-plugin-react-compiler` прямо в build-пайплайн проекта.
- `eslint.config.js`
  Использует `eslint-plugin-react-hooks` в режиме `recommended-latest`, чтобы compiler diagnostics были видны уже на уровне lint.
- `src/components/compiler-labs/AutomaticMemoizationLab.tsx`
  Сравнивает manual memoization, compiler-friendly код и over-memoized вариант.
- `src/components/compiler-labs/ConfigurationRolloutLab.tsx`
  Строит rollout plan и конфиг-сниппеты из реальных параметров.
- `src/components/compiler-labs/CompilerBailoutsLab.tsx`
  Разбирает bailouts, impure render и архитектурные ограничения.
- `src/components/compiler-labs/ProfilingDebugLab.tsx`
  Симулирует Profiler workflow и commit-time сравнения.
- `src/components/compiler-labs/CompilerPlaybookLab.tsx`
  Выбирает стратегию rollout по форме продукта и уровню риска.
- `src/lib/compiler-comparison-model.ts`
  Модель сравнения manual memoization, compiler-ready и over-memoized подходов.
- `src/lib/compiler-rollout-model.ts`
  Генерация конфигурации и поэтапного rollout plan.
- `src/lib/compiler-limitations-model.ts`
  Карта bailouts и границ применимости.
- `src/lib/compiler-profiler-model.ts`
  Profiling report и чтение commit-cost до и после.
- `src/lib/compiler-playbook-model.ts`
  Итоговая стратегия внедрения React Compiler.

## Важная оговорка про тему

React Compiler — это build-time оптимизация, а не кнопка “ускорить всё”.
Внутри урока это показано честно:

- compiler plugin реально включён в `vite.config.ts`;
- lint preset реально переведён на compiler-aware rules;
- sandboxes сравнивают не только синтаксис, но и behavioural/profiling последствия;
- при этом урок не притворяется production telemetry системой и не подменяет архитектурные проблемы одной лишь компиляцией.

Это ограничение показано осознанно, чтобы тема оставалась инженерной, а не превращалась в маркетинговую витрину “магической оптимизации”.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Compiler via `babel-plugin-react-compiler 1.0.0`
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
