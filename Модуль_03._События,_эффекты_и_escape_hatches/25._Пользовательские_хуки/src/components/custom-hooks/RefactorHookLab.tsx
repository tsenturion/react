import { useFeedbackDraft } from '../../hooks/useFeedbackDraft';
import { MetricCard, StatusPill } from '../ui';

export function RefactorHookLab() {
  const feedback = useFeedbackDraft();
  const errorCount = Object.values(feedback.errors).filter(Boolean).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Шум без hook-а"
            value="7+ веток"
            hint="Поля, ошибки, preview, reset и toggle быстро разрастаются прямо в компоненте."
          />
          <MetricCard
            label="Ошибок сейчас"
            value={String(errorCount)}
            hint="Валидация уже встроена в контракт hook-а."
            tone={errorCount === 0 ? 'cool' : 'accent'}
          />
          <MetricCard
            label="Готов к отправке"
            value={feedback.isReady ? 'Да' : 'Нет'}
            hint="Экран читает готовность как derived state, а не вычисляет её вручную."
            tone={feedback.isReady ? 'cool' : 'default'}
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Имя или роль</span>
              <input
                value={feedback.draft.name}
                onChange={(event) => feedback.updateField('name', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
              {feedback.errors.name ? (
                <span className="mt-2 block text-sm text-rose-600">
                  {feedback.errors.name}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Канал</span>
              <select
                value={feedback.draft.channel}
                onChange={(event) =>
                  feedback.updateField(
                    'channel',
                    event.target.value as typeof feedback.draft.channel,
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="slack">Slack</option>
                <option value="email">email</option>
                <option value="issue">issue tracker</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Описание</span>
            <textarea
              value={feedback.draft.message}
              onChange={(event) => feedback.updateField('message', event.target.value)}
              rows={6}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
            />
            {feedback.errors.message ? (
              <span className="mt-2 block text-sm text-rose-600">
                {feedback.errors.message}
              </span>
            ) : null}
          </label>

          <label className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={feedback.draft.includeCode}
              onChange={feedback.toggleIncludeCode}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Добавить кодовый контекст</span>
          </label>

          <button
            type="button"
            onClick={feedback.reset}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Сбросить draft
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Что наружу отдаёт hook</p>
            <StatusPill tone={feedback.isReady ? 'success' : 'warn'}>
              {feedback.isReady ? 'ready' : 'needs-fix'}
            </StatusPill>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li>`draft` как единая модель формы</li>
            <li>`errors` как derived validation state</li>
            <li>`preview` как готовая текстовая сводка</li>
            <li>`updateField`, `toggleIncludeCode`, `reset` как команды</li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">Preview</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{feedback.preview}</p>
        </div>
      </div>
    </div>
  );
}
