export interface StudyFile {
  path: string;
  note: string;
}

export interface StudySnippet {
  label: string;
  note: string;
  code: string;
}

export interface StudyMaterial {
  files: StudyFile[];
  snippets: StudySnippet[];
}

export const ecosystemStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/EcosystemPage.tsx',
      note: 'Здесь находится UI самой лаборатории: выбор сценария, подсветка активных слоёв и проверка артефактов.',
    },
    {
      path: 'src/lib/learning-model.ts',
      note: 'Откройте `ecosystemLayers`, `ecosystemTasks`, `artifactChecks` и `ecosystemReferencePoints`: именно эти структуры описывают карту экосистемы и современные стартовые точки.',
    },
    {
      path: 'src/App.tsx',
      note: 'Здесь видно, как общий layout проекта работает вместе с NavLink и Outlet.',
    },
    {
      path: 'src/router.tsx',
      note: 'Здесь собраны реальные маршруты лабораторий и redirect на стартовую страницу.',
    },
    {
      path: 'README.md',
      note: 'Фиксирует место этой лаборатории в общей структуре учебного проекта.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/learning-model.ts',
      note: 'Карта экосистемы описана не в JSX, а как отдельная модель предметной области.',
      code: [
        'export const ecosystemLayers: EcosystemLayer[] = [',
        "  { id: 'browser', title: 'Браузер', zone: 'browser', short: 'Показывает интерфейс и выполняет клиентский JS.' },",
        "  { id: 'react', title: 'React', zone: 'architecture', short: 'Декларативный слой описания UI из компонентов.' },",
        "  { id: 'vite', title: 'Vite', zone: 'tooling', short: 'Делает dev server, HMR и production build.' },",
        "  { id: 'react-router-framework', title: 'React Router framework mode', zone: 'architecture', short: 'Поднимает React Router до framework-уровня.' },",
        "  { id: 'nextjs', title: 'Next.js', zone: 'architecture', short: 'Full-stack React framework с App Router и server features.' },",
        "  { id: 'full-stack-react', title: 'Full-stack React', zone: 'architecture', short: 'Зона, где React работает вместе с сервером и данными.' },",
        '];',
      ].join('\n'),
    },
    {
      label: 'src/lib/learning-model.ts',
      note: 'CRA, Vite, React Router framework mode и Next.js зафиксированы как отдельные референсные точки, а не спрятаны в тексте страницы.',
      code: [
        'export const ecosystemReferencePoints: EcosystemReferencePoint[] = [',
        "  { id: 'cra', label: 'Create React App (CRA)', status: 'Legacy стартовая точка', ... },",
        "  { id: 'vite', label: 'Vite', status: 'Основная client-side отправная точка', ... },",
        "  { id: 'react-router-framework', label: 'React Router framework mode', status: 'Framework-first вариант на базе React Router', ... },",
        "  { id: 'nextjs', label: 'Next.js App Router', status: 'Full-stack React framework', ... },",
        '];',
      ].join('\n'),
    },
    {
      label: 'src/router.tsx',
      note: 'Текущий проект не только говорит о React Router, но и реально использует его для навигации между лабораториями.',
      code: [
        'export const router = createBrowserRouter([',
        '  {',
        "    path: '/',",
        '    element: <AppLayout />,',
        "    children: [{ index: true, element: <Navigate to=\"/ecosystem\" replace /> }, ...],",
        '  },',
        ']);',
      ].join('\n'),
    },
    {
      label: 'src/pages/EcosystemPage.tsx',
      note: 'Страница не хранит сложную логику в JSX: она берёт выбранный сценарий из модели и только визуализирует его.',
      code: [
        "const [taskId, setTaskId] = useState(ecosystemTasks[0].id);",
        '',
        'const task = ecosystemTasks.find((item) => item.id === taskId) ?? ecosystemTasks[0];',
        '',
        '{ecosystemLayers.map((layer) => {',
        '  const active = task.activeLayers.includes(layer.id);',
        '  return (',
        '    <div key={layer.id} className={active ? "...active..." : "...idle..."}>',
        '      <p>{layer.title}</p>',
        '    </div>',
        '  );',
        '})}',
      ].join('\n'),
    },
  ],
};

