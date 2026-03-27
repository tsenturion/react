# Как React рендерит UI: render, commit, purity и idempotency

Интерактивный учебный проект для темы `Модуль 1 / 11. Как React рендерит UI: render → commit, purity и idempotency`.

## Что покрывает тема

- различие между `render` и `commit`;
- причины ререндера;
- `purity` как требование к render-фазе;
- `idempotency` при одинаковых `props/state`;
- `reconciliation` и сравнение дерева интерфейса;
- цена лишних render-проходов и риски side effects внутри render.

## Что внутри

Проект сделан как одна учебная страница:

- сверху общий вводный блок;
- ниже меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок со стеком и рекомендацией, как читать код проекта.

Внутри 6 лабораторий:

1. `Render и commit`
2. `Причины ререндера`
3. `Purity`
4. `Idempotency`
5. `Reconciliation`
6. `Цена лишних проходов`

На каждой лаборатории есть:

- интерактивные переключатели и параметры;
- live-метрики и состояние интерфейса;
- листинги из текущего проекта;
- ссылки на реальные файлы урока через блок `ProjectStudy`.

Тема выражена и в самом коде:

- shell и лаборатории находятся в `src/App.tsx`;
- модели лежат в `src/lib/*.ts`;
- лабораторные sandboxes живут в `src/components/rendering-lab`;
- element inspection реализован в `src/components/rendering/ElementTreeView.tsx` и `src/lib/element-inspector.ts`;
- unit tests находятся в `src/lib/learning-model.test.ts`.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- TypeScript `5.7.3`
- ESLint `9.38.0`
- Prettier `3.6.2`
- Vite `7.1.4`
- Tailwind CSS `4.2.1`
- Vitest `2.1.9`
- Docker Compose + Node `22-alpine` + Nginx `1.27-alpine`

## Запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm run format:check
npm run lint
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
