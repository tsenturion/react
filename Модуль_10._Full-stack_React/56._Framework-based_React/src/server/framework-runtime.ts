export type RuntimeFrameworkId = 'next-app-router' | 'react-router-framework';
export type RuntimeRouteKind = 'marketing' | 'dashboard' | 'editor';
export type RuntimeRenderIntent = 'ssr' | 'streaming' | 'partial-prerender';

// Это учебный runtime-report, а не настоящий framework server.
// Он нужен, чтобы тема урока жила не только в UI-карточках, но и в коде,
// который явно описывает server files, client files и render pipeline.
export function simulateFrameworkRequest(input: {
  framework: RuntimeFrameworkId;
  routeKind: RuntimeRouteKind;
  hasMutation: boolean;
  renderIntent: RuntimeRenderIntent;
}) {
  const serverFiles =
    input.framework === 'next-app-router'
      ? ['app/layout.tsx', `app/${input.routeKind}/page.tsx`]
      : ['app/root.tsx', `app/routes/${input.routeKind}.tsx`];
  const clientFiles =
    input.framework === 'next-app-router'
      ? [`components/${input.routeKind}/toolbar-client.tsx`]
      : [`components/${input.routeKind}/interactive-panel.tsx`];

  if (input.hasMutation) {
    serverFiles.push(
      input.framework === 'next-app-router'
        ? `app/${input.routeKind}/actions.ts`
        : `app/routes/${input.routeKind}.action.ts`,
    );
  }

  const steps = [
    input.framework === 'next-app-router'
      ? 'Framework собирает segment tree и server/client boundaries'
      : 'Framework собирает route module, loader/action и SSR surface',
    input.renderIntent === 'partial-prerender'
      ? 'Статическая оболочка и динамические сегменты планируются раздельно'
      : input.renderIntent === 'streaming'
        ? 'HTML и асинхронные части экрана идут потоково'
        : 'Экран рендерится как единый SSR-response',
    input.hasMutation
      ? 'Маршрут включает server mutation surface рядом с экраном'
      : 'Маршрут остаётся read-heavy и не требует server mutation surface',
  ];

  return {
    headline:
      input.framework === 'next-app-router'
        ? 'Запрос проходит через framework-owned segment pipeline'
        : 'Запрос проходит через framework-owned route module pipeline',
    serverFiles,
    clientFiles,
    steps,
    bundlePressure: clientFiles.length * 18,
  };
}
