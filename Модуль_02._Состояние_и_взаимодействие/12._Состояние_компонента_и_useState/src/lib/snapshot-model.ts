export type SnapshotNarrative = {
  currentRenderLabel: string;
  scheduledLabel: string;
  sameHandlerLabel: string;
  nextRenderLabel: string;
  snippet: string;
};

export function buildSnapshotNarrative(
  currentValue: number,
  delta: number,
): SnapshotNarrative {
  const nextValue = currentValue + delta;

  return {
    currentRenderLabel: `Текущий рендер видит count = ${currentValue}.`,
    scheduledLabel: `setCount(${nextValue}) только ставит обновление в очередь.`,
    sameHandlerLabel: `Внутри этого же обработчика count всё ещё равен ${currentValue}.`,
    nextRenderLabel: `Лишь следующий рендер получит count = ${nextValue}.`,
    snippet: [
      'function handleClick() {',
      '  setCount(count + 1);',
      '  console.log(count); // старый snapshot текущего рендера',
      '}',
    ].join('\n'),
  };
}
