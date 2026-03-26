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
        note: 'Shell урока сразу раскладывает тему на overview, directives, invocation, forms, constraints и playbook.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Route map урока и связь лабораторий с URL.',
      },
      {
        path: 'src/server/server-functions-runtime.ts',
        note: 'Учебный server-side слой, где видны `use server`, мутации и возвращаемый результат.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Маршруты урока выражают не меню ради меню, а учебные full-stack лаборатории вокруг server boundaries и форм.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/server-functions-overview?focus=all' },
  { id: 'directives', href: '/directives-and-boundaries' },
  { id: 'invocation', href: '/server-function-invocation' },
  { id: 'forms', href: '/forms-with-server-logic' },
  { id: 'constraints', href: '/server-function-constraints' },
  { id: 'playbook', href: '/server-functions-playbook' },
] as const;`,
      },
      {
        label: 'Server action catalog',
        note: 'Урок хранит реальные server-side use cases как явные действия, а не как абстрактные слова на карточках UI.',
        code: `export const serverActionCatalog = [
  {
    id: 'save-draft',
    directive: 'use server',
    useCase: 'Черновое сохранение формы без отдельного ручного API-слоя.',
  },
  {
    id: 'publish-lesson',
    directive: 'use server',
    useCase: 'Публикация и серверная валидация прав/данных в одном full-stack потоке.',
  },
] as const;`,
      },
    ],
  },
  directives: {
    files: [
      {
        path: 'src/components/server-functions-labs/DirectiveBoundaryLab.tsx',
        note: 'Интерактивная карта узлов экрана, которые можно перемещать между server и client.',
      },
      {
        path: 'src/lib/server-function-boundary-model.ts',
        note: 'Предметная модель узлов, presets и расчёт bundle/hydration/crossing-стоимости.',
      },
      {
        path: 'src/main.tsx',
        note: 'Даже точка входа проекта комментарием фиксирует, что shell урока является частью темы про server/client boundaries.',
      },
    ],
    snippets: [
      {
        label: 'Boundary analysis',
        note: 'Один и тот же узел оценивается не по названию, а по цене client graph и по риску нарушить browser/server contract.',
        code: `if (layer === 'client') {
  clientBundleKb += node.clientBundleKb;
  hydrationUnits += 1;

  if (node.benefitsFromServerAction) {
    serverActionBridgeCount += 1;
  }
}

if (layer === 'server' && node.needsBrowserHooks) {
  invalidCount += 1;
}`,
      },
      {
        label: 'Hybrid preset',
        note: 'Урок хранит рабочие boundary presets явно, чтобы сравнивать не абстрактные идеи, а законченные схемы экрана.',
        code: `workspace: {
  'page-shell': 'server',
  'analytics-feed': 'server',
  'lesson-form': 'client',
  'live-preview': 'client',
  'publish-controls': 'client',
  'history-timeline': 'client',
},`,
      },
    ],
  },
  invocation: {
    files: [
      {
        path: 'src/components/server-functions-labs/InvocationFlowLab.tsx',
        note: 'Интерактивное сравнение manual API, server function и purely client flow.',
      },
      {
        path: 'src/lib/server-function-flow-model.ts',
        note: 'Модель сравнивает число ручных шагов, риск дублирования схемы и round-trip стоимость.',
      },
      {
        path: 'src/server/server-functions-runtime.ts',
        note: 'В runtime видно, как выбор actionId направляет форму в конкретную серверную мутацию.',
      },
    ],
    snippets: [
      {
        label: 'Flow comparison',
        note: 'Сравнение фиксирует не абстрактные плюсы, а конкретные шаги и цену ручного full-stack glue.',
        code: `{
  id: 'server-function',
  handwrittenGlue: 2,
  schemaDuplicationRisk: 'low',
  steps: [
    'Форма пересекает server boundary через submit',
    'Server Function получает сериализуемый payload',
    'Валидация и мутация происходят рядом с серверной логикой',
    'Результат возвращается в форму без отдельного ручного API-слоя',
  ],
}`,
      },
      {
        label: 'Action dispatch',
        note: 'Клиент не выбирает transport на лету: урок выражает тему через явный серверный dispatch по действию.',
        code: `export async function invokeServerAction(actionId, input) {
  if (actionId === 'publish-lesson') {
    return publishLessonOnServer(input);
  }

  if (actionId === 'save-draft') {
    return saveDraftOnServer(input);
  }

  return assignReviewerOnServer({ reviewer: input.reviewer });
}`,
      },
    ],
  },
  forms: {
    files: [
      {
        path: 'src/components/server-functions-labs/ServerFormsLab.tsx',
        note: 'Форма с `useActionState`, `useFormStatus` и двумя submit intent без ручного REST-слоя.',
      },
      {
        path: 'src/lib/server-function-form-model.ts',
        note: 'Парсинг `FormData` и server-driven возврат UI state.',
      },
      {
        path: 'src/server/server-functions-runtime.ts',
        note: 'Серверная валидация и мутация, которые реально возвращают headline, message, errors и audit trail.',
      },
    ],
    snippets: [
      {
        label: 'Form action state',
        note: 'Форма выражает тему напрямую: локальный client island держит поля, а submit уходит через server boundary.',
        code: `const [state, formAction, isPending] = useActionState(
  submitLessonMutation,
  initialFormState,
);

