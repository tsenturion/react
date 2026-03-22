import type { StatusTone } from './learning-model';
import type { PatternChoice, PatternRequirements } from './pattern-domain';

export function recommendCompositionPattern(requirements: PatternRequirements): {
  primary: PatternChoice;
  tone: StatusTone;
  summary: string;
  reasons: string[];
  alternatives: string[];
} {
  if (requirements.logicReuseOnly) {
    return {
      primary: 'custom hook + explicit slots',
      tone: 'success',
      summary:
        'Если нужно переиспользовать только поведение, лучше вынести его в hook и оставить компонентный API явным.',
      reasons: [
        'Поведение переиспользуется без wrapper layers и без hidden children contracts.',
        'Типизация и читаемость обычно лучше, чем у HOC и cloneElement.',
      ],
      alternatives: ['render props', 'compound components'],
    };
  }

  if (requirements.needInjectIntoChildren) {
    return {
      primary: 'cloneElement + Children API',
      tone: 'warn',
      summary:
        'cloneElement и Children API подходят только для узких случаев, где вы действительно контролируете прямых детей и готовы принять хрупкий контракт.',
      reasons: [
        'Нужно пройтись по прямым детям и добавить им общий API.',
        'Паттерн работает только пока consumer соблюдает структуру children.',
      ],
      alternatives: ['compound components', 'custom hook + explicit slots'],
    };
  }

  if (requirements.legacyInterop) {
    return {
      primary: 'higher-order components',
      tone: 'warn',
      summary:
        'HOC ещё могут быть уместны для legacy wrapper-слоёв и framework integration, но в новом коде чаще выигрывают hooks и явная композиция.',
      reasons: [
        'Нужно навесить cross-cutting behaviour на уже существующий набор компонентов.',
        'Wrapper-стиль проще встроить в старый codebase, чем полностью пересобрать API.',
      ],
      alternatives: ['custom hook + explicit slots', 'render props'],
    };
  }

  if (requirements.sharedSubparts) {
    return {
      primary: 'compound components',
      tone: 'success',
      summary:
        'Compound components подходят, когда несколько частей одного surface должны делить state и semantics, но consumer должен свободно собирать layout.',
      reasons: [
        'Есть связанные subcomponents с общим root-контрактом.',
        'Порядок и вложенность частей важны для одного widget family.',
      ],
      alternatives: ['custom hook + explicit slots', 'render props'],
    };
  }

  if (requirements.callerControlsMarkup) {
    return {
      primary: 'render props',
      tone: 'success',
      summary:
        'Render props уместны там, где поведение общее, но внешний код должен сам решить, как именно рисовать результат.',
      reasons: [
        'Вы хотите сохранить логику в одном месте, но оставить полную свободу в render layer.',
        'Одни и те же данные нужно представить по-разному в нескольких сценариях.',
      ],
      alternatives: ['custom hook + explicit slots', 'compound components'],
    };
  }

  return {
    primary: 'custom hook + explicit slots',
    tone: requirements.strongTypingPriority ? 'success' : 'warn',
    summary:
      'Если явного выигрыша от старших паттернов нет, современный базовый выбор — hook для поведения и явный props/slots API для layout.',
    reasons: [
      'Такой подход обычно легче читать, тестировать и типизировать.',
      'Он оставляет меньше скрытых правил, чем HOC и cloneElement.',
    ],
    alternatives: ['compound components', 'render props'],
  };
}
