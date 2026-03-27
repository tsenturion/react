import { useMemo, useState, type ReactNode } from 'react';

type Item = {
  id: string;
  title: string;
  summary: string;
  risk: string;
  examples: readonly string[];
};

type SelectionLensRenderArgs = {
  items: readonly Item[];
  selected: Item;
  totalExamples: number;
  select: (id: string) => void;
};

export function SelectionLens({
  items,
  initialId,
  children,
}: {
  items: readonly Item[];
  initialId: string;
  children: (args: SelectionLensRenderArgs) => ReactNode;
}) {
  const [selectedId, setSelectedId] = useState(initialId);
  const selected = items.find((item) => item.id === selectedId) ?? items[0]!;
  const totalExamples = useMemo(
    () => items.reduce((sum, item) => sum + item.examples.length, 0),
    [items],
  );

  // Render prop нужен здесь именно затем, чтобы логика выбора и статистика
  // жили внутри компонента, а caller мог полностью переопределить render layer.
  return <>{children({ items, selected, totalExamples, select: setSelectedId })}</>;
}