<form action={formAction} className="grid gap-4">
  <button type="submit" name="intent" value="saveDraft" />
  <button type="submit" name="intent" value="publish" />
</form>`,
      },
      {
        label: 'FormData -> server action',
        note: 'Ключевой сдвиг темы: результат server function возвращается как новое состояние формы, а не как ручной `fetch` response branch.',
        code: `export async function submitLessonMutation(previousState, formData) {
  const input = parseLessonMutationFormData(formData);
  const actionId = input.intent === 'publish' ? 'publish-lesson' : 'save-draft';
  const result = await invokeServerAction(actionId, input);

  return {
    status: result.ok ? 'success' : 'error',
    headline: result.headline,
    message: result.message,
    fieldErrors: result.fieldErrors,
  };
}`,
      },
    ],
  },
  constraints: {
    files: [
      {
        path: 'src/components/server-functions-labs/ConstraintsLab.tsx',
        note: 'Sandbox для проверки сериализации, browser APIs, secret reads и live typing.',
      },
      {
        path: 'src/lib/server-function-constraints-model.ts',
        note: 'Чистая модель ограничений server boundaries.',
      },
      {
        path: 'src/server/server-functions-runtime.ts',
        note: 'Серверные функции с `use server` подчёркивают, что они живут в другой среде исполнения.',
      },
    ],
    snippets: [
      {
        label: 'Constraint evaluation',
        note: 'Модель отделяет действительно хорошие server scenarios от тех, где server boundary только мешает.',
        code: `if (!input.argsSerializable) {
  tone = 'error';
  headline = 'Payload не подходит для серверной границы';
} else if (input.needsWindowApi) {
  tone = 'error';
  headline = 'Browser API ломает server boundary';
} else if (input.callMoment === 'change' || input.expectsInstantTyping) {
  tone = 'warn';
  headline = 'Для live-цикла server function слишком тяжёлая';
}`,
      },
      {
        label: '`use server` runtime',
        note: 'В проекте есть не только UI-объяснение, но и реальная server-side функция с директивой и проверками.',
        code: `export async function publishLessonOnServer(input) {
  'use server';

  await wait(220);
  const fieldErrors = validateLessonMutation(input);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      actionId: 'publish-lesson',
      headline: 'Публикация остановлена',
    };
  }
}`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/server-functions-labs/ServerFunctionsPlaybookLab.tsx',
        note: 'Интерактивный playbook по выбору `server-form-action`, client island или другого transport-паттерна.',
      },
      {
        path: 'src/lib/server-function-playbook-model.ts',
        note: 'Правила выбора архитектуры по свойствам экрана.',
      },
      {
        path: 'src/lib/server-function-boundary-model.ts',
        note: 'Boundary model помогает не превращать server functions в оправдание для client-heavy subtree.',
      },
    ],
    snippets: [
      {
        label: 'Submit-driven branch',
        note: 'Если сценарий живёт вокруг submit и защищённой серверной записи, playbook отправляет его в form + server function.',
        code: `if (input.submitDriven && input.needsProtectedWrite && input.wantsMinimalGlue) {
  return {
    primaryPattern: 'server-form-action',
    title: 'Форма + server function — лучший старт',
    steps: [
      'Client island держит поля формы и локальный feedback.',
      'Submit пересекает server boundary и запускает мутацию.',
      'Pending, errors и result возвращаются обратно в форму как единый поток.',
    ],
  };
}`,
      },
      {
        label: 'Client-island branch',
        note: 'Если есть browser API или live typing, playbook оставляет UI в client, а server function делает точечной серверной мутацией.',
        code: `if ((input.needsBrowserApi || input.expectsInstantTyping) && input.needsProtectedWrite) {
  return {
    primaryPattern: 'client-island-calls-server-function',
    title: 'Оставьте UI в client island, а мутацию вынесите в server function',
  };
}`,
      },
    ],
  },
};
