import type { PitfallMode } from './event-domain';
import type { StatusTone } from './learning-model';

export type PitfallReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  badSnippet: string;
  goodSnippet: string;
};

export function buildPitfallReport(mode: PitfallMode): PitfallReport {
  if (mode === 'target-vs-currentTarget') {
    return {
      tone: 'warn',
      title: '`target` и `currentTarget` решают разные задачи',
      summary:
        '`event.target` указывает на самый внутренний узел, по которому реально кликнули. Если нужен элемент с назначенным обработчиком и его dataset, обычно требуется `event.currentTarget`.',
      badSnippet: 'const lessonId = event.target.dataset.lessonId;',
      goodSnippet: 'const lessonId = event.currentTarget.dataset.lessonId;',
    };
  }

  if (mode === 'invoke-during-render') {
    return {
      tone: 'error',
      title: 'Обработчик нельзя вызывать во время render',
      summary:
        '`onClick={removeItem(id)}` запускает функцию сразу при рендере и в обработчик передаёт уже результат вызова, а не функцию.',
      badSnippet: '<button onClick={removeItem(id)}>Delete</button>',
      goodSnippet: '<button onClick={() => removeItem(id)}>Delete</button>',
    };
  }

  return {
    tone: 'success',
    title: 'Аргументы передаются через wrapper или factory',
    summary:
      'Если обработчику нужен id или action name, передавайте их через inline wrapper или curried function, а не через немедленный вызов.',
    badSnippet: '<button onClick={selectLesson(id)}>Open</button>',
    goodSnippet: '<button onClick={() => selectLesson(id)}>Open</button>',
  };
}
