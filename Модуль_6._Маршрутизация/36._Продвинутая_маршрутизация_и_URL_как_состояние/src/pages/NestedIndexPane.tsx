export function NestedIndexPane() {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
      <p className="text-sm leading-6 text-slate-700">
        Индексный child route живёт на том же parent path и показывает стартовое состояние
        ветки, пока конкретная сущность ещё не выбрана.
      </p>
    </div>
  );
}
