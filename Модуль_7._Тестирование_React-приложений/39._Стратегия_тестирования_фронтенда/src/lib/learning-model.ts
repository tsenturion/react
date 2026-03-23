export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'unit'
  | 'component'
  | 'integration'
  | 'e2e'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: '1. Test levels',
    blurb: 'Как разложить unit, component, integration и E2E по смысловым слоям.',
    href: '/testing-strategy-overview?focus=all',
  },
  {
    id: 'unit',
    label: '2. Unit strategy',
    blurb: 'Когда тестировать чистую логику и как не тащить в unit лишний UI-шум.',
    href: '/unit-strategy',
  },
  {
    id: 'component',
    label: '3. Component behavior',
    blurb: 'Behavior-first тестирование компонентов через реальные взаимодействия.',
    href: '/component-behavior',
  },
  {
    id: 'integration',
    label: '4. Integration workflow',
    blurb: 'Проверки сценариев, где важна связка состояний, компонентов и действий.',
    href: '/integration-workflow',
  },
  {
    id: 'e2e',
    label: '5. E2E journeys',
    blurb:
      'Когда браузерный пользовательский путь действительно нужен, а когда это overkill.',
    href: '/e2e-journeys',
  },
  {
    id: 'architecture',
    label: '6. Test architecture',
    blurb: 'Как стратегия тестирования меняется по мере роста приложения.',
    href: '/testing-architecture',
  },
] as const;
