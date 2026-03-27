import type { StatusTone } from './learning-model';
import type { CostScenario } from './pattern-domain';

export function evaluatePatternCosts(scenario: CostScenario): {
  tone: StatusTone;
  headline: string;
  score: number;
  issues: string[];
  guidance: string[];
} {
  let score = scenario.wrapperLayers;
  const issues: string[] = [];
  const guidance: string[] = [];

  if (scenario.pattern === 'cloneElement + Children API') {
    score += 2;
    if (scenario.thirdPartyChildren) {
      score += 4;
      issues.push(
        'Паттерн зависит от того, что все children контролируются вами и лежат прямо под root.',
      );
    }
    if (scenario.implicitContract) {
      score += 3;
      issues.push('Consumer должен знать скрытые правила структуры children.');
    }
    guidance.push(
      'Если children не полностью под вашим контролем, переключайтесь на explicit slots или config arrays.',
    );
  }

  if (scenario.pattern === 'higher-order components') {
    score += 2;
    if (scenario.wrapperLayers >= 2) {
      score += 3;
      issues.push('Wrapper nesting усложняет поиск источника props и stack trace.');
    }
    if (scenario.typingPressure === 'high') {
      score += 2;
      issues.push('Сильная типизация делает HOC заметно дороже в поддержке.');
    }
    guidance.push('Для нового кода чаще проще использовать hooks и явную композицию.');
  }

  if (scenario.pattern === 'render props') {
    if (scenario.wrapperLayers >= 2) {
      score += 2;
      issues.push('Глубокие render functions делают JSX шумным и тяжёлым для чтения.');
    }
    if (scenario.teamDiscoverability === 'low') {
      score += 1;
      issues.push(
        'Неочевидный children-as-function API часто хуже обнаруживается по месту использования.',
      );
    }
    guidance.push(
      'Если нужна только логика, а не полная свобода рендера, лучше рассмотреть custom hook.',
    );
  }

  if (scenario.pattern === 'compound components') {
    if (scenario.implicitContract) {
      score += 2;
      issues.push(
        'Чем больше подкомпонентов, тем выше риск скрытых правил порядка и вложенности.',
      );
    }
    guidance.push(
      'Держите compound API компактным и используйте его только там, где части действительно принадлежат одной surface-модели.',
    );
  }

  if (scenario.pattern === 'custom hook + explicit slots') {
    if (scenario.wrapperLayers >= 3) {
      score += 1;
      issues.push(
        'Даже современная композиция начинает шуметь, если layout и props слишком раздроблены.',
      );
    }
    guidance.push(
      'Это хороший базовый выбор, если вам не нужен особый API-компонент поверх обычных props.',
    );
  }

  if (score <= 3) {
    return {
      tone: 'success',
      headline: 'Стоимость паттерна под контролем',
      score,
      issues,
      guidance,
    };
  }

  if (score <= 7) {
    return {
      tone: 'warn',
      headline: 'Паттерн уже требует дисциплины',
      score,
      issues,
      guidance,
    };
  }

  return {
    tone: 'error',
    headline: 'Паттерн начинает вредить архитектуре',
    score,
    issues,
    guidance,
  };
}
