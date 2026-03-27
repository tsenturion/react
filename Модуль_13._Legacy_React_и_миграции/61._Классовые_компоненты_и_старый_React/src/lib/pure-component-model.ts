import type { StatusTone } from './learning-model';

export type PureScenarioId = 'parent-noise' | 'mutated-object' | 'immutable-update';

export type PureScenarioCard = {
  id: PureScenarioId;
  title: string;
  tone: StatusTone;
  summary: string;
  regularReaction: string;
  pureReaction: string;
};

export const pureScenarioCards: readonly PureScenarioCard[] = [
  {
    id: 'parent-noise',
    title: 'Unrelated parent update',
    tone: 'warn',
    summary:
      'Родитель меняет счётчик или локальный шум, но сам объект props остаётся тем же.',
    regularReaction: 'Обычный Component ререндерится вместе с родителем.',
    pureReaction:
      'PureComponent пропускает ререндер, пока shallow compare считает props прежними.',
  },
  {
    id: 'mutated-object',
    title: 'Mutated object by reference',
    tone: 'error',
    summary: 'Поле внутри объекта изменилось, но сама ссылка на объект осталась прежней.',
    regularReaction:
      'Обычный Component всё равно увидит новые данные, потому что просто заново отрендерится.',
    pureReaction: 'PureComponent пропустит обновление и покажет устаревший UI.',
  },
  {
    id: 'immutable-update',
    title: 'Immutable update',
    tone: 'success',
    summary:
      'Объект создаётся заново через spread, поэтому shallow compare видит новую ссылку.',
    regularReaction: 'Обычный Component обновится как обычно.',
    pureReaction:
      'PureComponent корректно пропустит или выполнит ререндер в соответствии с новым reference.',
  },
] as const;

export const pureComponentGuardrails = [
  'PureComponent помогает только там, где данные обновляются иммутабельно.',
  'Если проблема архитектурная, shallow compare её не лечит.',
  'Сначала убирайте мутации и лишнее поднятие state, а потом уже опирайтесь на PureComponent.',
] as const;

export function explainPureScenario(id: PureScenarioId): PureScenarioCard {
  return pureScenarioCards.find((entry) => entry.id === id) ?? pureScenarioCards[0];
}
