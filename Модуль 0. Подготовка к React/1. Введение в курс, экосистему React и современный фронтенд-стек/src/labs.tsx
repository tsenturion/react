import { DeliveryModesPage } from './pages/DeliveryModesPage';
import { EcosystemPage } from './pages/EcosystemPage';
import { PipelinePage } from './pages/PipelinePage';
import { ToolingPage } from './pages/ToolingPage';
import { WhyReactPage } from './pages/WhyReactPage';

export const labs = [
  {
    id: 'ecosystem',
    path: '/ecosystem',
    label: '1. Карта экосистемы',
    blurb: 'Браузер, DOM, Node.js, npm, Vite, React Router framework mode, Next.js.',
    component: EcosystemPage,
  },
  {
    id: 'why-react',
    path: '/why-react',
    label: '2. Зачем React',
    blurb: 'Императивный DOM-подход против компонентной модели.',
    component: WhyReactPage,
  },
  {
    id: 'pipeline',
    path: '/pipeline',
    label: '3. Pipeline',
    blurb: 'Путь от исходников и зависимостей до результата в браузере.',
    component: PipelinePage,
  },
  {
    id: 'delivery',
    path: '/delivery',
    label: '4. Подходы доставки',
    blurb: 'No-build, Vite SPA, React Router framework mode и Next.js.',
    component: DeliveryModesPage,
  },
  {
    id: 'tooling',
    path: '/tooling',
    label: '5. Tooling',
    blurb: 'Node.js, scripts, tests, Docker и типовые сбои среды.',
    component: ToolingPage,
  },
] as const;
