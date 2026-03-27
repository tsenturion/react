export type OverviewFocus =
  | 'all'
  | 'state'
  | 'lifecycle'
  | 'refs'
  | 'rendering'
  | 'maintenance';

export type LegacyOverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  typicalFailure: string;
  modernLens: string;
  stillSeenWhere: string;
};

const overviewCards: readonly LegacyOverviewCard[] = [
  {
    id: 'instance-state',
    focus: 'state',
    title: 'State живёт в экземпляре класса',
    blurb:
      'В class components данные лежат в this.state, а обновления идут через очередь setState.',
    whyItMatters:
      'При чтении legacy-кода это сразу объясняет, почему одно и то же нажатие может дать разные результаты для object-form и updater-form setState.',
    typicalFailure:
      'Два подряд object-form вызова setState читают один и тот же snapshot и дают +1 вместо ожидаемого +2.',
    modernLens:
      'Современный эквивалент - понимать queued updates так же, как functional updater в hooks.',
    stillSeenWhere: 'Старые формы, admin dashboards и class-based container components.',
  },
  {
    id: 'lifecycle-thinking',
    focus: 'lifecycle',
    title: 'Побочные эффекты размечены lifecycle methods',
    blurb:
      'Mount, update и cleanup распределены по методам класса, а не по одной декларативной effect-секции.',
    whyItMatters:
      'Это помогает быстро локализовать подписки, синхронизацию и teardown при чтении чужого legacy React-кода.',
    typicalFailure:
      'componentDidUpdate запускает setState без guard и создаёт бесконечный цикл обновлений.',
    modernLens:
      'Сегодня ту же задачу обычно выражают через useEffect, но reasoning про фазу обновления остаётся тем же.',
    stillSeenWhere:
      'Старые data widgets, analytics panels и React Native коды на старой архитектуре.',
  },
  {
    id: 'imperative-refs',
    focus: 'refs',
    title: 'Refs были главным мостом к DOM',
    blurb:
      'createRef и instance fields дают imperative доступ к input, скроллу, фокусу и сторонним DOM-виджетам.',
    whyItMatters:
      'Такой код всё ещё встречается в старых редакторах, интеграциях с legacy libraries и uncontrolled forms.',
    typicalFailure:
      'Ref начинают использовать как хранилище бизнес-состояния, и UI тихо расходится с тем, что реально на экране.',
    modernLens:
      'useRef меняет форму API, но не смысл: ref остаётся escape hatch, а не заменой state.',
    stillSeenWhere:
      'Редакторы, старые masked inputs, chart wrappers и imperative integrations.',
  },
  {
    id: 'pure-component-lens',
    focus: 'rendering',
    title: 'PureComponent опирается на shallow compare',
    blurb:
      'PureComponent пропускает ререндер, пока верхнеуровневые props и state не меняют ссылку.',
    whyItMatters:
      'Это помогает читать старые оптимизации и сразу видеть, где мутация ломает ожидания компонента.',
    typicalFailure:
      'Объект мутируют по ссылке, Regular Component обновляется, а PureComponent остаётся со старым экраном.',
    modernLens:
      'Сегодня ту же проблему обсуждают через memo и compiler-friendly immutable updates.',
    stillSeenWhere:
      'Legacy list rows, таблицы и оптимизированные карточки в старых performance-sensitive экранах.',
  },
  {
    id: 'maintenance-boundaries',
    focus: 'maintenance',
    title: 'Error boundaries и migration playbooks',
    blurb:
      'Классы до сих пор нужны для обычных error boundaries и для чтения старого tree-level control flow.',
    whyItMatters:
      'Даже в современном React class-based boundary остаётся реальным API, а значит старый mental model ещё не исчез.',
    typicalFailure:
      'Команда пытается “быстро всё переписать” вместо локализации boundary, сравнения с hooks и постепенного переноса риска.',
    modernLens:
      'Лучше сначала понять границу ответственности legacy-кода, а уже потом решать, что нужно переписывать.',
    stillSeenWhere:
      'Старые shell-компоненты, маршруты с boundaries, HOC chains и enterprise migration layers.',
  },
] as const;

export const legacyVsHooksRows = [
  {
    legacy: 'constructor + this.state',
    modern: 'useState / useReducer',
    note: 'Обе модели описывают stateful UI, но class code привязывает данные к экземпляру.',
  },
  {
    legacy: 'componentDidMount / componentWillUnmount',
    modern: 'useEffect setup / cleanup',
    note: 'Современная форма компактнее, но смысл фаз жизненного цикла остаётся тем же.',
  },
  {
    legacy: 'createRef',
    modern: 'useRef',
    note: 'Ref по-прежнему нужен для DOM bridge, но не должен подменять state и props.',
  },
  {
    legacy: 'PureComponent',
    modern: 'memo / compiler / immutable architecture',
    note: 'Оптимизация работает только при стабильной и немутирующей структуре данных.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'state':
    case 'lifecycle':
    case 'refs':
    case 'rendering':
    case 'maintenance':
      return value;
    default:
      return 'all';
  }
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly LegacyOverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
