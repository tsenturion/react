export type FrameworkId = 'vite-diy' | 'react-router-framework' | 'next-app-router';

export type FrameworkProfile = {
  id: FrameworkId;
  label: string;
  routingModel: string;
  dataLoading: string;
  serverSurface: string;
  renderingStory: string;
  conventionLevel: 'low' | 'medium' | 'high';
  incrementalAdoption: 'high' | 'medium' | 'low';
  pprDirection: 'none' | 'emerging' | 'strong';
  defaultInfraBurden: number;
  strongestFit: string;
  watchouts: string;
};

export const frameworkProfiles: Record<FrameworkId, FrameworkProfile> = {
  'vite-diy': {
    id: 'vite-diy',
    label: 'DIY SPA / Vite stack',
    routingModel: 'Библиотеки подбираются вручную.',
    dataLoading: 'Нет встроенного route-level data loading.',
    serverSurface: 'Нужно отдельно проектировать API, SSR и серверные мутации.',
    renderingStory: 'CSR по умолчанию; SSR требует отдельной инфраструктуры.',
    conventionLevel: 'low',
    incrementalAdoption: 'high',
    pprDirection: 'none',
    defaultInfraBurden: 5,
    strongestFit: 'Небольшой интерактивный продукт без выраженных full-stack требований.',
    watchouts:
      'При росте требований routing/data/rendering быстро превращаются в ручной конструктор.',
  },
  'react-router-framework': {
    id: 'react-router-framework',
    label: 'React Router framework mode',
    routingModel: 'Route modules и nested layouts вокруг URL и экранов.',
    dataLoading:
      'Loaders, actions, error boundaries и server rendering вокруг route modules.',
    serverSurface:
      'Framework-oriented full-stack flow без жёсткой привязки к одному deployment style.',
    renderingStory:
      'SSR/streaming/prerendering через framework pipeline и route-first модель.',
    conventionLevel: 'medium',
    incrementalAdoption: 'high',
    pprDirection: 'emerging',
    defaultInfraBurden: 3,
    strongestFit:
      'Приложение, где нужен route-first full-stack React без сильной зависимости от Next-specific модели.',
    watchouts:
      'Нужно принять route-module мышление; просто “добавить loaders” поверх старого SPA обычно недостаточно.',
  },
  'next-app-router': {
    id: 'next-app-router',
    label: 'Next.js App Router',
    routingModel:
      'Файловая структура вокруг layouts, segments и server/client boundaries.',
    dataLoading:
      'Server Components, server functions и rendering pipeline встроены в framework.',
    serverSurface: 'Максимально интегрированный full-stack React путь.',
    renderingStory:
      'SSR, streaming и partial prerendering как часть основного narrative framework.',
    conventionLevel: 'high',
    incrementalAdoption: 'medium',
    pprDirection: 'strong',
    defaultInfraBurden: 2,
    strongestFit:
      'Full-stack React продукт, где важны единая модель серверных/клиентских границ и готовый rendering pipeline.',
    watchouts:
      'Нужно принять более сильные conventions и framework-owned архитектурные решения.',
  },
};

export function compareFrameworkSuitability(input: {
  needsSsr: boolean;
  needsServerMutations: boolean;
  wantsFileRoutes: boolean;
  wantsStrongConventions: boolean;
  teamSize: number;
  caresAboutPprDirection: boolean;
  prefersIncrementalAdoption: boolean;
}) {
  const reports = (Object.keys(frameworkProfiles) as FrameworkId[]).map((id) => {
    const profile = frameworkProfiles[id];
    let score = 0;
    const reasons: string[] = [];
    const cautions: string[] = [profile.watchouts];

    if (input.needsSsr) {
      score += id === 'next-app-router' ? 3 : id === 'react-router-framework' ? 2 : 0;
      reasons.push(
        id === 'vite-diy'
          ? 'SSR придётся собирать вручную.'
          : 'SSR уже встроен в framework story.',
      );
    }

    if (input.needsServerMutations) {
      score += id === 'next-app-router' ? 3 : id === 'react-router-framework' ? 2 : 0;
      reasons.push(
        id === 'vite-diy'
          ? 'Серверные мутации потребуют ручного API-слоя.'
          : 'Server-side mutations встроены в framework-oriented поток.',
      );
    }

    if (input.wantsFileRoutes) {
      score += id === 'next-app-router' ? 2 : id === 'react-router-framework' ? 1 : 0;
      reasons.push(
        id === 'next-app-router'
          ? 'Файловые маршруты и layouts являются частью core-модели.'
          : id === 'react-router-framework'
            ? 'Route modules дают framework-oriented структуру вокруг экранов.'
            : 'Файловая маршрутизация не является частью стека по умолчанию.',
      );
    }

    if (input.wantsStrongConventions) {
      score +=
        profile.conventionLevel === 'high'
          ? 2
          : profile.conventionLevel === 'medium'
            ? 1
            : 0;
      reasons.push(
        profile.conventionLevel === 'high'
          ? 'Framework задаёт сильные архитектурные conventions.'
          : profile.conventionLevel === 'medium'
            ? 'Есть framework-directed структура без полной жёсткости.'
            : 'Большая часть решений останется на вас.',
      );
    } else if (profile.incrementalAdoption === 'high') {
      score += 1;
    }

    if (input.caresAboutPprDirection) {
      score +=
        profile.pprDirection === 'strong'
          ? 2
          : profile.pprDirection === 'emerging'
            ? 1
            : 0;
      reasons.push(
        profile.pprDirection === 'strong'
          ? 'Framework уже тесно связан с partial prerendering narrative.'
          : profile.pprDirection === 'emerging'
            ? 'Направление поддерживается, но история менее “из коробки”.'
            : 'PPR/resume direction придётся собирать вне framework surface.',
      );
    }

    if (input.prefersIncrementalAdoption) {
      score +=
        profile.incrementalAdoption === 'high'
          ? 2
          : profile.incrementalAdoption === 'medium'
            ? 1
            : 0;
      reasons.push(
        profile.incrementalAdoption === 'high'
          ? 'Хорошо подходит для постепенной эволюции существующего React codebase.'
          : 'Переход возможен, но потребует заметного архитектурного сдвига.',
      );
    }

    if (input.teamSize >= 6 && id !== 'vite-diy') {
      score += 1;
      reasons.push('Командный масштаб усиливает ценность общей framework surface.');
    }

    return {
      ...profile,
      score,
      reasons,
      cautions,
    };
  });

  return reports.sort((left, right) => right.score - left.score);
}
