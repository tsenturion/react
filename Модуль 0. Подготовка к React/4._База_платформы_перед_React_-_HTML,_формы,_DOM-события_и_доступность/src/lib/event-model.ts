export type EventNodeId = 'surface' | 'panel' | 'link';
export type EventPhaseName = 'capture' | 'bubble';

export type NativeEventRecord = {
  node: EventNodeId;
  phase: EventPhaseName;
  defaultPrevented: boolean;
  hash: string;
};

export const formatNativeEventLine = (record: NativeEventRecord) =>
  `${record.phase.toUpperCase()} • ${record.node} • defaultPrevented=${record.defaultPrevented} • hash=${record.hash || 'none'}`;

export const summarizeNativeEventLog = (records: NativeEventRecord[]) => ({
  captureCount: records.filter((item) => item.phase === 'capture').length,
  bubbleCount: records.filter((item) => item.phase === 'bubble').length,
  preventedCount: records.filter((item) => item.defaultPrevented).length,
});

export const describeEventScenario = ({
  stopPropagation,
  preventDefault,
}: {
  stopPropagation: boolean;
  preventDefault: boolean;
}) => {
  const expectations = [
    'Capture идёт сверху вниз: surface -> panel -> link.',
    stopPropagation
      ? 'Bubble остановится на link и выше не поднимется.'
      : 'Bubble поднимется обратно: link -> panel -> surface.',
    preventDefault
      ? 'Default action у anchor будет отменено, hash не изменится.'
      : 'Default action у anchor сохранится, hash обновится.',
  ];

  return {
    expectations,
    codePreview: `node.addEventListener('click', handler, true); // capture
node.addEventListener('click', handler); // bubble

if (preventDefault) event.preventDefault();
if (stopPropagation) event.stopPropagation();`,
  };
};
