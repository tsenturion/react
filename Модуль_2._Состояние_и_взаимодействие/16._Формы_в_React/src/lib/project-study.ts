import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  controlled: {
    files: [
      {
        path: 'src/components/forms/ControlledFieldsPlayground.tsx',
        note: 'Компонент реально использует controlled `input`, `textarea`, `select`, `checkbox` и `radio` через общий state.',
      },
      {
        path: 'src/lib/controlled-form-model.ts',
        note: 'Чистая модель урока объясняет controlled sync и generic handler.',
      },
      {
        path: 'src/pages/ControlledFieldsPage.tsx',
        note: 'Страница связывает live форму, метрики и код controlled-потока.',
      },
    ],
    snippets: [
      {
        label: 'Generic controlled handler',
        note: 'Checkbox читает `checked`, остальные поля читают `value`, а затем весь UI снова строится из state.',
        code: [
          'const value =',
          '  target instanceof HTMLInputElement && target.type === "checkbox"',
          '    ? target.checked',
          '    : target.value;',
          '',
          'setForm((current) => ({ ...current, [name]: value }));',
        ].join('\n'),
      },
      {
        label: 'Controlled state',
        note: 'Все поля формы читаются из одного объекта состояния.',
        code: ['const [form, setForm] = useState(createControlledLessonForm);'].join(
          '\n',
        ),
      },
    ],
  },
  uncontrolled: {
    files: [
      {
        path: 'src/components/forms/ControlledVsUncontrolledLab.tsx',
        note: 'Компонент сравнивает live controlled state и uncontrolled чтение через `FormData`.',
      },
      {
        path: 'src/lib/controlled-vs-uncontrolled-model.ts',
        note: 'Здесь лежат сериализация controlled/uncontrolled снимка и сравнение режимов.',
      },
      {
        path: 'src/pages/ControlledVsUncontrolledPage.tsx',
        note: 'Страница связывает различие форм-режимов с их реальными сценариями использования.',
      },
    ],
    snippets: [
      {
        label: 'Uncontrolled read',
        note: 'React не знает текущее значение uncontrolled-поля, пока DOM явно не прочитают.',
        code: [
          'const data = new FormData(form);',
          'setSnapshot({',
          '  fullName: String(data.get("fullName") ?? ""),',
          '});',
        ].join('\n'),
      },
      {
        label: 'Controlled preview',
        note: 'Controlled форма держит все значения в React state постоянно.',
        code: ['serializeControlledForm(controlledForm);'].join('\n'),
      },
    ],
  },
  submit: {
    files: [
      {
        path: 'src/components/forms/SubmitFlowLab.tsx',
        note: 'Здесь есть реальный `onSubmit`, `preventDefault`, async stage и reset controlled-формы.',
      },
      {
        path: 'src/lib/submit-flow-model.ts',
        note: 'Модель урока формулирует допустимость submit и состояния submit flow.',
      },
      {
        path: 'src/pages/SubmitFlowPage.tsx',
        note: 'Страница связывает submit stages и payload preview.',
      },
    ],
    snippets: [
      {
        label: 'Submit handler',
        note: 'Submit flow сначала останавливает нативное поведение, затем проверяет state и только после этого переходит к отправке.',
        code: [
          'async function handleSubmit(event) {',
          '  event.preventDefault();',
          '  if (!canSubmit) return;',
          "  setStage('submitting');",
          '}',
        ].join('\n'),
      },
      {
        label: 'Payload build',
        note: 'Payload собирается из актуального controlled state в момент submit.',
        code: [
          'const payload = buildSubmitPayload(form);',
          'setLastPayload(payload);',
        ].join('\n'),
      },
    ],
  },
  validation: {
    files: [
      {
        path: 'src/components/forms/ValidationLab.tsx',
        note: 'Компонент реально ведёт `touched`, `submitted` и видимые field-errors.',
      },
      {
        path: 'src/lib/validation-model.ts',
        note: 'Чистая модель проверяет email, password, repeatPassword и agreement.',
      },
      {
        path: 'src/pages/ValidationPage.tsx',
        note: 'Страница связывает ошибки формы и UX валидации.',
      },
    ],
    snippets: [
      {
        label: 'Validation gate',
        note: 'Ошибки вычисляются из текущего form-state и блокируют submit flow до исправления.',
        code: [
          'const errors = validateSignupForm(form);',
          'if (Object.keys(errors).length > 0) return;',
        ].join('\n'),
      },
      {
        label: 'Touched map',
        note: 'Поле показывает ошибку после blur или общего submit, а не в случайный момент.',
        code: ['setTouched((current) => ({ ...current, [field]: true }));'].join('\n'),
      },
    ],
  },
  native: {
    files: [
      {
        path: 'src/components/forms/NativeVsReactLab.tsx',
        note: 'Компонент сравнивает нативную форму с `required` и `FormData` и React-managed форму со state-driven UI.',
      },
      {
        path: 'src/lib/native-react-form-model.ts',
        note: 'Модель урока сводит native payload и React payload в одно сравнение.',
      },
      {
        path: 'src/pages/NativeVsReactPage.tsx',
        note: 'Страница объясняет место платформы и роль React-управления.',
      },
    ],
    snippets: [
      {
        label: 'Native platform tools',
        note: 'Нативная форма уже умеет `FormData`, `required`, `reportValidity()` и `reset()`.',
        code: [
          'const data = new FormData(form);',
          'form.reportValidity();',
          'form.reset();',
        ].join('\n'),
      },
      {
        label: 'React-managed tools',
        note: 'React добавляет custom validation и predictable state-driven UI.',
        code: [
          'setReactForm((current) => ({ ...current, topic: event.target.value }));',
        ].join('\n'),
      },
    ],
  },
  pitfalls: {
    files: [
      {
        path: 'src/components/forms/FormPitfallsLab.tsx',
        note: 'В компоненте собраны три реальные ошибки: `value` вместо `checked`, submit без `preventDefault` и DOM reset без state reset.',
      },
      {
        path: 'src/lib/pitfalls-model.ts',
        note: 'Модель формулирует последствия каждого anti-pattern и правильную замену.',
      },
      {
        path: 'src/pages/FormPitfallsPage.tsx',
        note: 'Страница связывает баг, короткое объяснение и реальный live-case.',
      },
    ],
    snippets: [
      {
        label: 'Checkbox bug',
        note: 'Checkbox должен писать boolean в state.',
        code: ['setForm({ ...form, newsletter: event.target.checked });'].join('\n'),
      },
      {
        label: 'Controlled reset',
        note: 'В controlled форме reset нужен и для DOM, и для state.',
        code: [
          'formRef.current?.reset();',
          'setForm(createControlledLessonForm());',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
