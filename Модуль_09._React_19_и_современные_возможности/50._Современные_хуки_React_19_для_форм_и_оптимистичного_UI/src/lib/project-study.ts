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
        note: 'Shell урока и route map показывают, как тема разложена на returned state, status context, optimistic overlay и общий workflow.',
      },
      {
        path: 'src/lib/modern-hooks-overview-domain.ts',
        note: 'Карточки overview и фокусы темы, переключаемые через URL.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Маршруты урока, подписи лабораторий и структура навигации.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Overview живёт как нормальный route-level экран и хранит active focus в URL.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'action-state' ||
    value === 'status' ||
    value === 'optimistic' ||
    value === 'ux' ||
    value === 'architecture'
  ) {
    return value;
  }

  return 'all';
}`,
      },
      {
        label: 'Lesson route map',
        note: 'Маршруты урока сразу отражают структуру темы: три hook API, объединённый async flow и playbook выбора.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/hooks-overview?focus=all' },
  { id: 'use-action-state', href: '/use-action-state' },
  { id: 'use-form-status', href: '/use-form-status' },
  { id: 'use-optimistic', href: '/use-optimistic' },
  { id: 'pending-error-result', href: '/pending-error-result' },
  { id: 'hooks-playbook', href: '/hooks-playbook' },
] as const;`,
      },
    ],
  },
  'use-action-state': {
    files: [
      {
        path: 'src/components/form-hooks/ActionStateFeedbackLab.tsx',
        note: 'Реальный useActionState с validation, pending и server success/failure mode.',
      },
      {
        path: 'src/lib/action-hooks-state-model.ts',
        note: 'Initial action state и pure builders для validation, failure и success snapshots.',
      },
      {
        path: 'src/lib/modern-form-hooks-domain.ts',
        note: 'Общий FormData payload и receipt модели формы.',
      },
    ],
    snippets: [
      {
        label: 'useActionState submit flow',
        note: 'Форма получает следующий UI snapshot прямо из action, без внешнего effect-синхронизатора.',
        code: `const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    const payload = readAnnouncementPayload(formData);
    const issues = validateAnnouncementPayload(payload);

    if (issues.length > 0) {
      return buildValidationState(previousState, payload, issues);
    }

    await delay(latencyMs);
    return deliveryMode === 'failure'
      ? buildFailureState(previousState, payload)
      : buildSuccessState(previousState, payload);
  },
  initialHookActionState,
);`,
      },
      {
        label: 'Returned failure state',
        note: 'Ошибка submit оформляется как следующий state формы, а не как отдельный внешний setError.',
        code: `export function buildFailureState(previousState: HookActionState, payload: AnnouncementPayload) {
  return {
    status: 'error',
    message: \`Сервер отклонил "\${payload.title}". Pending закончился, а итог формы вернулся как error-state.\`,
    issues: ['Базовое состояние не изменилось, поэтому optimistic overlay должен откатиться.'],
    attempts: previousState.attempts + 1,
    receipt: null,
    lastSubmittedTitle: payload.title,
  };
}`,
      },
    ],
  },
  'use-form-status': {
    files: [
      {
        path: 'src/components/form-hooks/FormStatusInspectorLab.tsx',
        note: 'Форма с nested pending indicators и activity log.',
      },
      {
        path: 'src/components/form-hooks/FormStatusProbe.tsx',
        note: 'Общий дочерний status-reader, который читает pending и FormData snapshot из nearest form context.',
      },
    ],
    snippets: [
      {
        label: 'useFormStatus snapshot',
        note: 'Дочерний компонент читает payload текущей отправки напрямую из контекста формы.',
        code: `export function FormStatusProbe({ idleLabel, pendingLabel, fieldName = 'title' }) {
  const status = useFormStatus();
  const fieldValue = String(status.data?.get(fieldName) ?? '').trim();

  return (
    <div>
      {status.pending ? pendingLabel : idleLabel}
      {fieldValue}
    </div>
  );
}`,
      },
      {
        label: 'Pending submit button',
        note: 'Кнопке не нужен внешний loading prop: она знает только о ближайшей форме.',
        code: `export function PendingSubmitButton({ children, pendingLabel, ...props }) {
  const status = useFormStatus();

  return (
    <button {...props} disabled={status.pending || props.disabled}>
      {status.pending ? pendingLabel : children}
    </button>
  );
}`,
      },
    ],
  },
  'use-optimistic': {
    files: [
      {
        path: 'src/components/form-hooks/OptimisticQueueLab.tsx',
        note: 'Лента с optimistic overlay, server confirmation и rollback на отказе.',
      },
      {
        path: 'src/lib/modern-form-hooks-domain.ts',
        note: 'Confirmed feed entries, optimistic sending entries и общая payload-модель.',
      },
    ],
    snippets: [
      {
        label: 'Optimistic overlay',
        note: 'Карточка добавляется в видимый список сразу, ещё до server confirmation.',
        code: `const [optimisticEntries, addOptimisticEntry] = useOptimistic(
  entries,
  (currentEntries, optimisticEntry: FeedEntry) => [optimisticEntry, ...currentEntries],
);`,
      },
      {
        label: 'Rollback after failure',
        note: 'При ошибке серверная истина переизлучается заново, и optimistic overlay исчезает.',
        code: `if (deliveryMode === 'failure') {
  setEntries((current) => [...current]);
  setNotice({
    tone: 'error',
    text: \`Сервер отклонил "\${payload.title}". Оптимистичная карточка была локальной и поэтому откатилась.\`,
  });
  return;
}`,
      },
    ],
  },
  'pending-error-result': {
    files: [
      {
        path: 'src/components/form-hooks/UnifiedFeedbackFlowLab.tsx',
        note: 'Связка useActionState, useFormStatus и useOptimistic в одном submit workflow.',
      },
      {
        path: 'src/components/form-hooks/FormStatusProbe.tsx',
        note: 'Pending и payload snapshot в дочерних элементах формы.',
      },
      {
        path: 'src/lib/action-hooks-state-model.ts',
        note: 'Returned state формы: success, error и validation snapshots.',
      },
    ],
    snippets: [
      {
        label: 'Unified async flow',
        note: 'Один action одновременно создаёт optimistic overlay и возвращает итоговый state формы.',
        code: `const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    const payload = readAnnouncementPayload(formData);
    const issues = validateAnnouncementPayload(payload);

    if (issues.length > 0) {
      return buildValidationState(previousState, payload, issues);
    }

    addOptimisticEntry(buildFeedEntry(payload, 'sending'));
    await delay(560);
    return deliveryMode === 'failure'
      ? buildFailureState(previousState, payload)
      : (setEntries((current) => [buildFeedEntry(payload, 'confirmed'), ...current].slice(0, 6)),
        buildSuccessState(previousState, payload));
  },
  initialHookActionState,
);`,
      },
      {
        label: 'Visible feed separation',
        note: 'UI сохраняет границу между optimistic и confirmed карточками через отдельный state flag.',
        code: `optimisticEntries.map((item) => (
  <li key={item.id}>
    <span>{item.title}</span>
    <StatusPill tone={item.state === 'sending' ? 'warn' : 'success'}>
      {item.state}
    </StatusPill>
  </li>
));`,
      },
    ],
  },
  'hooks-playbook': {
    files: [
      {
        path: 'src/components/form-hooks/HooksPlaybookLab.tsx',
        note: 'Интерактивный advisor по выбору одного hook или связки нескольких.',
      },
      {
        path: 'src/lib/modern-hooks-playbook-model.ts',
        note: 'Чистая логика выбора between plain form action, returned state, status context и optimistic UI.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests ключевых решений урока.',
      },
    ],
    snippets: [
      {
        label: 'Playbook decision',
        note: 'Решение строится от структуры async потока формы, а не от желания “попробовать новый hook”.',
        code: `if (!scenario.isRealForm) {
  return { primaryPattern: 'manual-handler' };
}

if (scenario.needsInstantFeedback && (scenario.needsReturnedState || scenario.needsNestedPending)) {
  return { primaryPattern: 'combined-hooks' };
}

if (scenario.needsInstantFeedback) {
  return { primaryPattern: 'use-optimistic' };
}`,
      },
    ],
  },
};