export const whyReactStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/WhyReactPage.tsx',
      note: 'Здесь собраны интерактивные контролы лаборатории: сложность сценария, набор фич интерфейса и сборка страницы из реальных React-компонентов.',
    },
    {
      path: 'src/lib/learning-model.ts',
      note: 'Функция `analyzeReactValue` переводит параметры лаборатории в метрики: шаги, риск и предсказуемость.',
    },
    {
      path: 'src/components/ui.tsx',
      note: 'Компоненты `MetricCard` и `CodeBlock` показывают, как проект оформляет сравнительные метрики и листинги.',
    },
    {
      path: 'src/App.tsx',
      note: 'Общий shell показывает, как layout и текущая лаборатория соединяются через React Router.',
    },
    {
      path: 'src/router.tsx',
      note: 'Роутер показывает, что даже учебный shell можно держать как маршрутизируемую структуру, а не как один state-switch.',
    },
  ],
  snippets: [
    {
      label: 'src/pages/WhyReactPage.tsx',
      note: 'Сама лаборатория построена как интерактивный конфигуратор сценария, а не как статическая статья.',
      code: [
        'const [complexity, setComplexity] = useState(3);',
        "const [features, setFeatures] = useState<ReactFeatureId[]>(['shared-state', 'repeated-blocks']);",
        '',
        '// Компонент хранит только состояние UI,',
        '// а все вычисления делегирует в pure function.',
        'const analysis = analyzeReactValue(complexity, features);',
        '',
        'const toggleFeature = (featureId: ReactFeatureId) => {',
        '  setFeatures((current) =>',
        '    current.includes(featureId)',
        '      ? current.filter((item) => item !== featureId)',
        '      : [...current, featureId],',
        '  );',
        '};',
      ].join('\n'),
    },
    {
      label: 'src/lib/learning-model.ts',
      note: 'Логика сравнения императивного и компонентного подходов вынесена в чистую функцию, которую можно читать отдельно от UI.',
      code: [
        '// Компонент хранит состояние,',
        '// а предметная функция считает выводы.',
        'export function analyzeReactValue(complexity: number, features: ReactFeatureId[]): ReactValueAnalysis {',
        '  const featureSet = new Set(features);',
        '  const manualSteps = complexity * 5 + features.length * 4 + (featureSet.has(\'shared-state\') ? 6 : 0);',
        '  const manualRisk = clamp(22 + complexity * 11 + features.length * 9, 12, 96);',
        '  const reactUnits = 3 + Math.ceil(complexity / 2) + features.length;',
        '',
        '  return { manualSteps, manualRisk, reactUnits, reactPredictability, ... };',
        '}',
      ].join('\n'),
    },
    {
      label: 'src/components/ui.tsx',
      note: 'Тема про компоненты опирается на реальные компоненты текущего проекта: лаборатории собираются из `Panel`, `MetricCard`, `CodeBlock` и других составных блоков.',
      code: [
        'export function Panel({ className, children }: { className?: string; children: ReactNode }) {',
        "  return <section className={clsx('panel p-5 sm:p-6', className)}>{children}</section>;",
        '}',
        '',
        'export function MetricCard({ label, value, hint, tone = "default" }: MetricCardProps) {',
        '  return (',
        '    <div className={clsx("rounded-[24px] border p-4", tone === "accent" && "...")}>',
        '      <p>{label}</p>',
        '      <p>{value}</p>',
        '      <p>{hint}</p>',
        '    </div>',
        '  );',
        '}',
      ].join('\n'),
    },
  ],
};

export const pipelineStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/PipelinePage.tsx',
      note: 'Здесь видно, как режим пайплайна, набор фич и типовые ошибки соединяются в одну интерактивную модель.',
    },
    {
      path: 'src/lib/learning-model.ts',
      note: 'Откройте `analyzePipeline`, `pipelineModes`, `pipelineFeatureOptions` и `pipelineIssueOptions`.',
    },
    {
      path: 'vite.config.ts',
      note: 'Это реальный конфиг Vite текущего проекта: он нужен не для симуляции, а для настоящей сборки приложения.',
    },
    {
      path: 'vitest.config.ts',
      note: 'Показывает, как тестовая конфигурация отделена от сборочной.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/learning-model.ts',
      note: 'Пайплайн описан как набор этапов со статусами, а не как неструктурированный вывод прямо из компонента.',
      code: [
        'export function analyzePipeline(mode: PipelineModeId, features: PipelineFeatureId[], issues: PipelineIssueId[]) {',
        '  const unsupported = features.filter((feature) => !modeCapabilities[mode][feature]);',
        '  const stages: PipelineStage[] = [];',
        '',
        '  stages.push({ id: "authoring", label: "1. Исходники", status: "success", note: "..." });',
        '  stages.push({ id: "transform", label: "2. Transform / compile", status: unsupported.length ? "error" : "success", note: "..." });',
        '  stages.push({ id: "deps", label: "3. Зависимости", status: "...", note: "..." });',
        '',
        '  return { overall, stages, before, after, mistakes, importance };',
        '}',
      ].join('\n'),
    },
    {
      label: 'vite.config.ts',
      note: 'В проекте есть настоящий сборочный конфиг, поэтому лаборатория про pipeline опирается на реальный toolchain.',
      code: [
        "import tailwindcss from '@tailwindcss/vite';",
        "import react from '@vitejs/plugin-react';",
        "import { defineConfig } from 'vite';",
        '',
        'export default defineConfig({',
        '  plugins: [react(), tailwindcss()],',
        '});',
      ].join('\n'),
    },
  ],
};

