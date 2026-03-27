export type BridgeScenarioId = 'forms' | 'routing' | 'events' | 'refs' | 'testing';

export const bridgeScenarios: {
  id: BridgeScenarioId;
  label: string;
  platformLayer: string;
  reactLayer: string;
  nativeContract: string[];
  breakage: string[];
  codePreview: string;
}[] = [
  {
    id: 'forms',
    label: 'Формы',
    platformLayer: '<form>, submit, FormData, label, required',
    reactLayer: 'onSubmit, controlled/uncontrolled, form actions',
    nativeContract: [
      'Submit принадлежит форме, а не отдельной кнопке.',
      'Сериализация опирается на `name`, `disabled`, `checked`, `selected`.',
    ],
    breakage: [
      'Без понимания FormData легко потерять поля без name или disabled-поля.',
      'Без label страдают и доступность, и queries в тестах.',
    ],
    codePreview: `const payload = new FormData(event.currentTarget);
const data = Object.fromEntries(payload.entries());`,
  },
  {
    id: 'routing',
    label: 'Роутинг',
    platformLayer: '<a href>, focus, history, navigation semantics',
    reactLayer: 'Link, client-side routing, active navigation',
    nativeContract: [
      'Навигация строится на anchor semantics и keyboard behavior.',
      'Ссылка без href уже не ведёт себя как настоящая ссылка.',
    ],
    breakage: [
      'Сломанная link-semantics бьёт по клавиатуре, screen readers и open-in-new-tab.',
    ],
    codePreview: `<a href="/settings">Настройки</a>`,
  },
  {
    id: 'events',
    label: 'События',
    platformLayer: 'capture, bubble, default actions',
    reactLayer: 'onClick, onSubmit, SyntheticEvent',
    nativeContract: [
      'Даже в React событие опирается на DOM propagation и default behavior.',
    ],
    breakage: [
      'Непонимание preventDefault и stopPropagation ведёт к трудноуловимым багам переходов и submit.',
    ],
    codePreview: `event.preventDefault();
event.stopPropagation();`,
  },
  {
    id: 'refs',
    label: 'Refs и фокус',
    platformLayer: 'focus(), activeElement, tab order',
    reactLayer: 'useRef, imperative focus, measurements',
    nativeContract: [
      'Ref даёт доступ к реальному DOM-узлу, а не к абстрактному компоненту.',
    ],
    breakage: [
      'Без понимания focusable-элементов ref.focus() либо не сработает, либо даст странный UX.',
    ],
    codePreview: `inputRef.current?.focus();`,
  },
  {
    id: 'testing',
    label: 'Тестирование',
    platformLayer: 'role, label, accessible name',
    reactLayer: 'getByRole, getByLabelText, user-event',
    nativeContract: [
      'Хорошие тесты читают интерфейс так же, как браузер и assistive tech.',
    ],
    breakage: [
      'Плохая семантика делает queries хрупкими и маскирует реальные проблемы доступности.',
    ],
    codePreview: `screen.getByRole('button', { name: 'Сохранить' });`,
  },
];

export const getBridgeScenario = (id: BridgeScenarioId, showFailure: boolean) => {
  const scenario = bridgeScenarios.find((item) => item.id === id) ?? bridgeScenarios[0];

  return {
    ...scenario,
    visibleConsequences: showFailure ? scenario.breakage : scenario.nativeContract,
    statusTone: showFailure ? ('error' as const) : ('success' as const),
  };
};
