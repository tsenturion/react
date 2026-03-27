import clsx from 'clsx';

import { useArchitecturePreferences } from '../../state/useArchitecturePreferences';
import { MetricCard } from '../ui';

function GlobalMirrorCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { density, lens } = useArchitecturePreferences();

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip">Density: {density}</span>
        <span className="chip">Lens: {lens}</span>
      </div>
    </article>
  );
}

export function GlobalStateLab() {
  const { density, lens, setDensity, setLens } = useArchitecturePreferences();

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Global state"
          value="Shared preference"
          hint="Хорошо подходит для UI-настроек, которые нужны нескольким далёким веткам."
          tone="cool"
        />
        <MetricCard
          label="Не подходит для"
          value="Локальный draft"
          hint="Не тащите в общий store то, что касается только одного блока."
          tone="accent"
        />
        <MetricCard
          label="Главный плюс"
          value="Без prop drilling"
          hint="Далёкие компоненты читают одно и то же значение без цепочки промежуточных props."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Глобальные настройки
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-700">Density</span>
                <div className="mt-2 flex gap-2">
                  {(['compact', 'comfortable'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDensity(value)}
                      className={clsx(
                        'rounded-xl px-3 py-2 text-sm font-medium transition',
                        density === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-100',
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-slate-700">Lens</span>
                <div className="mt-2 flex gap-2">
                  {(['tradeoffs', 'debug'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLens(value)}
                      className={clsx(
                        'rounded-xl px-3 py-2 text-sm font-medium transition',
                        lens === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-100',
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <GlobalMirrorCard
            title="Toolbar branch"
            description="Один далёкий участок дерева использует общий preference store."
          />
          <GlobalMirrorCard
            title="Inspector branch"
            description="Вторая ветка синхронно получает то же состояние, не зная про промежуточные уровни."
          />
        </div>
      </div>
    </div>
  );
}
