export type RouteFrameworkId = 'next-app-router' | 'react-router-framework';
export type RouteScenarioId = 'marketing-plus-app' | 'docs-search' | 'commerce-dashboard';

type StructureInput = {
  framework: RouteFrameworkId;
  scenario: RouteScenarioId;
  hasProtectedArea: boolean;
  hasMutations: boolean;
  usesStreaming: boolean;
  coLocateData: boolean;
};

function buildNextTree(input: StructureInput) {
  const lines = [
    'app/',
    '  layout.tsx',
    input.scenario === 'marketing-plus-app' ? '  (marketing)/page.tsx' : '  page.tsx',
    input.hasProtectedArea ? '  (app)/dashboard/layout.tsx' : '  dashboard/layout.tsx',
    input.hasProtectedArea ? '  (app)/dashboard/page.tsx' : '  dashboard/page.tsx',
  ];

  if (input.coLocateData) {
    lines.push('  dashboard/data.ts');
  }

  if (input.hasMutations) {
    lines.push('  dashboard/actions.ts');
  }

  if (input.usesStreaming) {
    lines.push('  dashboard/loading.tsx');
  }

  lines.push('components/', '  dashboard/summary-card.tsx', '  dashboard/filter-bar.tsx');

  return lines;
}

function buildRouterTree(input: StructureInput) {
  const lines = ['app/', '  root.tsx', '  routes.ts'];

  if (input.scenario === 'marketing-plus-app') {
    lines.push('  routes/_marketing.tsx', '  routes/_marketing._index.tsx');
  }

  lines.push('  routes/dashboard.tsx');

  if (input.hasProtectedArea) {
    lines.push('  routes/dashboard._auth.tsx');
  }

  if (input.coLocateData) {
    lines.push('  routes/dashboard.loader.ts');
  }

  if (input.hasMutations) {
    lines.push('  routes/dashboard.action.ts');
  }

  if (input.usesStreaming) {
    lines.push('  routes/dashboard.boundary.tsx');
  }

  lines.push('components/', '  dashboard/summary-card.tsx', '  dashboard/filter-bar.tsx');

  return lines;
}

export function planRouteStructure(input: StructureInput) {
  const tree =
    input.framework === 'next-app-router' ? buildNextTree(input) : buildRouterTree(input);
  const routeModuleCount = tree.filter(
    (line) =>
      line.includes('dashboard') || line.includes('page.tsx') || line.includes('routes/'),
  ).length;
  const serverOwnedFiles = tree.filter(
    (line) =>
      line.includes('actions') ||
      line.includes('loader') ||
      line.includes('data') ||
      line.includes('page.tsx'),
  ).length;
  const layoutCount = tree.filter(
    (line) => line.includes('layout.tsx') || line.includes('root.tsx'),
  ).length;

  const headline =
    input.framework === 'next-app-router'
      ? 'Структура собирается вокруг app tree и segment layouts'
      : 'Структура собирается вокруг route modules и ownership маршрута';

  const notes = [
    input.framework === 'next-app-router'
      ? 'Следите, чтобы server/client boundaries были выражены прямо в segment tree.'
      : 'Следите, чтобы route module оставался owner для loader/action/error boundary.',
    input.hasMutations
      ? 'Мутации живут рядом с маршрутом, а не в отдельной “api-папке ради порядка”.'
      : 'Если мутаций нет, структура может оставаться read-heavy и проще для поддержки.',
    input.usesStreaming
      ? 'Streaming/async UX лучше виден, когда у сегмента есть собственный loading/error surface.'
      : 'Без streaming отдельные асинхронные surfaces можно держать минимальными.',
  ];

  return {
    headline,
    tree,
    notes,
    routeModuleCount,
    serverOwnedFiles,
    layoutCount,
  };
}
