export type OverviewFocus =
  | 'all'
  | 'schemas'
  | 'requests'
  | 'mutations'
  | 'routes'
  | 'maintenance';

type OverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  typicalFailure: string;
};

const overviewCards: readonly OverviewCard[] = [
  {
    id: 'schema-boundary',
    focus: 'schemas',
    title: 'TypeScript не валидирует то, что пришло извне',
    blurb:
      'Как только данные пришли по сети, из URL, `FormData` или server boundary, они для приложения остаются `unknown`.',
    whyItMatters:
      'Если вы делаете `payload as SomeType`, вы просто отключаете защиту именно в той точке, где она особенно нужна.',
    typicalFailure:
      'Каст скрывает проблему до тех пор, пока компонент не попытается прочитать поле не того типа или пропущенную ветку.',
  },
  {
    id: 'validated-requests',
    focus: 'requests',
    title: 'Запрос нужно проверять не только на network status, но и на форму данных',
    blurb:
      'Даже ответ `200 OK` не означает, что envelope, элементы массива и вложенные поля совпадают с контрактом.',
    whyItMatters:
      'Schema-aware request state разделяет network error, schema error, empty и ready branches гораздо честнее.',
    typicalFailure:
      'Экран считает ответ “успешным”, но падает позже в списке, потому что один вложенный элемент оказался с неправильным полем.',
  },
  {
    id: 'validated-mutations',
    focus: 'mutations',
    title: 'Форма и мутация ломаются не только на submit, но и на ответе сервера',
    blurb:
      'Нужно проверять и входящий payload из формы, и исходящий response contract после submit.',
    whyItMatters:
      'Именно в мутациях накапливаются тихие ошибки: строки вместо чисел, частичные ответы, сломанные даты и nullability drift.',
    typicalFailure:
      'Форма отправилась, optimistic UI показал успех, а ответ сервера вернул другую форму данных и сломал следующий экран.',
  },
  {
    id: 'route-contracts',
    focus: 'routes',
    title: 'Loader boundary выгоднее parse внутри leaf-компонента',
    blurb:
      'Чем раньше маршрут поймает schema mismatch, тем меньше вероятность, что сырой payload дойдёт до UI-дерева.',
    whyItMatters:
      'Route-level parse делает переход предсказуемым: либо данные валидны и идут дальше, либо маршрут блокируется на границе.',
    typicalFailure:
      'Компонент делает parse слишком поздно, часть экрана уже попыталась отрендериться, а затем упала из-за одного вложенного поля.',
  },
  {
    id: 'maintenance',
    focus: 'maintenance',
    title: 'Поддерживаемость растёт, когда schema shared, а не размазана по if-проверкам',
    blurb:
      'Один явный contract проще переиспользовать между клиентом, сервером, роутом и form helpers, чем десятки локальных проверок.',
    whyItMatters:
      'Схема становится документацией, runtime guard и источником inferred TypeScript типов одновременно.',
    typicalFailure:
      'Каждый слой проверяет payload по-своему, и при изменении API части приложения расходятся по разным допущениям.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'schemas':
    case 'requests':
    case 'mutations':
    case 'routes':
    case 'maintenance':
      return value;
    default:
      return 'all';
  }
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly OverviewCard[] {
  return focus === 'all'
    ? overviewCards
    : overviewCards.filter((card) => card.focus === focus);
}
