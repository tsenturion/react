import type { StatusTone } from './learning-model';

export type AsyncEffectCase = 'correct' | 'wrong-callback' | 'mixed-business-logic';

type AsyncEffectReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<AsyncEffectCase, AsyncEffectReport> = {
  correct: {
    title: 'Effect-local async function',
    tone: 'success',
    summary:
      'Effect остаётся синхронным, а async-логика живёт внутри него. Cleanup владеет abort/ignore и закрывает предыдущий запуск.',
    snippet: [
      'useEffect(() => {',
      '  const controller = new AbortController();',
      '  async function load() {',
      '    const data = await request(query, controller.signal);',
      '    setResult(data);',
      '  }',
      '  void load();',
      '  return () => controller.abort();',
      '}, [query]);',
    ].join('\n'),
  },
  'wrong-callback': {
    title: 'Async callback прямо в useEffect',
    tone: 'error',
    summary:
      'Callback useEffect должен возвращать cleanup или ничего. Promise из async-функции ломает эту модель и скрывает cleanup.',
    snippet: [
      'useEffect(async () => {',
      '  const data = await request(query);',
      '  setResult(data);',
      '}, [query]);',
    ].join('\n'),
  },
  'mixed-business-logic': {
    title: 'Весь flow спрятан в effect',
    tone: 'warn',
    summary:
      'Если effect решает и бизнес-логику, и синхронизацию, связь между изменением state и побочным действием становится неочевидной.',
    snippet: [
      'useEffect(() => {',
      '  if (!canPublish) return;',
      '  createDraft(title, audience);',
      '  sendAnalytics(title);',
      '}, [canPublish, title, audience]);',
    ].join('\n'),
  },
};

export function buildAsyncEffectReport(id: AsyncEffectCase) {
  return reports[id];
}
