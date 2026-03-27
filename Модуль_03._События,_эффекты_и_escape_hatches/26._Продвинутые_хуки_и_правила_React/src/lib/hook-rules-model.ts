import type { StatusTone } from './learning-model';

export type HookRulePresetId =
  | 'stable-top-level'
  | 'conditional-call'
  | 'early-return'
  | 'hook-in-loop';

export const hookRulePresets: readonly {
  id: HookRulePresetId;
  label: string;
  description: string;
}[] = [
  {
    id: 'stable-top-level',
    label: 'Стабильный top-level',
    description: 'Условия меняют данные, но не порядок вызова hooks.',
  },
  {
    id: 'conditional-call',
    label: 'Hook внутри условия',
    description: 'Дополнительный hook появляется только в части рендеров.',
  },
  {
    id: 'early-return',
    label: 'Hook после early return',
    description: 'Один рендер возвращает раньше и не доходит до остальных hooks.',
  },
  {
    id: 'hook-in-loop',
    label: 'Hook в цикле',
    description: 'Количество вызовов зависит от длины списка.',
  },
] as const;

export function buildHookOrder(
  preset: HookRulePresetId,
  variantValue: number | boolean,
): string[] {
  switch (preset) {
    case 'stable-top-level':
      return ['useState(filter)', 'useMemo(summary)', 'useEffect(sync)'];
    case 'conditional-call':
      return variantValue
        ? ['useState(filter)', 'useDebugValue(audit)', 'useEffect(sync)']
        : ['useState(filter)', 'useEffect(sync)'];
    case 'early-return':
      return variantValue
        ? ['useState(filter)', 'useRef(node)', 'useEffect(sync)']
        : ['useState(filter)'];
    case 'hook-in-loop': {
      const count = typeof variantValue === 'number' ? variantValue : 0;
      return [
        'useState(filter)',
        ...Array.from({ length: count }, (_, index) => `useState(item-${index + 1})`),
        'useEffect(sync)',
      ];
    }
  }
}

export function compareHookOrders(first: string[], second: string[]) {
  const maxLength = Math.max(first.length, second.length);
  const slotPairs = Array.from({ length: maxLength }, (_, index) => ({
    slot: index + 1,
    first: first[index] ?? '—',
    second: second[index] ?? '—',
    changed: first[index] !== second[index],
  }));
  const changedSlots = slotPairs.filter((slot) => slot.changed);

  let tone: StatusTone = 'success';
  if (changedSlots.length > 0) {
    tone = 'error';
  }

  return {
    slotPairs,
    changedSlots,
    tone,
    headline:
      changedSlots.length === 0
        ? 'Порядок вызова hooks остаётся стабильным'
        : 'Порядок вызова hooks сдвигается между рендерами',
  };
}
