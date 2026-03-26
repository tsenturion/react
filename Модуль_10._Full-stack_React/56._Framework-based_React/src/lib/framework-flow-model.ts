export type FlowFrameworkId = 'vite-diy' | 'react-router-framework' | 'next-app-router';
export type ScreenKind = 'read-heavy' | 'mutation-heavy' | 'mixed';

export function compareFrameworkFlows(input: {
  framework: FlowFrameworkId;
  screenKind: ScreenKind;
  needsAuth: boolean;
  seoCritical: boolean;
}) {
  const baseSteps =
    input.framework === 'next-app-router'
      ? [
          'Route segment собирает серверный рендеринг и данные в одном pipeline',
          'Client islands подключаются только там, где нужна интерактивность',
        ]
      : input.framework === 'react-router-framework'
        ? [
            'Route module владеет loader/action/error boundary',
            'Экран собирается вокруг URL и route-owned full-stack логики',
          ]
        : [
            'Компонент и вручную выбранные библиотеки собирают routing/data/rendering по частям',
            'Связующий код между экраном, API и SSR держится отдельно',
          ];

  const screenSteps =
    input.screenKind === 'read-heavy'
      ? ['Основной путь оптимизируется под server read и SSR-ready first render']
      : input.screenKind === 'mutation-heavy'
        ? [
            'Основной путь оптимизируется под form actions, mutations и серверную revalidation',
          ]
        : ['Экран сочетает server reads, nested layouts и интерактивные client islands'];

  const authStep = input.needsAuth
    ? 'Auth, redirect и права доступа проверяются на route/framework surface'
    : 'Public route не требует дополнительной auth boundary';

  const seoStep = input.seoCritical
    ? 'SEO влияет на выбор SSR/prerendering и делает framework story особенно важной'
    : 'SEO не доминирует, но routing/data surfaces всё равно ценны';

  const manualGlue =
    input.framework === 'vite-diy'
      ? 5
      : input.framework === 'react-router-framework'
        ? 3
        : 2;
  const frameworkCoverage =
    input.framework === 'vite-diy'
      ? 1
      : input.framework === 'react-router-framework'
        ? 4
        : 5;
  const routeOwnership =
    input.framework === 'vite-diy'
      ? 'Низкое'
      : input.framework === 'react-router-framework'
        ? 'Высокое'
        : 'Очень высокое';

  return {
    framework: input.framework,
    headline:
      input.framework === 'next-app-router'
        ? 'Framework собирает full-stack экран вокруг segment tree'
        : input.framework === 'react-router-framework'
          ? 'Framework собирает full-stack экран вокруг route module'
          : 'Команда сама склеивает экран из routing, data и rendering слоёв',
    manualGlue,
    frameworkCoverage,
    routeOwnership,
    steps: [...baseSteps, ...screenSteps, authStep, seoStep],
  };
}
