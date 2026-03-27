import { decisionScenarios, type DecisionScenarioId } from './dom-hooks-domain';

type Recommendation = {
  recommended: string;
  avoid: string;
  why: string;
  before: string;
  after: string;
};

const recommendationMap: Record<DecisionScenarioId, Recommendation> = {
  'derived-filter': {
    recommended: 'Вычислить в render',
    avoid: 'useLayoutEffect + mirrored state',
    why: 'Это pure derivation. Новый hook здесь только усложнит поток данных и создаст риск рассинхрона.',
    before:
      'Сначала сохранять filteredItems в state, потом синхронизировать его effect-ом после каждого символа.',
    after:
      'Хранить только query и вычислять filteredItems прямо из query + исходного списка.',
  },
  'focus-invalid': {
    recommended: 'ref + событие submit',
    avoid: 'глобальный querySelector в effect',
    why: 'Focus нужен как точечная реакция на действие пользователя, а не как постоянный побочный процесс.',
    before:
      'После каждого render искать invalid input через document.querySelector и пытаться фокусировать его.',
    after:
      'На submit определить invalid field и сразу вызвать нужный ref.current?.focus().',
  },
  'position-popover': {
    recommended: 'useLayoutEffect',
    avoid: 'post-paint correction без причины',
    why: 'Геометрия должна согласоваться до paint, иначе overlay может прыгнуть уже на глазах.',
    before:
      'Сначала показать popover в запасной точке, затем переставить его обычным effect уже после paint.',
    after:
      'Измерить anchor и panel в useLayoutEffect и отдать готовое положение до первого видимого кадра.',
  },
  'inject-styles': {
    recommended: 'useInsertionEffect',
    avoid: 'обычный useEffect для CSS-in-JS runtime',
    why: 'Style tag должен появиться до layout-эффектов. Иначе измерения и positioning увидят устаревшие стили.',
    before:
      'Вставлять style tag после paint и надеяться, что никто не успеет измерить старый layout.',
    after:
      'Инжектить CSS в useInsertionEffect и держать этот hook только в слое стилизации.',
  },
  'child-command': {
    recommended: 'useImperativeHandle',
    avoid: 'передавать наружу raw DOM или сеттеры внутреннего state',
    why: 'Родителю нужен ограниченный API-команд, а не доступ ко всей внутренней кухне child-компонента.',
    before:
      'Пробрасывать наружу inputRef и несколько setState, чтобы родитель управлял child вручную.',
    after:
      'Оставить child владельцем состояния и выдать наружу команды open / focusSearch / reset.',
  },
  'widget-bridge': {
    recommended: 'ref host + lifecycle effect',
    avoid: 'смешивать JSX-детей и DOM, который рисует внешняя библиотека',
    why: 'Императивный widget должен жить в собственном контейнере и корректно уничтожаться на cleanup.',
    before: 'Позволять React и библиотеке одновременно переписывать один и тот же узел.',
    after:
      'Выделить host div, создать instance один раз и обновлять его через публичные методы.',
  },
};

export function getScenarioRecommendation(id: DecisionScenarioId) {
  return recommendationMap[id];
}

export function buildOverengineeringReport(kind: 'remove' | 'measure' | 'handle') {
  if (kind === 'remove') {
    return {
      title: 'Remove extra effect',
      summary:
        'Если логика сводится к вычислению из текущих props и state, advanced DOM hook ей не нужен.',
      snippet: [
        'const filteredItems = items.filter((item) =>',
        '  item.title.toLowerCase().includes(query.toLowerCase()),',
        ');',
      ].join('\n'),
    };
  }

  if (kind === 'measure') {
    return {
      title: 'Measure only when DOM matters',
      summary:
        'useLayoutEffect должен остаться вокруг реальной DOM-геометрии, а не вокруг обычной бизнес-логики.',
      snippet: [
        'useLayoutEffect(() => {',
        '  setPopoverPosition(readPosition(anchor, panel));',
        '}, [anchorId]);',
      ].join('\n'),
    };
  }

  return {
    title: 'Imperative API with boundaries',
    summary:
      'useImperativeHandle имеет смысл только там, где родителю действительно нужна команда, а не просто очередной prop.',
    snippet: [
      'useImperativeHandle(ref, () => ({',
      '  focusSearch,',
      '  reset,',
      '}), [focusSearch, reset]);',
    ].join('\n'),
  };
}

export function getDecisionScenarioTitle(id: DecisionScenarioId) {
  return decisionScenarios.find((scenario) => scenario.id === id)?.title ?? '';
}
