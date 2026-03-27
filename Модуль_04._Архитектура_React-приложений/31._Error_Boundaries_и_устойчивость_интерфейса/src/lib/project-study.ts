import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, ProjectStudyEntry> = {
  boundaries: {
    files: [
      {
        path: 'src/components/error-boundaries/LessonErrorBoundary.tsx',
        note: 'Реальный class-based Error Boundary с getDerivedStateFromError, componentDidCatch и resetKeys.',
      },
      {
        path: 'src/components/error-boundaries/BoundaryBasicsLab.tsx',
        note: 'Лаборатория, где вы переключаете режимы сбоя и смотрите живой журнал boundary.',
      },
      {
        path: 'src/lib/error-domain.ts',
        note: 'Матрица того, что boundary ловит, а что остаётся вне его зоны.',
      },
    ],
    snippets: [
      {
        label: 'LessonErrorBoundary.tsx',
        note: 'Boundary хранит error state внутри себя и умеет сбрасываться вручную или по resetKeys.',
        code: `static getDerivedStateFromError(error: Error) {
  return { error };
}

componentDidUpdate(previousProps: LessonErrorBoundaryProps) {
  if (this.state.error && haveResetKeysChanged(previousProps.resetKeys, this.props.resetKeys)) {
    this.resetBoundary('reset-keys');
  }
}`,
      },
      {
        label: 'BoundaryBasicsLab.tsx',
        note: 'Смена mode попадает в resetKeys, поэтому boundary автоматически выходит из fallback при смене сценария.',
        code: `<LessonErrorBoundary
  label="Карточка аналитики"
  resetKeys={[mode]}
  onError={(error) => {
    setEvents((current) => [error.message, ...current].slice(0, 4));
  }}
>
  <CrashSurface mode={mode} />
</LessonErrorBoundary>`,
      },
    ],
  },
  isolation: {
    files: [
      {
        path: 'src/components/error-boundaries/IsolationLab.tsx',
        note: 'Сравнение local boundary и shared boundary на одном наборе widget-ов.',
      },
      {
        path: 'src/lib/boundary-scope-model.ts',
        note: 'Pure model для blast radius: сколько карточек теряется при разных placement decisions.',
      },
      {
        path: 'src/components/error-boundaries/CrashSurface.tsx',
        note: 'Один и тот же crashy widget используется в разных конфигурациях boundary.',
      },
    ],
    snippets: [
      {
        label: 'boundary-scope-model.ts',
        note: 'Модель считает, сколько интерфейса останется видимым после сбоя.',
        code: `const lostWidgets =
  crashedWidgets === 0 ? 0 : placement === 'shared' ? totalWidgets : crashedWidgets;
const healthyWidgets = Math.max(totalWidgets - lostWidgets, 0);`,
      },
      {
        label: 'IsolationLab.tsx',
        note: 'В shared-режиме один boundary оборачивает всю секцию и заменяет общий subtree на один fallback.',
        code: `{placement === 'shared' ? (
  <LessonErrorBoundary label="Вся секция">
    <div className="grid gap-4 md:grid-cols-3">{widgets}</div>
  </LessonErrorBoundary>
) : (
  widgets.map((widget) => <LessonErrorBoundary key={widget.id}>{widget}</LessonErrorBoundary>)
)}`,
      },
    ],
  },
  reset: {
    files: [
      {
        path: 'src/components/error-boundaries/ResetStrategiesLab.tsx',
        note: 'Практика retry, resetKeys и remount через key на одном проблемном subtree.',
      },
      {
        path: 'src/lib/boundary-reset-model.ts',
        note: 'Сравнение resetKeys и ручного retry по фактическому состоянию входных данных.',
      },
      {
        path: 'src/components/error-boundaries/LessonErrorBoundary.tsx',
        note: 'Внутренний resetBoundary используется и вручную, и при resetKeys.',
      },
    ],
    snippets: [
      {
        label: 'ResetStrategiesLab.tsx',
        note: 'Изменение scenario сбрасывает boundary автоматически, а смена key создаёт новый экземпляр subtree.',
        code: `<LessonErrorBoundary
  key={boundaryVersion}
  label="Редактор профиля"
  resetKeys={[scenario]}
>
  <CrashSurface mode={scenario === 'broken' ? 'render' : 'safe'} />
</LessonErrorBoundary>`,
      },
      {
        label: 'boundary-reset-model.ts',
        note: 'Retry без исправления входных данных не лечит причину падения.',
        code: `if (reason === 'manual') {
  return inputFixed
    ? 'Повторный render сработает.'
    : 'Обычный retry перерисует тот же самый сломанный subtree.';
}`,
      },
    ],
  },
  'non-caught': {
    files: [
      {
        path: 'src/components/error-boundaries/NonCaughtLab.tsx',
        note: 'Сценарии event handler, timer и promoted async error на одном экране.',
      },
      {
        path: 'src/lib/error-domain.ts',
        note: 'Матрица catchability объясняет, почему event и async live outside boundary.',
      },
      {
        path: 'src/components/error-boundaries/LessonErrorBoundary.tsx',
        note: 'Boundary ловит promoted render error, но не ловит исходный event/timer callback.',
      },
    ],
    snippets: [
      {
        label: 'NonCaughtLab.tsx',
        note: 'Event и timer ошибки здесь ловятся вручную только для того, чтобы демонстрация не уносила dev-сеанс целиком.',
        code: `try {
  throw new Error('Сбой внутри click handler.');
} catch (error) {
  logOutside('Boundary не поймала event handler.');
}`,
      },
      {
        label: 'NonCaughtLab.tsx',
        note: 'Если async-ошибку перевести в render через state, boundary снова сможет её обработать.',
        code: `window.setTimeout(() => {
  setPromotedError(new Error('Async failure переведён в render.'));
}, 300);`,
      },
    ],
  },
  fallback: {
    files: [
      {
        path: 'src/components/error-boundaries/FallbackUxLab.tsx',
        note: 'Два boundary на одном и том же сбое: слабый и сильный fallback UX.',
      },
      {
        path: 'src/lib/fallback-model.ts',
        note: 'Скоринг fallback-профиля: контекст, recovery path и локализация сбоя.',
      },
      {
        path: 'src/components/error-boundaries/CrashSurface.tsx',
        note: 'Одинаковый сбой подставляется под разные стили fallback UI.',
      },
    ],
    snippets: [
      {
        label: 'fallback-model.ts',
        note: 'Полезный fallback не только показывает ошибку, но и сохраняет контекст и recovery path.',
        code: `if (profile.explainsImpact) score += 25;
if (profile.preservesContext) score += 25;
if (profile.offersRecovery) score += 25;
if (profile.isolatesFailure) score += 25;`,
      },
      {
        label: 'FallbackUxLab.tsx',
        note: 'Хороший fallback использует данные вне boundary и даёт осмысленное действие, а не только общую заглушку.',
        code: `fallbackRender={({ reset }) => (
  <div>
    <p>Сломался только блок фильтра {activeFilter}.</p>
    <button onClick={reset}>Повторить</button>
    <button onClick={() => setActiveFilter('all')}>Сбросить фильтр</button>
  </div>
)}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/components/error-boundaries/ArchitecturePlaybookLab.tsx',
        note: 'Интерактивный advisor по placement boundaries в зависимости от риска и слоя состояния.',
      },
      {
        path: 'src/lib/error-architecture-model.ts',
        note: 'Pure model с рекомендациями: widget, section, route или shell safeguard.',
      },
      {
        path: 'src/App.tsx',
        note: 'Shell урока сам использует boundary как last resort fallback поверх активной лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'error-architecture-model.ts',
        note: 'Placement выбирается от риска, shared state и критичности сбоя.',
        code: `const primaryLayer =
  inputs.thirdParty || inputs.risk === 'high'
    ? 'widget'
    : inputs.sharedState === 'app'
      ? 'route'
      : inputs.sharedState === 'section'
        ? 'section'
        : 'widget';`,
      },
      {
        label: 'App.tsx',
        note: 'Shell fallback нужен как последняя страховка, но остаётся уровнем выше локальных лабораторных boundaries.',
        code: `<LessonErrorBoundary
  label="Основная область урока"
  resetKeys={[activeLabId]}
>
  <ActiveComponent />
</LessonErrorBoundary>`,
      },
    ],
  },
};
