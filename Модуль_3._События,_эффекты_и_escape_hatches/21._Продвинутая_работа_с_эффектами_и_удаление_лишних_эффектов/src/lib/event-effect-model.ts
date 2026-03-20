import type { StatusTone } from './learning-model';

export type EventSeparationMode = 'effect-driven' | 'event-driven';

type EventReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<EventSeparationMode, EventReport> = {
  'effect-driven': {
    title: 'Бизнес-действие завязано на state + effect',
    tone: 'error',
    summary:
      'Логика публикации запускается не в момент клика, а на каждом render, где условия снова выполняются. Это делает flow непрозрачным.',
    snippet: [
      'useEffect(() => {',
      '  if (publishIntentId === 0) return;',
      '  sendPost(title, audience);',
      '}, [publishIntentId, title, audience]);',
    ].join('\n'),
  },
  'event-driven': {
    title: 'Событие пользователя обрабатывается в handler',
    tone: 'success',
    summary:
      'Если побочное действие напрямую связано с кликом или submit, логичнее выполнять его в event handler, а не ждать effect.',
    snippet: [
      'function handlePublish() {',
      '  sendPost(title, audience);',
      '  setPublishedCount((current) => current + 1);',
      '}',
    ].join('\n'),
  },
};

export function buildEventSeparationReport(mode: EventSeparationMode) {
  return reports[mode];
}

export function getPublishCount(mode: EventSeparationMode, editsAfterIntent: number) {
  if (mode === 'effect-driven') {
    return 1 + editsAfterIntent;
  }

  return 1;
}
