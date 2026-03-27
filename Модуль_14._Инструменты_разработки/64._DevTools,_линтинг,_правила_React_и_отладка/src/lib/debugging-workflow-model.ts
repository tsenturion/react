import type { StatusTone } from './learning-model';

export type DebugSymptomId =
  | 'wrong-props'
  | 'stale-effect'
  | 'extra-renders'
  | 'hook-order'
  | 'ref-timing'
  | 'context-drift';

export type DebugToolId = 'devtools' | 'lint' | 'profiler' | 'tests';

export const debugSymptomCards: readonly {
  id: DebugSymptomId;
  title: string;
  firstTool: DebugToolId;
  note: string;
}[] = [
  {
    id: 'wrong-props',
    title: 'Компонент получает не те props',
    firstTool: 'devtools',
    note: 'Сначала нужен живой snapshot props chain, а не линт.',
  },
  {
    id: 'stale-effect',
    title: 'Эффект использует устаревшее значение',
    firstTool: 'lint',
    note: 'Обычно quickest signal даёт hooks lint и dependency analysis.',
  },
  {
    id: 'extra-renders',
    title: 'Интерфейс перерисовывается слишком часто',
    firstTool: 'profiler',
    note: 'Сначала полезно понять render reasons и cost, а уже потом переписывать код.',
  },
  {
    id: 'hook-order',
    title: 'Падает из-за hook order',
    firstTool: 'lint',
    note: 'Это структурный баг, который лучше ловить правилом, а не по исключению в рантайме.',
  },
  {
    id: 'ref-timing',
    title: 'Ref ведёт себя нестабильно',
    firstTool: 'devtools',
    note: 'Нужно проверить ownership и момент чтения/записи ref относительно render/effect.',
  },
  {
    id: 'context-drift',
    title: 'Компоненты читают неожиданный context',
    firstTool: 'devtools',
    note: 'Нужно быстро увидеть provider boundary и текущие значения в дереве.',
  },
] as const;

export function buildDebuggingWorkflow(
  symptom: DebugSymptomId,
  availableTools: readonly DebugToolId[],
): {
  tone: StatusTone;
  title: string;
  steps: readonly string[];
  missingTool: string | null;
} {
  const card = debugSymptomCards.find((item) => item.id === symptom)!;

  if (!availableTools.includes(card.firstTool)) {
    return {
      tone: 'error',
      title: 'В диагностике отсутствует первый нужный инструмент',
      steps: [
        `Для симптома "${card.title}" первым обычно нужен инструмент: ${card.firstTool}.`,
        'Без него маршрут отладки начинается с догадок, а не с наблюдаемого сигнала.',
        'Сначала добавьте недостающий guardrail или способ диагностики.',
      ],
      missingTool: card.firstTool,
    };
  }

  return {
    tone: availableTools.length >= 3 ? 'success' : 'warn',
    title:
      availableTools.length >= 3
        ? 'Маршрут отладки выглядит устойчивым'
        : 'Маршрут отладки рабочий, но ещё хрупкий',
    steps: [
      `1. Локализуйте симптом через ${card.firstTool}.`,
      '2. Проверьте, проблема относится к данным, render-потоку или нарушению правил React.',
      availableTools.includes('lint')
        ? '3. Сверьте архитектурные сигналы линтера, чтобы не лечить следствие вместо причины.'
        : '3. Добавьте lint-проверку, если симптом относится к hooks, purity или refs.',
      availableTools.includes('tests')
        ? '4. Закрепите исправление тестом, чтобы баг не вернулся.'
        : '4. После исправления создайте тестовый guardrail для повторяемости.',
    ],
    missingTool: null,
  };
}
