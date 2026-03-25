import type { StatusTone } from './learning-model';

export type FormScenario = {
  isRealForm: boolean;
  needsFieldErrors: boolean;
  needsPendingUi: boolean;
  hasMultipleSubmitOutcomes: boolean;
  submitIsFireAndForget: boolean;
  needsReturnedState: boolean;
};

export function chooseFormPattern(scenario: FormScenario): {
  primaryPattern:
    | 'manual-handler'
    | 'plain-form-action'
    | 'useActionState'
    | 'formAction-buttons'
    | 'useFormStatus';
  tone: StatusTone;
  rationale: string;
  followUp: string;
} {
  if (!scenario.isRealForm) {
    return {
      primaryPattern: 'manual-handler',
      tone: 'warn',
      rationale:
        'Если у экрана нет настоящего form-потока и FormData не добавляет смысла, action-model будет лишней абстракцией.',
      followUp:
        'Оставляйте обычный event handler там, где это не submit формы, а просто локальное действие интерфейса.',
    };
  }

  if (scenario.hasMultipleSubmitOutcomes) {
    return {
      primaryPattern: 'formAction-buttons',
      tone: 'success',
      rationale:
        'Разные async outcomes одной формы лучше выражаются через отдельные formAction-кнопки, а не через switch внутри общего submit handler.',
      followUp:
        'Если ещё нужен pending indicator возле кнопки, добавляйте useFormStatus рядом с button subtree.',
    };
  }

  if (scenario.needsFieldErrors || scenario.needsReturnedState) {
    return {
      primaryPattern: 'useActionState',
      tone: 'success',
      rationale:
        'useActionState полезен там, где submit должен вернуть structured state: ошибки, receipt, counters или другой результат action.',
      followUp:
        'Форма начинает жить вокруг async result, а не вокруг вручную собранных pending/error/useEffect связок.',
    };
  }

  if (scenario.needsPendingUi) {
    return {
      primaryPattern: 'useFormStatus',
      tone: 'success',
      rationale:
        'useFormStatus даёт pending и текущий FormData изнутри формы, не поднимая лишний state в родительский компонент.',
      followUp:
        'Этот инструмент лучше работает как локальный индикатор конкретной формы, а не как глобальный app-level loading flag.',
    };
  }

  if (scenario.submitIsFireAndForget) {
    return {
      primaryPattern: 'plain-form-action',
      tone: 'success',
      rationale:
        'Когда submit просто запускает async действие и не требует сложного returned state, plain form action даёт самый чистый поток.',
      followUp:
        'Форма остаётся близкой к DOM-модели и не обрастает лишним onSubmit-кодом.',
    };
  }

  return {
    primaryPattern: 'plain-form-action',
    tone: 'warn',
    rationale:
      'По умолчанию начинайте с самого простого form action и усложняйте модель только под реальный сигнал.',
    followUp:
      'Если позже появятся field-level errors, multiple outcomes или richer pending UI, добавляйте useActionState, formAction или useFormStatus точечно.',
  };
}
