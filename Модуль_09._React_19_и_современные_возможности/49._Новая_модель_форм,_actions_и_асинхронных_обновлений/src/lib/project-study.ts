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
        note: 'Shell урока и route map показывают, как тема разбита на сценарии формы, состояния и action-flow.',
      },
      {
        path: 'src/lib/actions-overview-domain.ts',
        note: 'Карта темы и фокусы overview-страницы.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Маршруты урока, подписи лабораторий и структура навигации.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Overview хранит focus в URL и ведёт себя как нормальный route-level учебный экран.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'model' ||
    value === 'state' ||
    value === 'buttons' ||
    value === 'status' ||
    value === 'workflow'
  ) {
    return value;
  }

  return 'all';
}`,
      },
      {
        label: 'Lesson route map',
        note: 'Маршруты урока сразу отражают структуру новой form-модели: базовый action, returned state, button intents и status context.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/actions-overview?focus=all' },
  { id: 'form-action', href: '/form-action-basics' },
  { id: 'use-action-state', href: '/use-action-state' },
  { id: 'form-action-buttons', href: '/form-action-buttons' },
  { id: 'form-status', href: '/form-status-flow' },
  { id: 'workflow-playbook', href: '/workflow-playbook' },
] as const;`,
      },
    ],
  },
  'form-action': {
    files: [
      {
        path: 'src/components/form-actions/ActionBasicsLab.tsx',
        note: 'Форма с plain `action` и history feed без ручного submit-handler boilerplate.',
      },
      {
        path: 'src/components/form-actions/FormStatusProbe.tsx',
        note: 'Небольшой вложенный компонент, который считывает pending и текущие поля формы из контекста.',
      },
      {
        path: 'src/lib/forms-actions-domain.ts',
        note: 'Чтение `FormData`, common payload types и сборка submission records.',
      },
    ],
    snippets: [
      {
        label: 'Plain form action',
        note: 'Submit описан как async action формы. Payload читается из FormData прямо в момент отправки.',
        code: `async function createDraft(formData: FormData) {
  const payload = readLessonPayload(formData);

  await delay(380);
  setHistory((current) => [buildSubmissionRecord('draft', payload), ...current].slice(0, 4));
}`,
      },
      {
        label: 'FormData payload model',
        note: 'Урок нарочно показывает payload как DOM-driven структуру, а не как копию каждого поля в controlled state.',
        code: `export function readLessonPayload(formData: FormData): LessonPayload {
  return {
    title: String(formData.get('title') ?? '').trim(),
    owner: String(formData.get('owner') ?? '').trim(),
    cohort: String(formData.get('cohort') ?? '').trim(),
    audience: normalizeAudience(String(formData.get('audience') ?? 'team')),
    notes: String(formData.get('notes') ?? '').trim(),
  };
}`,
      },
    ],
  },
  'use-action-state': {
    files: [
      {
        path: 'src/components/form-actions/ActionStateLab.tsx',
        note: 'Реальный `useActionState` с async submit, validation и returned result.',
      },
      {
        path: 'src/lib/action-state-model.ts',
        note: 'Initial state, validation rules и pure state builders для action-response.',
      },
      {
        path: 'src/lib/forms-actions-domain.ts',
        note: 'Общий payload формы и итоговые submission records.',
      },
    ],
    snippets: [
      {
        label: 'useActionState reducer-like action',
        note: 'Форма получает следующий state прямо из action, без внешнего useEffect для синхронизации ответа.',
        code: `const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    const payload = readLessonPayload(formData);
    const issues = validateLessonPayload(payload);

    if (issues.length > 0) {
      return buildErrorActionState(previousState, issues);
    }

    await delay(520);
    return buildSuccessActionState(previousState, payload);
  },
  initialFormActionState,
);`,
      },
      {
        label: 'Returned validation state',
        note: 'Ошибки и success result принадлежат action и описываются как следующий state формы.',
        code: `export function buildErrorActionState(previousState: FormActionState, issues: string[]) {
  return {
    status: 'error',
    message: 'Action вернул validation errors.',
    issues,
    attempts: previousState.attempts + 1,
    receipt: previousState.receipt,
  };
}`,
      },
    ],
  },
  'form-action-buttons': {
    files: [
      {
        path: 'src/components/form-actions/FormActionButtonsLab.tsx',
        note: 'Одна форма, три action-кнопки и разные async outcomes без общего switch-handler.',
      },
      {
        path: 'src/lib/forms-actions-domain.ts',
        note: 'Intent labels, async delay и records для draft/review/publish.',
      },
    ],
    snippets: [
      {
        label: 'Button-specific formAction',
        note: 'Разные кнопки несут свой submit intent прямо в разметке формы.',
        code: `<form action={publishAction}>
  <button type="submit" formAction={saveDraftAction}>Save draft</button>
  <button type="submit" formAction={sendToReviewAction}>Send to review</button>
  <button type="submit">Publish</button>
</form>`,
      },
      {
        label: 'Intent outcome model',
        note: 'Разница между draft, review и publish существует в модели, а не только в тексте кнопки.',
        code: `export function describeIntentOutcome(intent: SubmissionIntent, payload: LessonPayload) {
  if (intent === 'draft') {
    return { badge: 'Draft saved', delayMs: 280 };
  }

  if (intent === 'review') {
    return { badge: 'Review requested', delayMs: 420 };
  }

  return { badge: 'Published', delayMs: 520 };
}`,
      },
    ],
  },
  'form-status': {
    files: [
      {
        path: 'src/components/form-actions/FormStatusWorkflowLab.tsx',
        note: 'Форма, где pending snapshot и итоговый activity log живут вокруг одного submit flow.',
      },
      {
        path: 'src/components/form-actions/FormStatusProbe.tsx',
        note: 'Вложенный status-reader через `useFormStatus`.',
      },
    ],
    snippets: [
      {
        label: 'useFormStatus snapshot',
        note: 'Вложенный компонент получает pending и текущий payload без props drilling.',
        code: `export function FormStatusProbe({ idleLabel, pendingLabel }) {
  const status = useFormStatus();
  const title = String(status.data?.get('title') ?? '').trim();

  return (
    <div>
      {status.pending ? pendingLabel : idleLabel}
      {status.pending ? title : null}
    </div>
  );
}`,
      },
      {
        label: 'Pending submit button',
        note: 'Кнопка знает только о ближайшей форме и не требует отдельного external loading state.',
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
  'workflow-playbook': {
    files: [
      {
        path: 'src/components/form-actions/WorkflowPlaybookLab.tsx',
        note: 'Интерактивный advisor по выбору form action pattern.',
      },
      {
        path: 'src/lib/workflow-playbook-model.ts',
        note: 'Чистая логика выбора между plain action, useActionState, formAction и useFormStatus.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests для ключевых решений урока.',
      },
    ],
    snippets: [
      {
        label: 'Pattern selection',
        note: 'Решение строится от реальной структуры submit flow, а не от “надо применить новый API”.',
        code: `if (!scenario.isRealForm) {
  return { primaryPattern: 'manual-handler' };
}

if (scenario.hasMultipleSubmitOutcomes) {
  return { primaryPattern: 'formAction-buttons' };
}

if (scenario.needsFieldErrors || scenario.needsReturnedState) {
  return { primaryPattern: 'useActionState' };
}`,
      },
    ],
  },
};
