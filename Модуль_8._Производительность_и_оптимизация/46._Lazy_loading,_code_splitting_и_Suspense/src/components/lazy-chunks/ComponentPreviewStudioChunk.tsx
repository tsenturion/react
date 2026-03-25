import { useRenderCount } from '../../hooks/useRenderCount';

export function ComponentPreviewStudioChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Preview studio loaded</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Rich preview-editor имеет смысл вытаскивать в отдельный chunk, если он нужен
            не в каждом сценарии.
          </p>
        </div>
        <output aria-label="Preview studio chunk commits" className="chip">
          {commits} commits
        </output>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          staged preview
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Markdown parser, syntax highlighter и preview surface приходят позже, а shell
          экрана остаётся доступным сразу.
        </p>
      </div>
    </div>
  );
}
