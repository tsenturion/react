import type { StatusTone } from './learning-model';

export type CallMoment = 'submit' | 'click' | 'change';

export function evaluateServerFunctionScenario(input: {
  callMoment: CallMoment;
  needsWindowApi: boolean;
  argsSerializable: boolean;
  needsSecretRead: boolean;
  expectsInstantTyping: boolean;
}) {
  let tone: StatusTone = 'success';
  let headline = 'Server Function подходит';
  let explanation =
    'Сценарий хорошо укладывается в server boundary: момент вызова явный, payload сериализуемый, browser APIs не нужны.';

  if (!input.argsSerializable) {
    tone = 'error';
    headline = 'Payload не подходит для серверной границы';
    explanation =
      'Аргументы должны пересекать boundary в сериализуемом виде. Такой сценарий требует другого контракта передачи данных.';
  } else if (input.needsWindowApi) {
    tone = 'error';
    headline = 'Browser API ломает server boundary';
    explanation =
      'Server Function не может читать `window`, DOM или локальное состояние браузера во время исполнения.';
  } else if (input.callMoment === 'change' || input.expectsInstantTyping) {
    tone = 'warn';
    headline = 'Для live-цикла server function слишком тяжёлая';
    explanation =
      'Server Function хорошо подходит для submit/click, но не для мгновенного onChange и живого ввода по каждому символу.';
  } else if (input.needsSecretRead) {
    tone = 'success';
    headline = 'Серверная граница особенно полезна';
    explanation =
      'Секреты, права доступа и приватные данные удобно держать рядом с серверной логикой и не пробрасывать в браузер.';
  }

  return {
    tone,
    headline,
    explanation,
    trace: [
      `Call moment: ${input.callMoment}`,
      input.argsSerializable ? 'Args are serializable' : 'Args are not serializable',
      input.needsWindowApi ? 'Needs browser APIs' : 'No browser APIs required',
      input.needsSecretRead
        ? 'Reads protected data on server'
        : 'No protected read required',
      input.expectsInstantTyping
        ? 'Needs instant typing loop'
        : 'Can tolerate submit/click boundary',
    ],
  };
}
