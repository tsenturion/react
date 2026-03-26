import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сразу раскладывает тему на сравнение frameworks, route modules, data flow, rendering strategy и playbook.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Route map урока и связь лабораторий с URL.',
      },
      {
        path: 'src/server/framework-runtime.ts',
        note: 'Учебный full-stack runtime report, который показывает pipeline маршрута уже на уровне server-side модели.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Маршруты урока выражают не меню ради меню, а разные аспекты framework-first full-stack архитектуры.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/framework-overview?focus=all' },
  { id: 'frameworks', href: '/framework-choice' },
  { id: 'routes', href: '/route-modules-and-structure' },
  { id: 'data', href: '/full-stack-data-flow' },
  { id: 'rendering', href: '/rendering-strategies-and-direction' },
  { id: 'playbook', href: '/framework-playbook' },
] as const;`,
      },
      {
        label: 'Runtime report',
        note: 'Тема урока выражена не только в UI: есть учебный server-side отчёт, который показывает route pipeline и разделение server/client файлов.',
        code: `export function simulateFrameworkRequest(input) {
  const serverFiles =
    input.framework === 'next-app-router'
      ? ['app/layout.tsx', \`app/\${input.routeKind}/page.tsx\`]
      : ['app/root.tsx', \`app/routes/\${input.routeKind}.tsx\`];

  const clientFiles =
    input.framework === 'next-app-router'
      ? [\`components/\${input.routeKind}/toolbar-client.tsx\`]
      : [\`components/\${input.routeKind}/interactive-panel.tsx\`];
}`,
      },
    ],
  },
  frameworks: {
    files: [
      {
        path: 'src/components/framework-labs/FrameworkComparisonLab.tsx',
        note: 'Интерактивный chooser для Next.js, React Router framework mode и DIY SPA.',
      },
      {
        path: 'src/lib/framework-comparison-model.ts',
        note: 'Профили frameworks и их сравнительная оценка по требованиям продукта.',
      },
      {
        path: 'src/lib/framework-playbook-model.ts',
        note: 'Итоговая архитектурная стратегия строится поверх той же framework модели.',
      },
    ],
    snippets: [
      {
        label: 'Framework profiles',
        note: 'Урок хранит не общие слова, а явные framework profiles с routing/data/rendering story.',
        code: `export const frameworkProfiles = {
  'react-router-framework': {
    routingModel: 'Route modules и nested layouts вокруг URL и экранов.',
    dataLoading: 'Loaders, actions, error boundaries и server rendering вокруг route modules.',
    pprDirection: 'emerging',
  },
  'next-app-router': {
    routingModel: 'Файловая структура вокруг layouts, segments и server/client boundaries.',
    dataLoading: 'Server Components, server functions и rendering pipeline встроены в framework.',
    pprDirection: 'strong',
  },
} as const;`,
      },
      {
        label: 'Suitability scoring',
        note: 'Сравнение frameworks завязано на product shape, а не на абстрактные “плюсы/минусы” в вакууме.',
        code: `if (input.needsSsr) {
  score += id === 'next-app-router' ? 3 : id === 'react-router-framework' ? 2 : 0;
}

if (input.needsServerMutations) {
  score += id === 'next-app-router' ? 3 : id === 'react-router-framework' ? 2 : 0;
}`,
      },
    ],
  },
  routes: {
    files: [
      {
        path: 'src/components/framework-labs/RouteStructureLab.tsx',
        note: 'Sandbox, который генерирует route structure под Next.js и React Router framework mode.',
      },
      {
        path: 'src/lib/route-structure-model.ts',
        note: 'Генерация дерева проекта и метрик route ownership.',
      },
      {
        path: 'src/router.tsx',
        note: 'Shell урока сам держится на route-driven структуре и подчёркивает значение ownership маршрута.',
      },
    ],
    snippets: [
      {
        label: 'Next tree builder',
        note: 'Для Next.js структура строится вокруг app tree, layouts, data files и server actions рядом с сегментом.',
        code: `const lines = [
  'app/',
  '  layout.tsx',
  '  (marketing)/page.tsx',
  '  (app)/dashboard/layout.tsx',
  '  (app)/dashboard/page.tsx',
];

if (input.hasMutations) {
  lines.push('  dashboard/actions.ts');
}`,
      },
      {
        label: 'Route metrics',
        note: 'Важно не только дерево файлов, но и то, сколько route-owned/server-owned surfaces реально появляется в проекте.',
        code: `const routeModuleCount = tree.filter(
  (line) => line.includes('dashboard') || line.includes('page.tsx') || line.includes('routes/')
).length;

const serverOwnedFiles = tree.filter(
  (line) => line.includes('actions') || line.includes('loader') || line.includes('data')
).length;`,
      },
    ],
  },
  data: {
    files: [
      {
        path: 'src/components/framework-labs/DataFlowLab.tsx',
        note: 'Сравнение того, кто владеет data loading, auth и server mutations в разных framework-подходах.',
      },
      {
        path: 'src/lib/framework-flow-model.ts',
        note: 'Чистая модель full-stack flow для read-heavy, mutation-heavy и mixed screens.',
      },
      {
        path: 'src/server/framework-runtime.ts',
        note: 'Учебный runtime report дополняет lab реальными server/client file surfaces.',
      },
    ],
    snippets: [
      {
        label: 'Flow ownership',
        note: 'Важна не только загрузка данных, а то, насколько framework вообще владеет экраном как full-stack единицей.',
        code: `const manualGlue =
  input.framework === 'vite-diy' ? 5 : input.framework === 'react-router-framework' ? 3 : 2;
const frameworkCoverage =
  input.framework === 'vite-diy' ? 1 : input.framework === 'react-router-framework' ? 4 : 5;`,
      },
      {
        label: 'Runtime surface',
        note: 'Когда маршрут mutation-heavy, runtime-report добавляет server action file рядом с экраном вместо отдельного “api-слоя где-то сбоку”.',
        code: `if (input.hasMutation) {
  serverFiles.push(
    input.framework === 'next-app-router'
      ? \`app/\${input.routeKind}/actions.ts\`
      : \`app/routes/\${input.routeKind}.action.ts\`,
  );
}`,
      },
    ],
  },
  rendering: {
    files: [
      {
        path: 'src/components/framework-labs/RenderingDirectionLab.tsx',
        note: 'Planner для SSR, streaming, partial prerendering и platform direction.',
      },
      {
        path: 'src/lib/rendering-family-model.ts',
        note: 'Модель связывает rendering strategy с SEO, personalization, latency и framework surface.',
      },
      {
        path: 'README.md',
        note: 'README отдельно фиксирует честную оговорку про educational model и различие между stable и emerging capabilities.',
      },
    ],
    snippets: [
      {
        label: 'Rendering plan',
        note: 'Урок выражает тему через план shell strategy, streaming и PPR-eligibility, а не через абстрактные определения режимов.',
        code: `const streamingHelpful =
  input.dataLatency !== 'low' || input.interactionDepth === 'high' || input.personalizedShell;
const pprEligible = input.longTailStatic && !input.personalizedShell;

const shellStrategy = input.personalizedShell
  ? 'Request-time shell'
  : input.longTailStatic
    ? 'Static shell'
    : 'Hybrid shell';`,
      },
      {
        label: 'Direction note',
        note: 'Отдельный слой модели напоминает, что resume/prerender family APIs — это направление платформы, а не автоматический production default.',
        code: `const directionNote =
  input.framework === 'next-app-router'
    ? 'Next.js сегодня ближе всего к production narrative вокруг partial prerendering.'
    : input.framework === 'react-router-framework'
      ? 'React Router движется в сторону route-aware SSR/prerendering.'
      : 'Resume/prerender family APIs — это направление платформы.';`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/framework-labs/FrameworkPlaybookLab.tsx',
        note: 'Интерактивный playbook выбора между Next.js, React Router framework mode и сохранением SPA-подхода.',
      },
      {
        path: 'src/lib/framework-playbook-model.ts',
        note: 'Чистая модель итоговой стратегии по свойствам продукта.',
      },
      {
        path: 'src/lib/framework-comparison-model.ts',
        note: 'Playbook опирается на те же framework assumptions, что и comparison lab.',
      },
    ],
    snippets: [
      {
        label: 'Next-first branch',
        note: 'Если нужен integrated full-stack surface и более зрелая PPR story, playbook отправляет продукт в Next.js.',
        code: `if (input.needsStablePprStory && input.needsIntegratedFullStack) {
  return {
    primaryStrategy: 'next-primary',
    title: 'Next.js — основной кандидат',
  };
}`,
      },
      {
        label: 'Stay-SPA branch',
        note: 'Framework-first migration не навязывается там, где продукт пока остаётся главным образом internal interactive UI.',
        code: `if (input.appMostlyInteractiveInternal && !input.needsIntegratedFullStack) {
  return {
    primaryStrategy: 'stay-spa-for-now',
    title: 'Пока достаточно SPA-подхода',
  };
}`,
      },
    ],
  },
};
