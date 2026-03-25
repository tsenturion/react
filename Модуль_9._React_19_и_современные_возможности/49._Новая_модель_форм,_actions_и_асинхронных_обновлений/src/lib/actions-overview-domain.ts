export type OverviewFocus = 'all' | 'model' | 'state' | 'buttons' | 'status' | 'workflow';

export const overviewCards = [
  {
    id: 'model-shift',
    focus: 'model',
    title: 'Submit становится action, а не цепочкой ручных обработчиков',
    summary:
      'React 19 позволяет описывать submit как прямое асинхронное действие формы, а не как onSubmit + preventDefault + ручной fetch + ручной pending state.',
  },
  {
    id: 'dom-ownership',
    focus: 'model',
    title: 'Форма снова живёт ближе к своей DOM-природе',
    summary:
      'FormData, action и formAction возвращают форму к реальному браузерному потоку: поля, submit intent и payload берутся из формы напрямую.',
  },
  {
    id: 'action-state',
    focus: 'state',
    title: 'useActionState держит результат submit рядом с action',
    summary:
      'Validation errors, success result и pending не расползаются по useEffect и разрозненным setState, а следуют за одним async action.',
  },
  {
    id: 'button-intents',
    focus: 'buttons',
    title: 'formAction разделяет разные исходы одной формы',
    summary:
      'Одна структура полей может обслуживать draft, review и publish без условной логики внутри одного универсального submit handler.',
  },
  {
    id: 'status-scope',
    focus: 'status',
    title: 'useFormStatus читает текущую отправку прямо из контекста формы',
    summary:
      'Pending indicator и snapshot payload можно строить рядом с кнопкой submit, не поднимая лишний state в parent shell.',
  },
  {
    id: 'workflow',
    focus: 'workflow',
    title: 'Структура формы начинает отражать реальный async flow',
    summary:
      'Хорошая React 19 форма показывает, какой action выполняется, какие данные ушли и как меняется UI после ответа, без избыточной ручной обвязки.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
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
}

export function filterOverviewCardsByFocus(focus: OverviewFocus) {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((item) => item.focus === focus);
}