export const deliveryStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/DeliveryModesPage.tsx',
      note: 'Здесь находится UI выбора требований, пресетов и итоговой рекомендации.',
    },
    {
      path: 'src/lib/learning-model.ts',
      note: 'Откройте `recommendDeliveryModes`, `deliveryRequirementOptions` и `scoreDeliveryMode`.',
    },
    {
      path: 'src/App.tsx',
      note: 'Общий shell сам является примером Vite SPA с клиентским React Router, а не framework-first приложения.',
    },
    {
      path: 'src/router.tsx',
      note: 'Здесь видно, как клиентский роутинг отделён от обсуждения framework mode и Next.js.',
    },
    {
      path: 'README.md',
      note: 'Показывает, как проект сам документирует свой уровень сложности и стек.',
    },
  ],
  snippets: [
    {
      label: 'src/pages/DeliveryModesPage.tsx',
      note: 'У пресетов есть вычисляемое активное состояние: это не просто кнопки, а осмысленная синхронизация UI с моделью требований.',
      code: [
        'const [requirements, setRequirements] = useState<DeliveryRequirementId[]>(presets[0].requirements);',
        '',
        'const recommendation = recommendDeliveryModes(requirements);',
        '',
        '// Активный пресет вычисляется из текущих требований,',
        '// а не запоминается отдельным состоянием.',
        'const activePresetId =',
        '  presets.find(',
        '    (preset) =>',
        '      preset.requirements.length === requirements.length &&',
        '      preset.requirements.every((item) => requirements.includes(item)),',
        '  )?.id ?? null;',
      ].join('\n'),
    },
    {
      label: 'src/lib/learning-model.ts',
      note: 'Архитектурная рекомендация считается из требований продукта, а не выбирается вручную в компоненте.',
      code: [
        '// Требования -> score -> итоговая рекомендация.',
        'function scoreDeliveryMode(requirements: Set<DeliveryRequirementId>, mode: \'script-tag\' | \'vite-spa\' | \'framework-first\') {',
        '  if (requirements.has(\'interactive-dashboard\')) {',
        '    scores[\'vite-spa\'] += 5;',
        '    scores[\'framework-first\'] += 2;',
        '  }',
        '',
        '  if (requirements.has(\'server-actions\')) {',
        '    scores[\'framework-first\'] += 6;',
        '  }',
        '',
        "  // Framework-first здесь дальше раскрывается через",
        "  // React Router framework mode и Next.js.",
        '}',
      ].join('\n'),
    },
  ],
};

export const toolingStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/ToolingPage.tsx',
      note: 'Здесь собрана интерактивная симуляция среды: scripts, зависимости, тесты, Docker и характерные ошибки.',
    },
    {
      path: 'src/lib/learning-model.ts',
      note: 'Откройте `collectToolingDiagnostics`, `runToolingCommand`, `buildPackagePreview` и `buildDockerPreview`.',
    },
    {
      path: 'package.json',
      note: 'Показывает реальные scripts и зависимости текущего проекта, включая react-router-dom.',
    },
    {
      path: 'Dockerfile',
      note: 'Показывает, как проект действительно собирается в production-образ.',
    },
    {
      path: 'nginx.conf',
      note: 'Показывает реальную настройку сервера для раздачи собранного приложения.',
    },
    {
      path: 'compose.yaml',
      note: 'Минимальная контейнерная обвязка для локального запуска.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/learning-model.ts',
      note: 'Команды среды моделируются как чистая функция: одна и та же конфигурация всегда даёт предсказуемый результат.',
      code: [
        '// Одна конфигурация всегда даёт один и тот же результат,',
        '// поэтому поведение легко читать и тестировать.',
        'export function runToolingCommand(config: ToolingConfig, command: ToolingCommandId): ToolingCommandResult {',
        '  if (config.nodeVersion < 20) {',
        '    return { status: \'error\', title: \'Команда не стартует из-за версии Node.js\', ... };',
        '  }',
        '',
        '  if (command === \'build\' && !config.hasBuildScript) {',
        '    return { status: \'error\', title: \'Production build не описан в scripts\', ... };',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      label: 'package.json',
      note: 'Сама лаборатория про tooling опирается на реальный `package.json` проекта, а не на выдуманный пример.',
      code: [
        '"scripts": {',
        '  "dev": "vite",',
        '  "build": "tsc --noEmit && vite build",',
        '  "preview": "vite preview --host 0.0.0.0 --port 4173",',
        '  "test": "vitest run"',
        '},',
        '"dependencies": {',
        '  "react-router-dom": "7.13.1"',
        '}',
      ].join('\n'),
    },
  ],
};
