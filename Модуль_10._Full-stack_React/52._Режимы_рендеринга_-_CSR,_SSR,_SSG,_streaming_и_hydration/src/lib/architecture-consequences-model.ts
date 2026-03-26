import type { ModeId } from './render-mode-model';

export type ArchitectureScenarioId =
  | 'marketing-site'
  | 'knowledge-base'
  | 'commerce-listing'
  | 'analytics-workspace';

export type ArchitectureScenario = {
  id: ArchitectureScenarioId;
  label: string;
  summary: string;
  recommendedMode: ModeId;
  why: string;
};

export type ArchitectureMatrixRow = {
  dimension: string;
  csr: string;
  ssr: string;
  ssg: string;
  streaming: string;
};

export const architectureScenarios: readonly ArchitectureScenario[] = [
  {
    id: 'marketing-site',
    label: 'Marketing site',
    summary:
      'Контент почти статичен, SEO критичен, а глобальное кэширование даёт максимальную отдачу.',
    recommendedMode: 'ssg',
    why: 'Нужен быстрый HTML без per-request рендера и с минимальной стоимостью инфраструктуры.',
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge base',
    summary:
      'Статьи должны индексироваться и быстро открываться, но обновляются чаще, чем marketing landing.',
    recommendedMode: 'ssg',
    why: 'Чаще всего лучше предварительно строить HTML и отдельно обновлять изменившиеся документы.',
  },
  {
    id: 'commerce-listing',
    label: 'Commerce listing',
    summary:
      'Нужны и SEO, и быстрый shell, и возможность частями поднимать тяжёлые блоки каталога.',
    recommendedMode: 'streaming',
    why: 'Streaming помогает показать страницу сразу, не дожидаясь всех секций и персонализированных фрагментов.',
  },
  {
    id: 'analytics-workspace',
    label: 'Analytics workspace',
    summary:
      'SEO почти не даёт пользы, зато много клиентской интерактивности и авторизованных данных.',
    recommendedMode: 'csr',
    why: 'Клиентский shell и отдельная загрузка данных часто проще и честнее для такого типа продукта.',
  },
] as const;

const matrixByScenario: Record<ArchitectureScenarioId, readonly ArchitectureMatrixRow[]> =
  {
    'marketing-site': [
      {
        dimension: 'Откуда приходит HTML',
        csr: 'После boot клиента.',
        ssr: 'Генерируется на каждый запрос.',
        ssg: 'Готов в build-артефакте и кэше.',
        streaming: 'Shell приходит рано, остальное по кускам.',
      },
      {
        dimension: 'Кэширование',
        csr: 'Легко кэшировать только shell.',
        ssr: 'Нужно учитывать vary и персонализацию.',
        ssg: 'Агрессивное CDN-кэширование почти бесплатно.',
        streaming: 'Кэширование сложнее из-за per-request генерации.',
      },
      {
        dimension: 'SEO',
        csr: 'Слабое по умолчанию.',
        ssr: 'Сильное.',
        ssg: 'Сильное и предсказуемое.',
        streaming: 'Сильное, если критичный контент в первых чанках.',
      },
    ],
    'knowledge-base': [
      {
        dimension: 'Свежесть данных',
        csr: 'Всегда клиентский fetch.',
        ssr: 'Всегда свежо, но дорого.',
        ssg: 'Подходит, если есть rebuild/revalidate стратегия.',
        streaming: 'Подходит, если часть статьи зависит от сервера.',
      },
      {
        dimension: 'Сложность проекта',
        csr: 'Простой клиентский стек.',
        ssr: 'Нужны серверные entry points и data pipeline.',
        ssg: 'Нужен build pipeline и маршрутизация build-time контента.',
        streaming: 'Плюс ко всему нужны аккуратные Suspense boundaries.',
      },
      {
        dimension: 'Mismatch риск',
        csr: 'Hydration нет, но и SSR-выгоды нет.',
        ssr: 'Есть, если initial render нестабилен.',
        ssg: 'Есть, если build-time HTML расходится с клиентским first pass.',
        streaming: 'Есть и на shell, и на streamed boundaries.',
      },
    ],
    'commerce-listing': [
      {
        dimension: 'Above-the-fold UX',
        csr: 'Зависит от JS и может пустовать.',
        ssr: 'Хороший HTML сразу, но полный ответ ждёт сервер.',
        ssg: 'Хороший HTML, но inventory и рекомендации быстро устаревают.',
        streaming: 'Shell и hero рано, тяжёлые секции позже.',
      },
      {
        dimension: 'Персонализация',
        csr: 'После boot клиента и fetch.',
        ssr: 'Можно подмешать сразу в HTML.',
        ssg: 'Плохо совместима с сильно персонализированным above-the-fold.',
        streaming: 'Можно отдать общий shell и потом подтянуть персональные секции.',
      },
      {
        dimension: 'Операционная цена',
        csr: 'Дешевле на сервере, дороже по UX.',
        ssr: 'Дороже на сервере на каждый запрос.',
        ssg: 'Дёшево на запросе, дорого при высокой свежести данных.',
        streaming: 'Дороже всего по дисциплине, но окупается на больших экранах.',
      },
    ],
    'analytics-workspace': [
      {
        dimension: 'SEO польза',
        csr: 'Почти не нужна.',
        ssr: 'Обычно лишняя.',
        ssg: 'Почти бессмысленна.',
        streaming: 'Редко оправдана.',
      },
      {
        dimension: 'Interactivity',
        csr: 'Главный фокус сразу на клиенте.',
        ssr: 'HTML раньше, но затем всё равно нужен тяжёлый hydration.',
        ssg: 'Те же client costs плюс сборка.',
        streaming: 'Помогает только если есть тяжёлые серверные islands.',
      },
      {
        dimension: 'Архитектурный вывод',
        csr: 'Чаще всего самый честный выбор.',
        ssr: 'Только если критичен первый HTML при логине.',
        ssg: 'Обычно не совпадает с природой продукта.',
        streaming: 'Уместен для отдельных смешанных экранов, но не как дефолт.',
      },
    ],
  };

export function getArchitectureScenario(
  id: ArchitectureScenarioId,
): ArchitectureScenario {
  return architectureScenarios.find((item) => item.id === id) ?? architectureScenarios[0];
}

export function buildArchitectureMatrix(
  id: ArchitectureScenarioId,
): readonly ArchitectureMatrixRow[] {
  return matrixByScenario[id] ?? matrixByScenario['marketing-site'];
}
