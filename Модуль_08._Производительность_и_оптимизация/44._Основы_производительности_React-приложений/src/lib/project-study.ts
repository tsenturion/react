import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сам задаёт рамку темы: навигация, dev-оговорка про StrictMode и быстрый вход в performance-файлы.',
      },
      {
        path: 'src/lib/performance-domain.ts',
        note: 'Здесь лежат guide cards и сигналы темы, из которых собирается overview.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует архитектуру урока и объясняет, почему смотреть нужно на причину и цену рендера.',
      },
    ],
    snippets: [
      {
        label: 'performance-domain.ts',
        note: 'Guide cards хранят не UI-украшения, а повторяемые сигналы темы.',
        code: `{
  id: 'measure-first',
  focus: 'measurement',
  title: 'Измеряйте до оптимизации',
}`,
      },
      {
        label: 'router.tsx',
        note: 'Shell сразу проговаривает, что dev-only шум и реальный bottleneck не одно и то же.',
        code: `<p className="mt-3 text-sm leading-6 text-slate-600">
  Урок работает в StrictMode, поэтому смотрите на относительные изменения
  после действий, а не на первую mount-цифру.
</p>`,
      },
    ],
  },
  'render-causes': {
    files: [
      {
        path: 'src/components/performance/RenderCausesLab.tsx',
        note: 'Здесь сравниваются parent render, meaningful prop change и новый object prop.',
      },
      {
        path: 'src/lib/render-performance-model.ts',
        note: 'Чистая модель объясняет, является ли последний ререндер ожидаемым или avoidable.',
      },
      {
        path: 'src/hooks/useRenderCount.ts',
        note: 'Telemetry-hook даёт live render counts без вмешательства в основной state лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'RenderCausesLab.tsx',
        note: 'Memo-child меняет поведение не из-за магии, а из-за referential equality входных props.',
        code: `const previewConfig = unstableObjectProp
  ? { density: 'compact', title: 'Same values, new object reference' }
  : undefined;`,
      },
      {
        label: 'render-performance-model.ts',
        note: 'Диагноз рендера строится как явная модель, а не прячется в тексте страницы.',
        code: `if (input.unstableObjectProp) {
  return {
    headline: 'Parent render задел memo-child лишний раз',
    avoidable: true,
  };
}`,
      },
    ],
  },
  'state-colocation': {
    files: [
      {
        path: 'src/components/performance/StateColocationLab.tsx',
        note: 'Две mini-app решают одну задачу, но по-разному раскладывают state по дереву.',
      },
      {
        path: 'src/lib/state-colocation-model.ts',
        note: 'Чистая модель формулирует blast radius и первый архитектурный ход.',
      },
      {
        path: 'src/components/performance/StateColocationLab.test.tsx',
        note: 'Тест проверяет, что typing в colocated draft не дёргает list до Apply.',
      },
    ],
    snippets: [
      {
        label: 'StateColocationLab.tsx',
        note: 'Draft state в colocated-сценарии остаётся внутри filter panel.',
        code: `function ColocatedFilter({ onApply }: { onApply: (value: string) => void }) {
  const [draft, setDraft] = useState('');
}`,
      },
      {
        label: 'state-colocation-model.ts',
        note: 'Модель сразу различает wide и contained blast radius.',
        code: `return {
  blastRadius: 'wide',
  firstMove: 'Переместите draft ближе к input',
};`,
      },
    ],
  },
  'data-structure': {
    files: [
      {
        path: 'src/lib/data-structure-model.ts',
        note: 'Тут живут dataset builder, index builder и две стратегии projection.',
      },
      {
        path: 'src/components/performance/DataStructureLab.tsx',
        note: 'Страница сравнивает nested и indexed projection на одинаковом фильтре.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Тест фиксирует, что indexed projection сохраняет результат, но уменьшает объём операций.',
      },
    ],
    snippets: [
      {
        label: 'data-structure-model.ts',
        note: 'Indexed projection стартует с более узкого candidate set.',
        code: `if (filters.track !== 'all') {
  base = index.byTrack[filters.track];
}`,
      },
      {
        label: 'DataStructureLab.tsx',
        note: 'Лаборатория измеряет и elapsed time, и стабильный счётчик operations.',
        code: `const nested = measureProjection(() => projectNested(catalogByPreset[size], filters));
const indexed = measureProjection(() => projectIndexed(indexByPreset[size], filters));`,
      },
    ],
  },
  bottlenecks: {
    files: [
      {
        path: 'src/components/performance/BottleneckLab.tsx',
        note: 'Здесь synthetic slow grid нужен как контролируемый дорогой subtree для сравнения сценариев.',
      },
      {
        path: 'src/lib/bottleneck-model.ts',
        note: 'Модель считает, сколько rows реально задеты действием и что с этим делать дальше.',
      },
      {
        path: 'src/hooks/useRenderCount.ts',
        note: 'Render telemetry нужна и здесь: без неё bottleneck видно хуже.',
      },
    ],
    snippets: [
      {
        label: 'BottleneckLab.tsx',
        note: 'Synthetic slow grid тратит CPU осознанно, чтобы лаг был воспроизводимым.',
        code: `for (let row = 0; row < rowCount; row += 1) {
  checksum += burnCpu(workUnits);
}`,
      },
      {
        label: 'bottleneck-model.ts',
        note: 'Toggle может быть дешёвым действием, но широким bottleneck.',
        code: `if (input.lastInteraction === 'toggle-inspector' && !input.isolatedControls) {
  return { bottleneck: 'wide-rerender' };
}`,
      },
    ],
  },
  'premature-optimization': {
    files: [
      {
        path: 'src/components/performance/OptimizationAdvisorLab.tsx',
        note: 'Интерактивный advisor собирает diagnosis из нескольких архитектурных сигналов.',
      },
      {
        path: 'src/lib/performance-advisor-model.ts',
        note: 'Чистая модель формулирует verdict, next move и список плохих реакций.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Тесты фиксируют, что разные сочетания lag, scope и cause дают разные рекомендации.',
      },
    ],
    snippets: [
      {
        label: 'performance-advisor-model.ts',
        note: 'Если причина похожа на wide rerender, первый ход — сузить blast radius.',
        code: `if (input.suspectedCause === 'wide-rerender') {
  return {
    verdict: 'Начните с state placement',
  };
}`,
      },
      {
        label: 'OptimizationAdvisorLab.tsx',
        note: 'Verdict строится как функция от lag, frequency, scope и measurement state.',
        code: `const verdict = evaluateOptimizationNeed({
  lagSeverity,
  frequency,
  scope,
  suspectedCause,
  measurement,
});`,
      },
    ],
  },
};
