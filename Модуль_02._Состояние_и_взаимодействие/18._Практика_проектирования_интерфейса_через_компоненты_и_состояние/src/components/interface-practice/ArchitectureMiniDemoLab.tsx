import { CourseWorkbench } from './CourseWorkbench';

export function ArchitectureMiniDemoLab() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Итоговый mini-demo
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Это уже не отдельный симулятор одного правила, а цельный экран. Здесь видны
          сразу все связи: input controls меняют owner state, derived collections
          пересчитываются на render, список и details читают одни данные, а snapshot
          справа показывает, что именно хранится в state.
        </p>
      </div>

      <CourseWorkbench showSnapshot />
    </div>
  );
}
