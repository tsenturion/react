import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока и route map показывают, как тема разбита на приоритеты обновлений, effect-local логику и visibility boundaries.',
      },
      {
        path: 'src/lib/priority-overview-domain.ts',
        note: 'Карта темы и URL-driven focus для overview страницы.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Маршруты урока, подписи лабораторий и структура навигации.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Overview хранит фокус в URL и ведёт себя как обычный route-level экран.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'urgent' ||
    value === 'transition' ||
    value === 'deferred' ||
    value === 'effect-event' ||
    value === 'activity'
  ) {
    return value;
  }

  return 'all';
}`,
      },
      {
        label: 'Lesson route map',
        note: 'Маршруты урока сразу выражают структуру темы: transitions, deferred value, effect event, Activity и playbook.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/priority-overview?focus=all' },
  { id: 'transitions', href: '/transitions' },
  { id: 'deferred-value', href: '/deferred-value' },
  { id: 'effect-event', href: '/effect-event' },
  { id: 'activity', href: '/activity-visibility' },
  { id: 'playbook', href: '/priority-playbook' },
] as const;`,
      },
    ],
  },
  transitions: {
    files: [
      {
        path: 'src/components/priority-async/TransitionPriorityLab.tsx',
        note: 'Практика useTransition и startTransition на одной рабочей доске.',
      },
      {
        path: 'src/lib/priority-workbench-model.ts',
        note: 'Тяжёлый фильтр и общая модель элементов рабочей доски.',
      },
    ],
    snippets: [
      {
        label: 'Urgent input + transition board',
        note: 'Input обновляется срочно, а expensive board query догоняет его как non-urgent update.',
        code: `function handleTyping(nextValue: string) {
  setDraftQuery(nextValue);

  startTransition(() => {
    setCommittedQuery(nextValue);
    setLastSchedulingMode('useTransition');
  });
}`,
      },
      {
        label: 'Standalone startTransition',
        note: 'Preset board switch использует startTransition без отдельного isPending, потому что локальный статус здесь не обязателен.',
        code: `scheduleBackground(() => {
  setDraftQuery(preset.query);
  setCommittedQuery(preset.query);
  setDomain(preset.domain);
  setLastSchedulingMode('startTransition');
});`,
      },
    ],
  },
  'deferred-value': {
    files: [
      {
        path: 'src/components/priority-async/DeferredValueLab.tsx',
        note: 'useDeferredValue в современном search/filter сценарии.',
      },
      {
        path: 'src/lib/priority-workbench-model.ts',
        note: 'Отстающее heavy-представление строится из deferred query.',
      },
    ],
    snippets: [
      {
        label: 'Deferred reading',
        note: 'Input query и deferred query могут временно расходиться, и это нормальная часть responsive UI.',
        code: `const deferredQuery = useDeferredValue(query);
const freshness = summarizeDeferredState(query, deferredQuery);

const results = useMemo(
  () => filterWorkbenchItems(deferredQuery, domain).slice(0, 6),
  [deferredQuery, domain],
);`,
      },
    ],
  },
  'effect-event': {
    files: [
      {
        path: 'src/components/priority-async/EffectEventLab.tsx',
        note: 'Сравнение dependency-bound effect и useEffectEvent на одном внешнем pulse source.',
      },
      {
        path: 'src/lib/effect-event-model.ts',
        note: 'Room/theme модели и форматирование входящего pulse.',
      },
    ],
    snippets: [
      {
        label: 'Legacy resubscribe effect',
        note: 'Когда theme включена в deps, listener пересоздаётся даже без смены внешнего source.',
        code: `useEffect(() => {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<PulseDetail>).detail;
    if (detail.roomId !== roomId) return;

    setHandledEvents((current) => current + 1);
    setLastMessage(buildPulseMessage(detail, theme));
  };

  setSubscriptions((current) => current + 1);
  window.addEventListener(pulseEventName, listener as EventListener);
  return () => window.removeEventListener(pulseEventName, listener as EventListener);
}, [roomId, theme]);`,
      },
      {
        label: 'Effect event callback',
        note: 'Подписка остаётся стабильной по roomId, а callback внутри effect всё равно видит свежую тему.',
        code: `const onPulse = useEffectEvent((detail: PulseDetail) => {
  setHandledEvents((current) => current + 1);
  setLastMessage(buildPulseMessage(detail, theme));
});

useEffect(() => {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<PulseDetail>).detail;
    if (detail.roomId !== roomId) return;
    onPulse(detail);
  };

  setSubscriptions((current) => current + 1);
  window.addEventListener(pulseEventName, listener as EventListener);
  return () => window.removeEventListener(pulseEventName, listener as EventListener);
}, [roomId]);`,
      },
    ],
  },
  activity: {
    files: [
      {
        path: 'src/components/priority-async/ActivityVisibilityLab.tsx',
        note: 'Сравнение Activity boundary и обычной условной ветки.',
      },
      {
        path: 'src/lib/activity-visibility-model.ts',
        note: 'Описание режимов видимости и сравнение стратегий.',
      },
      {
        path: 'src/hooks/useRenderCount.ts',
        note: 'Commit telemetry для видимых редакторов внутри лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'Activity boundary',
        note: 'Hidden subtree скрывается boundary-режимом, а не обычным unmount.',
        code: `<Activity mode={mode} name="lesson-51-activity-draft">
  <DraftSurface
    label="Activity draft"
    storageHint="Спрячьте и верните поддерево: заметка и чекбоксы должны сохраниться."
  />
</Activity>`,
      },
      {
        label: 'Conditional render contrast',
        note: 'Обычная условная ветка проще, но скрытие приводит к реальному размонтированию.',
        code: `{mode === 'visible' ? (
  <DraftSurface
    label="Conditional draft"
    storageHint="При скрытии эта ветка размонтируется и при возврате начнёт работу заново."
  />
) : (
  <div>Conditional subtree сейчас размонтирована.</div>
)}`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/priority-async/PriorityPlaybookLab.tsx',
        note: 'Интерактивный advisor по выбору concurrent и visibility API.',
      },
      {
        path: 'src/lib/priority-playbook-model.ts',
        note: 'Чистая логика выбора between plain state, transitions, deferred value, effect event и Activity.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests для route map и приоритетных решений урока.',
      },
    ],
    snippets: [
      {
        label: 'Priority decision',
        note: 'Решение строится по типу проблемы интерфейса, а не по желанию «попробовать новый hook».',
        code: `if (scenario.hiddenSubtreeKeepsState) {
  return { primaryTool: 'activity' };
}

if (scenario.externalEffectNeedsLatestValue) {
  return { primaryTool: 'use-effect-event' };
}

if (scenario.urgentInput && scenario.backgroundViewMayLag) {
  return scenario.needsPendingIndicator
    ? { primaryTool: 'use-transition' }
    : { primaryTool: 'use-deferred-value' };
}`,
      },
    ],
  },
};
