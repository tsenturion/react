import type { StatusTone } from './common';

export type StarterStructureId =
  | 'recommended'
  | 'main-heavy'
  | 'html-driven'
  | 'app-overloaded';

export const starterStructures = [
  {
    id: 'recommended',
    label: 'Рекомендуемый старт',
    description:
      '`index.html` даёт контейнер, `main.tsx` создаёт root, `App.tsx` описывает UI.',
  },
  {
    id: 'main-heavy',
    label: 'Слишком много в main.tsx',
    description:
      'Входной модуль начинает держать UI-логику, эффекты и лишние детали экрана.',
  },
  {
    id: 'html-driven',
    label: 'Слишком много в index.html',
    description:
      'HTML пытается заранее содержать приложение, вместо того чтобы дать React root-контейнер.',
  },
  {
    id: 'app-overloaded',
    label: 'Всё в App.tsx',
    description:
      'Корневой компонент становится единственным местом и для shell, и для всей feature-логики.',
  },
] as const satisfies readonly {
  id: StarterStructureId;
  label: string;
  description: string;
}[];

export function analyzeStarterStructure(presetId: StarterStructureId) {
  const preset =
    starterStructures.find((item) => item.id === presetId) ?? starterStructures[0];

  const scenarios = {
    recommended: {
      tone: 'success',
      fileRoles: [
        '`index.html`: только HTML-shell и mount-container.',
        '`src/main.tsx`: поиск контейнера, `createRoot(...)` и `root.render(...)`.',
        '`src/App.tsx`: вход в дерево компонентов приложения.',
        '`src/components/*`: переиспользуемые части, которые не перегружают root entry.',
      ],
      clarity: 'Высокая',
      scalability: 'Высокая',
      risks: [
        'Даже хороший стартовый каркас со временем нужно пересматривать по мере роста фич.',
      ],
    },
    'main-heavy': {
      tone: 'warn',
      fileRoles: [
        '`index.html`: контейнер остаётся корректным.',
        '`src/main.tsx`: кроме `createRoot(...)` начинает содержать UI-логику и side effects.',
        '`src/App.tsx`: становится тонкой обёрткой или вовсе теряет смысл.',
      ],
      clarity: 'Средняя',
      scalability: 'Низкая',
      risks: [
        'Входной модуль перестаёт быть прозрачной точкой подключения к DOM.',
        'Становится труднее понять, где заканчивается bootstrap и начинается интерфейс.',
      ],
    },
    'html-driven': {
      tone: 'error',
      fileRoles: [
        '`index.html`: пытается хранить приложение, хотя должен только давать shell и контейнер.',
        '`src/main.tsx`: остаётся вторичным и теряет роль ясной точки входа.',
      ],
      clarity: 'Низкая',
      scalability: 'Низкая',
      risks: [
        'Появляется соблазн поддерживать UI частично через HTML, частично через React.',
        'Граница между статическим shell и React-деревом размывается.',
      ],
    },
    'app-overloaded': {
      tone: 'warn',
      fileRoles: [
        '`index.html`: контейнер и shell.',
        '`src/main.tsx`: корректно создаёт root.',
        '`src/App.tsx`: превращается в монолит, где смешаны shell, routing-подобная логика и feature-детали.',
      ],
      clarity: 'Средняя',
      scalability: 'Средняя',
      risks: [
        'Root component становится слишком тяжёлым для чтения и развития.',
        'Bootstrap уже чистый, но компонентная архитектура стартует со слишком крупной границы.',
      ],
    },
  } as const;

  const selected = scenarios[preset.id];
  const tone = selected.tone as StatusTone;

  return {
    preset,
    tone,
    fileRoles: selected.fileRoles,
    clarity: selected.clarity,
    scalability: selected.scalability,
    risks: selected.risks,
    recommendedChain: [
      'index.html',
      'src/main.tsx',
      'createRoot(...)',
      'root.render(...)',
      'src/App.tsx',
    ],
    before:
      'Когда роли файлов смешаны, становится трудно увидеть, где приложение только входит в DOM, а где уже начинается само React-дерево.',
    after:
      'Хороший стартовый каркас держит bootstrap-путь прозрачным: HTML shell → main entry → React Root → App tree.',
  };
}
