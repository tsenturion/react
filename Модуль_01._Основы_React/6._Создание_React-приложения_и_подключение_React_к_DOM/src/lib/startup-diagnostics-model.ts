import type { StatusTone } from './common';

export type DiagnosticPresetId =
  | 'missing-root'
  | 'id-mismatch'
  | 'missing-create-root'
  | 'double-create-root'
  | 'strictmode-assumption';

export const diagnosticPresets = [
  {
    id: 'missing-root',
    label: 'Нет `#root` в HTML',
    description:
      'Браузер загружает страницу, но React не находит контейнер для монтирования.',
  },
  {
    id: 'id-mismatch',
    label: 'ID контейнера не совпадает',
    description: '`index.html` и `getElementById(...)` говорят про разные DOM-узлы.',
  },
  {
    id: 'missing-create-root',
    label: 'Забыли `createRoot(...)`',
    description: 'Входной модуль выполняется, но React Root так и не создаётся.',
  },
  {
    id: 'double-create-root',
    label: 'Повторный `createRoot(...)` на тот же контейнер',
    description: 'Код пытается создавать несколько root на одном и том же DOM-элементе.',
  },
  {
    id: 'strictmode-assumption',
    label: 'Код зависит от StrictMode-дублирования',
    description:
      'Логика начинает рассчитывать на dev-only поведение как на рабочий контракт.',
  },
] as const satisfies readonly {
  id: DiagnosticPresetId;
  label: string;
  description: string;
}[];

export function diagnoseStartupIssue(presetId: DiagnosticPresetId) {
  const preset =
    diagnosticPresets.find((item) => item.id === presetId) ?? diagnosticPresets[0];

  const scenarios = {
    'missing-root': {
      tone: 'error',
      symptom: 'Страница загружается, но React-UI не появляется вообще.',
      cause:
        'В `index.html` нет mount-container, поэтому `document.getElementById(...)` не находит DOM-узел.',
      fix: 'Добавить контейнер и убедиться, что `main.tsx` ищет именно его ID.',
      whereToLook: ['index.html', 'src/main.tsx'],
    },
    'id-mismatch': {
      tone: 'error',
      symptom:
        'Код падает на этапе поиска контейнера или монтирует не туда, куда ожидалось.',
      cause: 'ID в HTML и строка в `getElementById(...)` расходятся.',
      fix: 'Синхронизировать имя контейнера между `index.html` и `src/main.tsx`.',
      whereToLook: ['index.html', 'src/main.tsx'],
    },
    'missing-create-root': {
      tone: 'error',
      symptom:
        'Есть DOM-контейнер, но React Root не появляется и `root.render(...)` вызвать нельзя.',
      cause: 'Bootstrap-цепочка обрывается до создания клиентского root.',
      fix: 'Создать root через `createRoot(container)` и только потом вызвать `root.render(...)`.',
      whereToLook: ['src/main.tsx'],
    },
    'double-create-root': {
      tone: 'warn',
      symptom:
        'Появляются предупреждения и конфликт за управление одним DOM-контейнером.',
      cause:
        'Код повторно создаёт React Root для того же контейнера вместо переиспользования уже созданного instance.',
      fix: 'Держать один root на контейнер и использовать `root.render(...)` для обновлений, а `root.unmount()` для очистки.',
      whereToLook: ['src/main.tsx', 'src/components/root/RootLifecycleSandbox.tsx'],
    },
    'strictmode-assumption': {
      tone: 'warn',
      symptom:
        'В development компонент будто бы «работает», а в production поведение расходится.',
      cause:
        'Код полагается на то, что effect или render будет дублироваться из-за StrictMode.',
      fix: 'Сделать компонент чистым и не использовать dev-only проверки как часть бизнес-логики.',
      whereToLook: ['src/main.tsx', 'src/components/root/StrictModeSandbox.tsx'],
    },
  } as const;

  const selected = scenarios[preset.id];
  const tone = selected.tone as StatusTone;

  return {
    preset,
    tone,
    symptom: selected.symptom,
    cause: selected.cause,
    fix: selected.fix,
    whereToLook: selected.whereToLook,
    before: selected.symptom,
    after: selected.fix,
  };
}
