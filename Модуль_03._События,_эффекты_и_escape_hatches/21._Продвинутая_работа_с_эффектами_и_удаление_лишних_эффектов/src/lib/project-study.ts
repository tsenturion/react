import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  async: {
    files: [
      {
        path: 'src/components/advanced-effects/AsyncInsideEffectLab.tsx',
        note: 'Живой sandbox показывает effect-local async function, cleanup и размонтирование блока.',
      },
      {
        path: 'src/lib/advanced-effect-domain.ts',
        note: 'Здесь находится общий async helper с fetch, latency и abort-aware delay.',
      },
      {
        path: 'src/lib/async-effect-model.ts',
        note: 'Модель фиксирует правильную и неправильную форму async-эффекта.',
      },
    ],
    snippets: [
      {
        label: 'Effect-local async',
        note: 'Async логика остаётся внутри effect, а cleanup владеет отменой.',
        code: [
          'useEffect(() => {',
          '  const controller = new AbortController();',
          '  async function load() {',
          '    const [entry] = await searchAdvancedEffectPlaybook(topic, controller.signal);',
          '    setEntry(entry ?? null);',
          '  }',
          '  void load();',
          '  return () => controller.abort();',
          '}, [topic]);',
        ].join('\n'),
      },
      {
        label: 'Async callback smell',
        note: 'Promise из async-callback не является cleanup для useEffect.',
        code: [
          'useEffect(async () => {',
          '  const data = await request(query);',
          '  setResult(data);',
          '}, [query]);',
        ].join('\n'),
      },
    ],
  },
  race: {
    files: [
      {
        path: 'src/components/advanced-effects/RaceConditionLab.tsx',
        note: 'Лаборатория запускает быстрые query changes и показывает три стратегии борьбы с гонками.',
      },
      {
        path: 'src/lib/race-condition-model.ts',
        note: 'Модель формулирует difference между bad / ignore / abort.',
      },
      {
        path: 'public/data/advanced-effects-playbook.json',
        note: 'Локальный dataset позволяет изучать race conditions без внешнего API.',
      },
    ],
    snippets: [
      {
        label: 'Ignore stale response',
        note: 'Guard защищает state, но не отменяет сам запрос.',
        code: [
          'let active = true;',
          'searchAdvancedEffectPlaybook(query).then((nextResults) => {',
          '  if (!active) return;',
          '  setResults(nextResults);',
          '});',
          'return () => { active = false; };',
        ].join('\n'),
      },
      {
        label: 'Abort stale request',
        note: 'Cleanup закрывает внешний async-процесс, а не только локальную запись в state.',
        code: [
          'const controller = new AbortController();',
          'searchAdvancedEffectPlaybook(query, controller.signal);',
          'return () => {',
          '  controller.abort();',
          '};',
        ].join('\n'),
      },
    ],
  },
  closures: {
    files: [
      {
        path: 'src/components/advanced-effects/StaleClosureLab.tsx',
        note: 'Лаборатория сравнивает stale snapshot, [count] и functional updates на одном interval.',
      },
      {
        path: 'src/lib/stale-closure-model.ts',
        note: 'Модель формулирует ожидаемые значения и цену resubscribe-подхода.',
      },
      {
        path: 'src/pages/StaleClosurePage.tsx',
        note: 'Страница связывает snapshots render-а и поведение внешнего interval.',
      },
    ],
    snippets: [
      {
        label: 'Stale interval',
        note: 'Interval пишет `count + 1`, но `count` взят из старого render-а.',
        code: [
          'useEffect(() => {',
          '  const id = setInterval(() => {',
          '    setCount(count + 1);',
          '  }, 700);',
          '  return () => clearInterval(id);',
          '}, []);',
        ].join('\n'),
      },
      {
        label: 'Functional update',
        note: 'Updater function читает актуальный state из очереди React.',
        code: [
          'useEffect(() => {',
          '  const id = setInterval(() => {',
          '    setCount((current) => current + 1);',
          '  }, 700);',
          '  return () => clearInterval(id);',
          '}, []);',
        ].join('\n'),
      },
    ],
  },
  events: {
    files: [
      {
        path: 'src/components/advanced-effects/EventsVsEffectsLab.tsx',
        note: 'Живой пример показывает, как business action начинает дублироваться, если спрятать его в effect.',
      },
      {
        path: 'src/lib/event-effect-model.ts',
        note: 'Модель сравнивает event-driven и effect-driven причинно-следственную цепочку.',
      },
      {
        path: 'src/pages/EventSeparationPage.tsx',
        note: 'Страница объясняет, где заканчивается событие и начинается синхронизация.',
      },
    ],
    snippets: [
      {
        label: 'Effect-driven publish',
        note: 'Действие уходит на каждый render, где publishIntent всё ещё валиден.',
        code: [
          'useEffect(() => {',
          '  if (publishIntentId === 0) return;',
          '  sendPost(title, audience);',
          '}, [publishIntentId, title, audience]);',
        ].join('\n'),
      },
      {
        label: 'Event-driven publish',
        note: 'Клик и побочное действие остаются в одном месте.',
        code: [
          'function handlePublish() {',
          '  sendPost(title, audience);',
          '  setPublishedCount((current) => current + 1);',
          '}',
        ].join('\n'),
      },
    ],
  },
  'effect-event': {
    files: [
      {
        path: 'src/components/advanced-effects/EffectEventLab.tsx',
        note: 'В проекте есть три runtime-варианта: stale theme, theme dependency и useEffectEvent.',
      },
      {
        path: 'src/lib/effect-event-model.ts',
        note: 'Модель считает reconnect cost и объясняет различие режимов.',
      },
      {
        path: 'src/lib/advanced-effect-domain.ts',
        note: 'Здесь реализовано внешнее соединение через createManualConnection().',
      },
    ],
    snippets: [
      {
        label: 'Theme in deps',
        note: 'Theme делает reconnect частью effect-а, хотя синхронизация нужна только по roomId.',
        code: [
          'useEffect(() => {',
          '  const connection = connectRoom(roomId, () => showToast(theme));',
          '  return () => connection.disconnect();',
          '}, [roomId, theme]);',
        ].join('\n'),
      },
      {
        label: 'useEffectEvent',
        note: 'Свежая theme читается внутри внешнего callback без лишнего reconnect.',
        code: [
          'const onConnected = useEffectEvent(() => {',
          '  showToast(theme);',
          '});',
          '',
          'useEffect(() => {',
          '  const connection = connectRoom(roomId, onConnected);',
          '  return () => connection.disconnect();',
          '}, [roomId]);',
        ].join('\n'),
      },
    ],
  },
  remove: {
    files: [
      {
        path: 'src/components/advanced-effects/RemoveEffectLab.tsx',
        note: 'Лаборатория рендерит mirrored и derived вариант рядом, чтобы drift был виден сразу.',
      },
      {
        path: 'src/lib/remove-effect-model.ts',
        note: 'Модель фиксирует, почему mirrored state опасен и как распознать drift.',
      },
      {
        path: 'src/lib/advanced-effect-domain.ts',
        note: 'Фильтрация и summary вынесены в чистые функции и используются прямо в render.',
      },
    ],
    snippets: [
      {
        label: 'Mirrored state with effects',
        note: 'Список и summary дублируют данные и требуют двух дополнительных effect-ов.',
        code: [
          'const [visibleModules, setVisibleModules] = useState([]);',
          'const [summary, setSummary] = useState("");',
          'useEffect(() => {',
          '  setVisibleModules(filterWorkshopModules(query, level));',
          '}, [query, level]);',
          'useEffect(() => {',
          '  setSummary(buildWorkshopSummary(visibleModules));',
          '}, [visibleModules]);',
        ].join('\n'),
      },
      {
        label: 'Derived values in render',
        note: 'Текущий UI вычисляется прямо из query и level без дополнительной синхронизации.',
        code: [
          'const visibleModules = filterWorkshopModules(query, level);',
          'const summary = buildWorkshopSummary(visibleModules);',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
