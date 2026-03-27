import clsx from 'clsx';
import { useState } from 'react';

import { evaluateFallbackProfile, fallbackTone } from '../../lib/fallback-model';
import { StatusPill } from '../ui';
import { CrashSurface } from './CrashSurface';
import { LessonErrorBoundary } from './LessonErrorBoundary';

const poorProfile = {
  explainsImpact: false,
  preservesContext: false,
  offersRecovery: false,
  isolatesFailure: true,
  exposesRawError: false,
} as const;

const goodProfile = {
  explainsImpact: true,
  preservesContext: true,
  offersRecovery: true,
  isolatesFailure: true,
  exposesRawError: false,
} as const;

export function FallbackUxLab() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'team' | 'billing'>('all');
  const [shouldCrash, setShouldCrash] = useState(false);
  const poorScore = evaluateFallbackProfile(poorProfile);
  const goodScore = evaluateFallbackProfile(goodProfile);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Контекст вне boundary
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['all', 'team', 'billing'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              className={clsx(
                'rounded-xl px-4 py-2 text-sm font-medium transition',
                activeFilter === value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShouldCrash((current) => !current)}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              shouldCrash
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-emerald-600 text-white shadow-md',
            )}
          >
            {shouldCrash ? 'Вернуть healthy режим' : 'Сломать оба виджета'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Слабый fallback</h3>
            <StatusPill tone={fallbackTone(poorScore)}>score {poorScore}</StatusPill>
          </div>
          <LessonErrorBoundary
            label="Poor fallback"
            resetKeys={[shouldCrash]}
            fallbackRender={() => (
              <div className="space-y-3 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
                <p className="text-lg font-semibold text-rose-950">Что-то пошло не так</p>
                <p className="text-sm leading-6 text-rose-900">
                  Здесь нет scope проблемы, нет recovery path и непонятно, что осталось
                  рабочим вокруг этой области.
                </p>
              </div>
            )}
          >
            <CrashSurface
              label="Сводка активности"
              summary="Одинаковый сбой подаётся в два boundary, чтобы вы сравнили именно качество fallback UX."
              mode={shouldCrash ? 'render' : 'safe'}
            />
          </LessonErrorBoundary>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Сильный fallback</h3>
            <StatusPill tone={fallbackTone(goodScore)}>score {goodScore}</StatusPill>
          </div>
          <LessonErrorBoundary
            label="Helpful fallback"
            resetKeys={[shouldCrash, activeFilter]}
            fallbackRender={({ reset }) => (
              <div className="space-y-4 rounded-[28px] border border-amber-300 bg-amber-50 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Только этот блок
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-amber-950">
                    Фильтр {activeFilter} временно недоступен
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    Остальная страница продолжает работать. Вы можете повторить render или
                    вернуться к безопасному фильтру.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    Повторить render
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    Сбросить фильтр
                  </button>
                </div>
              </div>
            )}
          >
            <CrashSurface
              label="Сводка активности"
              summary="Тот же сбой, но fallback сохраняет контекст, сообщает scope и даёт путь восстановления."
              mode={shouldCrash ? 'render' : 'safe'}
            />
          </LessonErrorBoundary>
        </div>
      </div>
    </div>
  );
}
