export const formBlueprint = [
  {
    key: 'title',
    label: 'Название сценария',
    placeholder: 'Например, External store review',
  },
  {
    key: 'owner',
    label: 'Ответственная зона',
    placeholder: 'UI / Data / QA',
  },
  {
    key: 'notes',
    label: 'Наблюдения',
    placeholder: 'Коротко опишите, что именно проверяется.',
  },
] as const;

export function buildEphemeralFieldId(
  renderTick: number,
  cardIndex: number,
  fieldKey: string,
) {
  return `render-${renderTick}-card-${cardIndex}-${fieldKey}`;
}
