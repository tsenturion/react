# Устаревшие и удалённые API, обновление версий и миграционная дисциплина

Интерактивный учебный проект для темы `Модуль 13 / Урок 63. Устаревшие и удалённые API, обновление версий и миграционная дисциплина`.

## Что покрывает тема

- `findDOMNode`, `render`, `hydrate`, `unmountComponentAtNode` и другие deprecated/removed DOM APIs;
- legacy context, string refs и supporting code как часть migration surface;
- React `18.3` как предупреждающий мост к React `19`;
- codemods и их границы;
- release channels: `Latest`, `Canary`, `Experimental`;
- test suite как guardrail во время обновления;
- migration discipline как sequence: inventory → codemod → assumptions audit → tests → rollout.

## Что внутри

Проект сделан как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блоки `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту deprecated/removed API, release channels, tests и migration workflow.
2. `Removed DOM APIs`
   Показывает разницу между режимом предупреждений в `18.3` и реальной поломкой в `19`.
3. `18.3 → 19`
   Разбирает assumptions audit и показывает, почему codemod не равен завершённой миграции.
4. `Codemods & Channels`
   Сопоставляет code patterns, codemods и release channels.
5. `Test Guardrails`
   Показывает, какие слои тестов реально способны поймать migration regressions.
6. `Migration Workflow`
   Собирает полный playbook обновления версии для разных типов кодовой базы.

## Как тема выражена в коде проекта

Урок не только объясняет миграционную дисциплину, но и реализует её как модель в коде:

- `src/components/migration-labs/DeprecatedDomApisLab.tsx`
  Интерактивный аудит removed DOM API и связанных hidden assumptions.
- `src/components/migration-labs/UpgradeDisciplineLab.tsx`
  Workbench для проверки migration assumptions и rollout discipline.
- `src/components/migration-labs/CodemodReleaseLab.tsx`
  Связывает codemods с release channels и типами codebase patterns.
- `src/components/migration-labs/TestGuardrailLab.tsx`
  Показывает, какие migration risks реально закрываются выбранными слоями тестов.
- `src/components/migration-labs/MigrationWorkflowLab.tsx`
  Собирает фазовый migration plan.
- `src/lib/*.ts`
  Содержит чистые модели урока: deprecated API, upgrade readiness, release strategy, test guardrails и workflow.

## Важная оптика урока

Миграция React-версии здесь рассматривается не как механический rename API:

- deprecated вызов указывает на более глубокое устаревшее предположение о runtime;
- codemod может убрать синтаксис, но не может доказать корректность поведения;
- release notes полезны, если становятся hypotheses для проверки;
- test suite нужен как barrier against regressions, а не как формальная галочка;
- staged rollout почти всегда надёжнее, чем “сразу обновили всё”.

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
npm run lint
npm run test
npm run build
```
