import { useMemo, useState } from 'react';

import { behaviorPresets, type RiskLevel } from '../../lib/testing-domain';

type SaveState = 'idle' | 'saved';

function getBehaviorFeedback(title: string, risk: RiskLevel, hasSteps: boolean) {
  const titleReady = title.trim().length >= 4;
  const ready = titleReady && hasSteps;

  return {
    ready,
    tone: risk === 'high' && ready ? 'warning-ready' : ready ? 'ready' : 'needs-input',
    summary: ready
      ? risk === 'high'
        ? 'Сценарий готов к regression pack и требует явного предупреждения о риске.'
        : 'Сценарий готов к поведению уровня component test.'
      : 'Пока не хватает либо названия, либо воспроизводимых шагов.',
  };
}

export function BehaviorWorkbench() {
  const [presetId, setPresetId] = useState(behaviorPresets[0]?.id ?? '');
  const preset =
    behaviorPresets.find((item) => item.id === presetId) ?? behaviorPresets[0];
  const [title, setTitle] = useState(preset?.title ?? '');
  const [risk, setRisk] = useState<RiskLevel>(preset?.risk ?? 'low');
  const [hasSteps, setHasSteps] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const feedback = useMemo(
    () => getBehaviorFeedback(title, risk, hasSteps),
    [title, risk, hasSteps],
  );

  const applyPreset = (nextPresetId: string) => {
    const nextPreset =
      behaviorPresets.find((item) => item.id === nextPresetId) ?? behaviorPresets[0];

    setPresetId(nextPreset.id);
    setTitle(nextPreset.title);
    setRisk(nextPreset.risk);
    setHasSteps(false);
    setSaveState('idle');
  };

  // Баннер сбрасывается при любом реальном изменении входов сценария,
  // потому что после правки текста прежнее "сохранено" уже не относится
  // к текущему состоянию формы.
  const markDirty = () => {
    if (saveState === 'saved') {
      setSaveState('idle');
    }
  };

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Behavior-first component
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Компонент ниже специально сделан под пользовательские проверки
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {feedback.tone}
        </span>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Пресет сценария</span>
        <select
          aria-label="Пресет сценария"
          value={presetId}
          onChange={(event) => applyPreset(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
        >
          {behaviorPresets.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Название сценария</span>
        <input
          aria-label="Название сценария"
          type="text"
          value={title}
          onChange={(event) => {
            markDirty();
            setTitle(event.target.value);
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Риск</span>
        <select
          aria-label="Риск"
          value={risk}
          onChange={(event) => {
            markDirty();
            setRisk(event.target.value as RiskLevel);
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <input
          aria-label="Есть воспроизводимые шаги"
          type="checkbox"
          checked={hasSteps}
          onChange={(event) => {
            markDirty();
            setHasSteps(event.target.checked);
          }}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm leading-6 text-slate-700">
          Есть воспроизводимые шаги
        </span>
      </label>

      <div
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
      >
        {feedback.summary}
      </div>

      <button
        type="button"
        disabled={!feedback.ready}
        onClick={() => setSaveState('saved')}
        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Сохранить сценарий
      </button>

      {saveState === 'saved' ? (
        <div
          role="status"
          className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900"
        >
          Сценарий сохранён для regression pack.
        </div>
      ) : null}

      <p className="text-sm leading-6 text-slate-600">{preset?.description}</p>
    </section>
  );
}
