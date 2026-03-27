import type { FeedbackChannel } from './custom-hooks-domain';
import { feedbackChannelLabels } from './custom-hooks-domain';

export type FeedbackDraft = {
  name: string;
  channel: FeedbackChannel;
  message: string;
  includeCode: boolean;
};

export const defaultFeedbackDraft: FeedbackDraft = {
  name: '',
  channel: 'slack',
  message: '',
  includeCode: true,
};

export function validateFeedbackDraft(draft: FeedbackDraft) {
  return {
    name:
      draft.name.trim().length >= 2
        ? null
        : 'Укажите имя или роль, чтобы draft оставался читаемым.',
    message:
      draft.message.trim().length >= 20
        ? null
        : 'Опишите проблему чуть подробнее: меньше 20 символов скрывают суть.',
  };
}

export function buildFeedbackPreview(draft: FeedbackDraft) {
  const author = draft.name.trim() || 'неуказанного автора';
  const summary =
    draft.message.trim().length > 0 ? draft.message.trim() : 'описание пока не заполнено';
  const codeContext = draft.includeCode
    ? 'с кодовым контекстом'
    : 'без кодовых фрагментов';

  return `Черновик для ${feedbackChannelLabels[draft.channel]} от ${author}: ${summary}. Отправка пойдёт ${codeContext}.`;
}
