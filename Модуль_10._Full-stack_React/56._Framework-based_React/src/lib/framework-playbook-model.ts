export type FrameworkStrategy =
  | 'next-primary'
  | 'react-router-framework'
  | 'stay-spa-for-now'
  | 'watch-platform-direction';

export function chooseFrameworkStrategy(input: {
  needsIntegratedFullStack: boolean;
  wantsFileConventions: boolean;
  needsNestedDataRouters: boolean;
  teamValuesFlexibility: boolean;
  needsStablePprStory: boolean;
  appMostlyInteractiveInternal: boolean;
}) {
  if (input.needsStablePprStory && input.needsIntegratedFullStack) {
    return {
      primaryStrategy: 'next-primary' as const,
      title: 'Next.js — основной кандидат',
      why: 'Если важны integrated full-stack surface, server rendering pipeline и наиболее выраженная production story вокруг partial prerendering, Next.js даёт самый цельный набор встроенных решений.',
      antiPattern:
        'Не тяните Next.js только из-за бренда, если приложение по факту остаётся маленьким внутренним SPA без выраженных full-stack задач.',
      steps: [
        'Проектируйте маршрут как segment/layout tree, а не как набор отдельных страниц и fetch-хуков.',
        'Держите server/client boundaries узкими и осознанными.',
        'Связывайте rendering decisions с route structure, а не обсуждайте их изолированно.',
      ],
    };
  }

  if (
    input.needsIntegratedFullStack &&
    (input.needsNestedDataRouters || input.teamValuesFlexibility)
  ) {
    return {
      primaryStrategy: 'react-router-framework' as const,
      title: 'React Router framework mode даёт route-first full-stack архитектуру',
      why: 'Если нужен framework-oriented React вокруг route modules, loaders/actions и SSR, но важна более открытая и гибкая архитектурная поверхность, React Router — сильная альтернатива.',
      antiPattern:
        'Не рассматривайте framework mode как просто “тот же SPA плюс пара loaders”. Это другой архитектурный уровень.',
      steps: [
        'Стройте экран как route module с ownership для loader/action/error boundary.',
        'Не разносите full-stack логику обратно по случайным hooks и api helpers.',
        'Связывайте nested layouts с реальной структурой URL и экранов.',
      ],
    };
  }

  if (input.appMostlyInteractiveInternal && !input.needsIntegratedFullStack) {
    return {
      primaryStrategy: 'stay-spa-for-now' as const,
      title: 'Пока достаточно SPA-подхода',
      why: 'Если продукт в основном живёт как deeply interactive internal UI без выраженных SSR/SEO/full-stack требований, forcing framework-first migration может быть избыточным.',
      antiPattern:
        'Не стройте сложный framework-переезд раньше реальной потребности в route-level data/rendering/server ownership.',
      steps: [
        'Следите, не начинают ли routing, auth и data loading требовать framework surface.',
        'Не смешивайте временное SPA-решение с бессистемным ростом ручной инфраструктуры.',
        'Держите миграцию возможной, не связывая код слишком жёстко со случайными custom abstractions.',
      ],
    };
  }

  return {
    primaryStrategy: 'watch-platform-direction' as const,
    title: 'Следите за направлением платформы, но не стройте архитектуру на обещаниях',
    why: 'Resume/prerender family APIs и partial prerendering narrative важны, но выбирать production architecture нужно по тому, что реально стабильно и полезно для вашего продукта уже сейчас.',
    antiPattern:
      'Не превращайте roadmap платформы в обязательное основание для текущего production решения.',
    steps: [
      'Отделяйте stable framework capabilities от экспериментального направления.',
      'Смотрите, где продукту действительно нужен rendering sophistication.',
      'Мигрируйте по мере зрелости платформы и реальной ценности для приложения.',
    ],
  };
}
