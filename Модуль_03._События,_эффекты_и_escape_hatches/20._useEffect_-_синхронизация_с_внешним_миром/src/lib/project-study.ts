import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  need: {
    files: [
      {
        path: 'src/components/effects/NeedEffectLab.tsx',
        note: 'Живой sandbox сравнивает прямое вычисление в render и намеренно плохой effect-миррор.',
      },
      {
        path: 'src/lib/effect-need-model.ts',
        note: 'Чистая модель формулирует, когда effect действительно нужен, а когда он лишний.',
      },
      {
        path: 'src/pages/NeedEffectPage.tsx',
        note: 'Страница связывает useEffect как синхронизацию и реальные сценарии выбора.',
      },
    ],
    snippets: [
      {
        label: 'Derived value in render',
        note: 'Когда значение полностью выводится из текущих данных, обычного вычисления достаточно.',
        code: [
          'const directPreview = derivePreviewLabel(firstName, lastName, track);',
        ].join('\n'),
      },
      {
        label: 'Bad mirrored effect',
        note: 'Тот же результат через effect создаёт лишний источник истины и легко ломается при пропущенной зависимости.',
        code: [
          'useEffect(() => {',
          '  setMirroredPreview(derivePreviewLabel(firstName, lastName, track));',
          '}, omitLastNameDependency ? [firstName, track] : [firstName, lastName, track]);',
        ].join('\n'),
      },
    ],
  },
  lifecycle: {
    files: [
      {
        path: 'src/components/effects/LifecycleLab.tsx',
        note: 'Лаборатория показывает setup, cleanup и stale sync при пропущенной зависимости.',
      },
      {
        path: 'src/lib/effect-lifecycle-model.ts',
        note: 'Модель описывает полные и неполные dependencies.',
      },
      {
        path: 'src/pages/LifecyclePage.tsx',
        note: 'Страница связывает lifecycle эффекта с устройством зависимостей.',
      },
    ],
    snippets: [
      {
        label: 'Complete dependencies',
        note: 'Полный список зависимостей даёт корректный rerun и cleanup.',
        code: [
          'useEffect(() => {',
          '  onLog(`setup → ${signature}`);',
          '  setSyncedRoom(roomId);',
          '  return () => onLog(`cleanup → ${signature}`);',
          '}, [roomId, presenceSync, onLog]);',
        ].join('\n'),
      },
      {
        label: 'Missing dependency',
        note: 'Если `roomId` пропустить, внешняя синхронизация может застрять на старом значении.',
        code: [
          'useEffect(() => {',
          '  syncExternalRoom(roomId, presenceSync);',
          '}, [presenceSync]);',
        ].join('\n'),
      },
    ],
  },
  timers: {
    files: [
      {
        path: 'src/components/effects/TimerCleanupLab.tsx',
        note: 'Живой timer sandbox показывает накопление interval без cleanup.',
      },
      {
        path: 'src/lib/effect-timer-model.ts',
        note: 'Модель фиксирует разницу между корректным и текущим leak-сценарием.',
      },
      {
        path: 'src/pages/TimerCleanupPage.tsx',
        note: 'Страница связывает таймеры, cleanup и утечки.',
      },
    ],
    snippets: [
      {
        label: 'Interval setup',
        note: 'Effect создаёт внешний процесс и запускает его только в running-режиме.',
        code: [
          'const id = window.setInterval(() => {',
          '  setTicks((current) => current + 1);',
          '}, delay);',
        ].join('\n'),
      },
      {
        label: 'Interval cleanup',
        note: 'Cleanup убирает старый interval до следующего setup.',
        code: [
          'return () => {',
          '  window.clearInterval(id);',
          '  intervalIdsRef.current = intervalIdsRef.current.filter((currentId) => currentId !== id);',
          '};',
        ].join('\n'),
      },
    ],
  },
  subscriptions: {
    files: [
      {
        path: 'src/components/effects/SubscriptionLab.tsx',
        note: 'Лаборатория с внешним hub показывает setup/cleanup подписок и накопление listeners.',
      },
      {
        path: 'src/lib/effect-domain.ts',
        note: 'В проекте есть отдельный presence hub как внешняя система вне React state tree.',
      },
      {
        path: 'src/pages/SubscriptionPage.tsx',
        note: 'Страница связывает subscription cleanup и поведение интерфейса.',
      },
    ],
    snippets: [
      {
        label: 'External hub',
        note: 'Внешний emitter создан отдельно от React-компонента.',
        code: ['const sharedHub = createPresenceHub();'].join('\n'),
      },
      {
        label: 'Subscription effect',
        note: 'Подписка на room идёт через effect, а снятие подписки возвращается из cleanup.',
        code: [
          'useEffect(() => {',
          '  const unsubscribe = sharedHub.subscribe(roomId, handlePacket);',
          '  return unsubscribe;',
          '}, [roomId]);',
        ].join('\n'),
      },
    ],
  },
  requests: {
    files: [
      {
        path: 'src/components/effects/RequestSyncLab.tsx',
        note: 'Здесь есть реальный fetch к локальному JSON и abort в cleanup.',
      },
      {
        path: 'src/lib/effect-request-model.ts',
        note: 'Модель содержит логику фильтрации, латентности и async helper для запроса.',
      },
      {
        path: 'public/data/effect-glossary.json',
        note: 'Локальный набор данных нужен, чтобы network sync можно было изучать без внешнего API.',
      },
    ],
    snippets: [
      {
        label: 'Abort stale request',
        note: 'Cleanup прерывает устаревший запрос, если query уже изменилась.',
        code: [
          'const controller = new AbortController();',
          'searchEffectGlossary(normalized, controller.signal);',
          'return () => {',
          '  controller.abort();',
          '};',
        ].join('\n'),
      },
      {
        label: 'Quick sequence',
        note: 'Быстрый сценарий специально запускает несколько query подряд, чтобы показать stale response.',
        code: [
          'quickQueries.forEach((value, index) => {',
          '  window.setTimeout(() => {',
          '    startTransition(() => setQuery(value));',
          '  }, index * 120);',
          '});',
        ].join('\n'),
      },
    ],
  },
  pitfalls: {
    files: [
      {
        path: 'src/components/effects/PitfallLab.tsx',
        note: 'Интерактивный симулятор показывает лишние effects, unstable dependencies и loop risk.',
      },
      {
        path: 'src/lib/effect-pitfall-model.ts',
        note: 'Модель хранит bad/good snippets и безопасную симуляцию render loop.',
      },
      {
        path: 'src/pages/PitfallPage.tsx',
        note: 'Страница собирает типичные useEffect-анти-паттерны в одну сводку.',
      },
    ],
    snippets: [
      {
        label: 'Unstable dependency',
        note: 'Новый object в dependencies заставляет effect повторяться без реальной пользы.',
        code: [
          'const options = { roomId };',
          'useEffect(() => {',
          '  connect(options);',
          '}, [options]);',
        ].join('\n'),
      },
      {
        label: 'Loop risk',
        note: 'Effect, который меняет свою же зависимость, уходит в цикл.',
        code: ['useEffect(() => {', '  setCount(count + 1);', '}, [count]);'].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
