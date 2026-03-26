# Типизация внешних данных и поддерживаемость кода

Интерактивный учебный проект для темы `Модуль 12 / Урок 60. Типизация внешних данных и поддерживаемость кода`.

## Что покрывает тема

- границу между статической типизацией TypeScript и реальными `unknown`-данными снаружи приложения;
- runtime schema validation с `Zod` для запросов, форм, мутаций и route-level данных;
- разницу между `as Type` и честным `safeParse`;
- схему как единый контракт между клиентом, сервером и инфраструктурой маршрутов;
- влияние типовой дисциплины на поддерживаемость full-stack React-кода.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту границы между TypeScript и внешними данными.
2. `Schema boundary`
   Показывает, как `Zod` проверяет сырой payload и почему `as Type` здесь ничего не гарантирует.
3. `Validated requests`
   Разбирает запросы, `loading/error/empty`, envelope parsing и schema failures.
4. `Mutations & forms`
   Показывает, как одна схема стабилизирует `FormData`, submit-логику и ответ сервера.
5. `Route contracts`
   Сравнивает parse в loader boundary, parse внутри компонента и unsafe cast.
6. `Playbook`
   Помогает выбрать, где именно нужна runtime validation, а где достаточно статических типов.

## Как тема выражена в коде проекта

Урок не только рассказывает о runtime validation, но и использует её в собственном коде:

- `src/components/external-data-labs/SchemaBoundaryLab.tsx`
  Живое сравнение сырого payload, `safeParse` и unsafe-предположения.
- `src/components/external-data-labs/ValidatedRequestsLab.tsx`
  Асинхронный запрос с envelope parsing и явными schema/network branches.
- `src/components/external-data-labs/MutationValidationLab.tsx`
  Типизированная форма, submit через schema boundary и валидация серверного ответа.
- `src/components/external-data-labs/RouteContractsLab.tsx`
  Route-level сравнение loader parse, component parse и unsafe cast.
- `src/lib/zod-schema-boundary-model.ts`
  Центральная схема внешней сущности и общие helpers для `ZodError`.
- `src/lib/request-validation-model.ts`
  Модель запросов и schema-aware request state.
- `src/lib/mutation-validation-model.ts`
  Валидация входящего form payload и исходящего mutation response.
- `src/lib/route-contract-model.ts`
  Boundary strategy для loader/component/full-stack сценариев.
- `src/lib/external-data-playbook-model.ts`
  Итоговый playbook по выбору уровня runtime validation.

## Важная оговорка про тему

TypeScript не видит, что реально пришло по сети, из `FormData`, cookie, URL или server boundary.
Внутри урока это показано честно:

- типы остаются полезны внутри уже проверенного приложения;
- но внешний payload сначала должен пройти через runtime schema;
- поэтому схема становится не “дополнением к TypeScript”, а входной границей доверия.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Zod `3.25.76`
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
