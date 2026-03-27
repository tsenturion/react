import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  intro: {
    files: [
      {
        path: 'src/components/state/BasicStateCard.tsx',
        note: 'Реальный компонент урока хранит несколько локальных состояний через отдельные вызовы `useState`.',
      },
      {
        path: 'src/lib/basic-state-model.ts',
        note: 'Чистая модель кратко объясняет роль state и собирает стартовый snippet.',
      },
      {
        path: 'src/pages/StateIntroPage.tsx',
        note: 'Страница связывает живой компонент, метрики и учебные пояснения.',
      },
    ],
    snippets: [
      {
        label: 'Несколько useState',
        note: 'Один компонент может хранить несколько независимых значений, если они управляют разными аспектами интерфейса.',
        code: [
          'const [likes, setLikes] = useState(12);',
          'const [bookmarked, setBookmarked] = useState(false);',
          'const [expanded, setExpanded] = useState(true);',
        ].join('\n'),
      },
      {
        label: 'State update',
        note: 'Пользовательское действие меняет не DOM напрямую, а состояние, из которого затем строится новый UI.',
        code: [
          '<button onClick={() => setLikes((current) => current + 1)}>',
          '  Добавить реакцию',
          '</button>',
        ].join('\n'),
      },
    ],
  },
  snapshot: {
    files: [
      {
        path: 'src/components/state/SnapshotLogger.tsx',
        note: 'Компонент намеренно пишет в журнал прямо из обработчика, чтобы показать: внутри него видно старый snapshot.',
      },
      {
        path: 'src/lib/snapshot-model.ts',
        note: 'Модель формулирует четыре ключевых шага snapshot-сценария.',
      },
      {
        path: 'src/pages/SnapshotPage.tsx',
        note: 'Страница связывает журнал, пояснение и код обработчика в одном месте.',
      },
    ],
    snippets: [
      {
        label: 'Snapshot handler',
        note: 'После `setCount(...)` обработчик всё ещё живёт в контексте текущего рендера.',
        code: [
          'function handleClick() {',
          '  setCount(count + 1);',
          '  console.log(count); // старый snapshot текущего рендера',
          '}',
        ].join('\n'),
      },
      {
        label: 'Journal update',
        note: 'Журнал тоже фиксирует то, что видел именно текущий рендер во время клика.',
        code: [
          'setJournal((current) => [',
          '  story.currentRenderLabel,',
          '  story.scheduledLabel,',
          '  story.sameHandlerLabel,',
          '  ...current,',
          ']);',
        ].join('\n'),
      },
    ],
  },
  batching: {
    files: [
      {
        path: 'src/components/state/BatchingScene.tsx',
        note: 'Компонент одним действием меняет несколько state-срезов и показывает итоговый UI после batching.',
      },
      {
        path: 'src/lib/batching-model.ts',
        note: 'Модель фиксирует, сколько частей интерфейса меняется в одном batched event.',
      },
      {
        path: 'src/pages/BatchingPage.tsx',
        note: 'Страница связывает live-сценарий и объяснение того, почему промежуточный UI не появляется.',
      },
    ],
    snippets: [
      {
        label: 'Batched event',
        note: 'Несколько вызовов `setState` могут описывать один следующий UI, а не три отдельных “мини-экрана”.',
        code: [
          'function publish() {',
          '  setVersion((current) => current + 1);',
          "  setStatus('published');",
          "  setFlash('Обновление отправлено');",
          '}',
        ].join('\n'),
      },
      {
        label: 'Reset state',
        note: 'Сброс тоже происходит через state и заново описывает исходное состояние экрана.',
        code: [
          'setVersion(1);',
          "setStatus('draft');",
          "setFlash('Изменений пока нет.');",
        ].join('\n'),
      },
    ],
  },
  queue: {
    files: [
      {
        path: 'src/components/state/QueueCounterSandbox.tsx',
        note: 'Здесь прямо в проекте сравниваются direct updates и functional updates на одном и том же счётчике.',
      },
      {
        path: 'src/lib/queue-model.ts',
        note: 'Чистая модель считает финальный результат и состав очереди для двух стратегий обновления.',
      },
      {
        path: 'src/pages/QueueUpdatesPage.tsx',
        note: 'Страница показывает и реальные кнопки, и аналитическое объяснение очереди обновлений.',
      },
    ],
    snippets: [
      {
        label: 'Direct queue',
        note: 'Все три вызова используют один и тот же snapshot текущего рендера.',
        code: [
          'setCount(count + 1);',
          'setCount(count + 1);',
          'setCount(count + 1);',
        ].join('\n'),
      },
      {
        label: 'Functional queue',
        note: 'Каждая функция читает уже queued result, поэтому цепочка действительно накапливает обновления.',
        code: [
          'setCount((prev) => prev + 1);',
          'setCount((prev) => prev + 1);',
          'setCount((prev) => prev + 1);',
        ].join('\n'),
      },
    ],
  },
  stale: {
    files: [
      {
        path: 'src/components/state/DelayedIncrementSandbox.tsx',
        note: 'Компонент буквально воспроизводит stale closure через `setTimeout` и показывает functional update как исправление.',
      },
      {
        path: 'src/lib/stale-state-model.ts',
        note: 'Модель считает ожидаемый результат для отложенных direct и functional updates.',
      },
      {
        path: 'src/pages/StaleStatePage.tsx',
        note: 'Страница связывает таймеры, журнал событий и сравнение двух стратегий.',
      },
    ],
    snippets: [
      {
        label: 'Stale callback',
        note: 'Callback замкнул `count` из старого рендера и использует его позже.',
        code: [
          'const captured = count;',
          'setTimeout(() => {',
          '  setCount(captured + 1);',
          '}, 400);',
        ].join('\n'),
      },
      {
        label: 'Fresh callback',
        note: 'Functional update не зависит от stale closure и читает актуальное значение в момент применения.',
        code: [
          'setTimeout(() => {',
          '  setCount((current) => current + 1);',
          '}, 400);',
        ].join('\n'),
      },
    ],
  },
  flow: {
    files: [
      {
        path: 'src/components/state/EnrollmentWorkbench.tsx',
        note: 'Реальный экран проекта использует несколько `useState` и переводит действия пользователя в новый UI.',
      },
      {
        path: 'src/lib/state-flow-model.ts',
        note: 'Модель собирает итоговую картину экрана из нескольких state-срезов.',
      },
      {
        path: 'src/pages/ActionFlowPage.tsx',
        note: 'Страница показывает, как разные значения state одновременно влияют на подписи, доступность и подтверждение.',
      },
    ],
    snippets: [
      {
        label: 'Screen state',
        note: 'Даже небольшой экран часто хранит несколько отдельных state-срезов.',
        code: [
          'const [plan, setPlan] = useState("starter");',
          'const [seats, setSeats] = useState(3);',
          'const [acceptedRules, setAcceptedRules] = useState(false);',
          'const [submitted, setSubmitted] = useState(false);',
        ].join('\n'),
      },
      {
        label: 'Action handler',
        note: 'Пользовательский клик меняет состояние, а не отдельные DOM-узлы напрямую.',
        code: [
          'onClick={() => {',
          '  setPlan(option);',
          '  setSubmitted(false);',
          '}}',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
