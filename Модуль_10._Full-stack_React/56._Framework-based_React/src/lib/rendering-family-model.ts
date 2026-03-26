export type RenderingFrameworkId =
  | 'next-app-router'
  | 'react-router-framework'
  | 'platform-direction';

export function planRenderingStrategy(input: {
  framework: RenderingFrameworkId;
  seoCritical: boolean;
  personalizedShell: boolean;
  longTailStatic: boolean;
  dataLatency: 'low' | 'medium' | 'high';
  interactionDepth: 'low' | 'medium' | 'high';
}) {
  const streamingHelpful =
    input.dataLatency !== 'low' ||
    input.interactionDepth === 'high' ||
    input.personalizedShell;
  const pprEligible = input.longTailStatic && !input.personalizedShell;

  const shellStrategy = input.personalizedShell
    ? 'Request-time shell'
    : input.longTailStatic
      ? 'Static shell'
      : 'Hybrid shell';

  const directionNote =
    input.framework === 'next-app-router'
      ? 'Next.js сегодня ближе всего к production narrative вокруг partial prerendering и segment-level rendering.'
      : input.framework === 'react-router-framework'
        ? 'React Router framework mode движется в сторону route-aware SSR/prerendering, но story более framework-agnostic и менее tightly packaged.'
        : 'Resume/prerender family APIs — это направление платформы. Их стоит понимать, но нельзя автоматически считать stable default для каждого production проекта.';

  const phases = [
    `Shell strategy: ${shellStrategy}`,
    streamingHelpful
      ? 'Streaming полезен: можно не ждать весь экран целиком перед первым meaningful paint.'
      : 'Streaming не критичен: экран можно отдать более цельным блоком.',
    pprEligible
      ? 'Маршрут хорошо подходит для partial prerendering: статическая оболочка + поздние dynamic slots.'
      : 'Маршрут хуже подходит для PPR: персонализация или сильно dynamic shell снижают выигрыш.',
    input.seoCritical
      ? 'SEO делает server rendering и prerender decisions архитектурно важными.'
      : 'SEO не главный драйвер, но rendering strategy всё равно влияет на perceived performance.',
  ];

  return {
    shellStrategy,
    streamingHelpful,
    pprEligible,
    directionNote,
    phases,
  };
}
