export type Department = 'outerwear' | 'footwear' | 'equipment';

export type ProductVariant = {
  id: string;
  color: string;
  size: string;
  inventory: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  department: Department;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  story: string;
  features: readonly string[];
  materials: readonly string[];
  badge?: string;
  heroTone: 'sand' | 'mist' | 'forest';
  recommendationSlugs: readonly string[];
  variants: readonly ProductVariant[];
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  routeHint: string;
  featuredSlugs: readonly string[];
};

export const departmentLabels: Record<Department, string> = {
  outerwear: 'Верхняя одежда',
  footwear: 'Обувь',
  equipment: 'Снаряжение',
};

export const products: readonly Product[] = [
  {
    id: 'p1',
    slug: 'aurora-shell-jacket',
    title: 'Штормовая куртка Aurora',
    subtitle: 'Трёхслойная мембранная куртка для холодного дождя и городского ветра.',
    department: 'outerwear',
    price: 23990,
    compareAtPrice: 28990,
    rating: 4.9,
    reviewCount: 184,
    description:
      'Водозащитная куртка для маршрутов между городом и горами. Достаточно лёгкая для многослойности и достаточно надёжная для межсезонья.',
    story:
      'Создана для людей, которые в один день перемещаются между метро, работой и продуваемыми хребтами, не меняя экипировку.',
    features: [
      'Трёхслойная мембрана с герметизацией швов',
      'Капюшон совместим с каской',
      'Ветрозащитная планка на магнитной фиксации',
      'Упаковывается во внутренний карман',
    ],
    materials: [
      'Переработанный нейлон ripstop',
      'Водоотталкивающая пропитка без PFC',
      'Трикотажная микросетка',
    ],
    badge: 'Хит продаж',
    heroTone: 'mist',
    recommendationSlugs: [
      'ridge-expedition-boot',
      'signal-climbing-pack',
      'summit-insulated-vest',
    ],
    variants: [
      { id: 'p1-slate-s', color: 'Графит', size: 'S', inventory: 5 },
      { id: 'p1-slate-m', color: 'Графит', size: 'M', inventory: 9 },
      { id: 'p1-ember-l', color: 'Терракота', size: 'L', inventory: 4 },
    ],
  },
  {
    id: 'p2',
    slug: 'polar-transit-parka',
    title: 'Парка Polar Transit',
    subtitle: 'Утеплённая парка для городских маршрутов ниже нуля.',
    department: 'outerwear',
    price: 28990,
    compareAtPrice: 33990,
    rating: 4.8,
    reviewCount: 126,
    description:
      'Удлинённая парка с зональным утеплением, защитой от ветра и чистым силуэтом для зимних поездок по городу.',
    story:
      'Сделана для сценария "станция, улица, офис", где одинаково важны тепло, подвижность и собранный внешний вид.',
    features: [
      'Зональное синтетическое утепление',
      'Карман с флисовой подкладкой',
      'Двусторонняя молния',
      'Светоотражающие детали на манжетах',
    ],
    materials: [
      'Переработанная лицевая ткань',
      'Утеплитель Thermofill',
      'Мягкая подкладка с начёсом',
    ],
    badge: 'Зимняя коллекция',
    heroTone: 'forest',
    recommendationSlugs: [
      'drift-trail-sneaker',
      'northline-day-pack',
      'summit-stove-kit',
    ],
    variants: [
      { id: 'p2-black-m', color: 'Чёрный', size: 'M', inventory: 7 },
      { id: 'p2-black-l', color: 'Чёрный', size: 'L', inventory: 6 },
      { id: 'p2-olive-xl', color: 'Олива', size: 'XL', inventory: 3 },
    ],
  },
  {
    id: 'p3',
    slug: 'summit-insulated-vest',
    title: 'Утеплённый жилет Summit',
    subtitle: 'Лёгкий утепляющий слой для прохладного межсезонья.',
    department: 'outerwear',
    price: 14990,
    compareAtPrice: 17990,
    rating: 4.7,
    reviewCount: 88,
    description:
      'Компактный утеплённый жилет, который легко надевается под мембрану и при этом хорошо смотрится как верхний слой.',
    story:
      'Подходит для переменчивой погоды, коротких поездок и ситуации "для куртки жарко, для футболки холодно".',
    features: [
      'Компактный утеплённый корпус',
      'Эластичные боковые панели',
      'Два скрытых кармана на молнии',
    ],
    materials: [
      'Переработанная внешняя ткань',
      'Компактный утеплитель',
      'Эластичная сетка',
    ],
    heroTone: 'sand',
    recommendationSlugs: [
      'aurora-shell-jacket',
      'granite-approach-shoe',
      'northline-day-pack',
    ],
    variants: [
      { id: 'p3-sand-s', color: 'Песочный', size: 'S', inventory: 8 },
      { id: 'p3-sand-m', color: 'Песочный', size: 'M', inventory: 12 },
      { id: 'p3-charcoal-l', color: 'Графит', size: 'L', inventory: 5 },
    ],
  },
  {
    id: 'p4',
    slug: 'ridge-expedition-boot',
    title: 'Ботинки Ridge Expedition',
    subtitle: 'Поддерживающие ботинки с зимним сцеплением.',
    department: 'footwear',
    price: 21990,
    compareAtPrice: 25990,
    rating: 4.9,
    reviewCount: 143,
    description:
      'Ботинки для холодной погоды со стабильной поддержкой, влагозащитой и цепкой подошвой для мокрого камня и обледеневшего асфальта.',
    story:
      'Для тех, кто считает город базовым лагерем и хочет одну надёжную пару на все сценарии.',
    features: [
      'Влагозащитный внутренний чулок',
      'Подошва Vibram для холодного покрытия',
      'Фиксирующая шнуровка пятки',
      'Утеплённый воротник',
    ],
    materials: [
      'Натуральная кожа full-grain',
      'Износостойкий рант',
      'Подошва двойной плотности',
    ],
    heroTone: 'forest',
    recommendationSlugs: [
      'aurora-shell-jacket',
      'signal-climbing-pack',
      'summit-stove-kit',
    ],
    variants: [
      { id: 'p4-brown-42', color: 'Коричневый', size: '42', inventory: 6 },
      { id: 'p4-brown-43', color: 'Коричневый', size: '43', inventory: 10 },
      { id: 'p4-black-44', color: 'Чёрный', size: '44', inventory: 4 },
    ],
  },
  {
    id: 'p5',
    slug: 'drift-trail-sneaker',
    title: 'Кроссовки Drift Trail',
    subtitle: 'Гибридные кроссовки для города и лёгких маршрутов.',
    department: 'footwear',
    price: 13490,
    compareAtPrice: 15990,
    rating: 4.6,
    reviewCount: 94,
    description:
      'Низкие кроссовки с трейловой геометрией подошвы и лёгкой амортизацией для длинных городских дней.',
    story:
      'Созданы для тех, кому нужна одна пара на пешие маршруты по городу, короткие выезды и поездки.',
    features: [
      'Быстросохнущий тканый верх',
      'Подмётка с трейловым рисунком',
      'Подошва из EVA с компрессией',
    ],
    materials: ['Инженерная сетка', 'Переработанная стропа пятки', 'Амортизирующая EVA'],
    heroTone: 'mist',
    recommendationSlugs: [
      'polar-transit-parka',
      'northline-day-pack',
      'summit-insulated-vest',
    ],
    variants: [
      { id: 'p5-stone-41', color: 'Каменный', size: '41', inventory: 9 },
      { id: 'p5-stone-42', color: 'Каменный', size: '42', inventory: 8 },
      { id: 'p5-navy-43', color: 'Тёмно-синий', size: '43', inventory: 4 },
    ],
  },
  {
    id: 'p6',
    slug: 'granite-approach-shoe',
    title: 'Подходные кроссовки Granite',
    subtitle: 'Подходная обувь с акцентом на сцепление для смешанного рельефа.',
    department: 'footwear',
    price: 14490,
    compareAtPrice: 17490,
    rating: 4.8,
    reviewCount: 67,
    description:
      'Достаточно жёсткие для технического рельефа и достаточно гибкие для длинного подхода и города после него.',
    story:
      'Техническая повседневная пара, которая стирает границу между скалами и обычным городским днём.',
    features: [
      'Липкая резина в носовой части',
      'Защитный бампер с рантом',
      'Малорастяжимая шнуровка',
    ],
    materials: [
      'Комбинация замши и сетки',
      'Резина climbing-класса',
      'Стабилизирующая пластина',
    ],
    heroTone: 'sand',
    recommendationSlugs: [
      'summit-insulated-vest',
      'signal-climbing-pack',
      'aurora-shell-jacket',
    ],
    variants: [
      { id: 'p6-ash-41', color: 'Пепельный', size: '41', inventory: 5 },
      { id: 'p6-ash-42', color: 'Пепельный', size: '42', inventory: 6 },
      { id: 'p6-oxide-43', color: 'Оксид', size: '43', inventory: 3 },
    ],
  },
  {
    id: 'p7',
    slug: 'signal-climbing-pack',
    title: 'Рюкзак Signal Climbing Pack',
    subtitle: '28-литровый рюкзак с верхним доступом и креплением под верёвку.',
    department: 'equipment',
    price: 17990,
    compareAtPrice: 20990,
    rating: 4.9,
    reviewCount: 58,
    description:
      'Функциональный рюкзак на день с быстрым верхним доступом, отделением для ноутбука и модульной навеской снаряжения.',
    story:
      'Для тех, кто за один день проходит маршрут "офис, зал, скалы" и не хочет менять сумки.',
    features: [
      'Полное раскрытие + верхний доступ',
      'Убираемая стропа под верёвку',
      'Мягкое отделение для ноутбука',
      'Вентилируемая спинка',
    ],
    materials: [
      'Переработанный нейлон 420D',
      'Спинка с пеной',
      'Алюминиевая направляющая',
    ],
    badge: 'Выбор редакции',
    heroTone: 'forest',
    recommendationSlugs: [
      'aurora-shell-jacket',
      'ridge-expedition-boot',
      'summit-stove-kit',
    ],
    variants: [
      { id: 'p7-pine-os', color: 'Хвоя', size: 'Единый', inventory: 11 },
      { id: 'p7-charcoal-os', color: 'Графит', size: 'Единый', inventory: 7 },
    ],
  },
  {
    id: 'p8',
    slug: 'northline-day-pack',
    title: 'Рюкзак Northline Day Pack',
    subtitle: 'Тонкий городской рюкзак с защищённым отсеком для ноутбука.',
    department: 'equipment',
    price: 11490,
    compareAtPrice: 13990,
    rating: 4.7,
    reviewCount: 102,
    description:
      'Лаконичный городской рюкзак с защитным клапаном, быстрыми карманами и удобной организацией под каждый день.',
    story:
      'Подходит для гибридной работы и коротких поездок, когда организация важнее экспедиционного объёма.',
    features: [
      'Влагозащитная конструкция молний',
      'Подвесной отсек для ноутбука',
      'Передний органайзер',
    ],
    materials: [
      'Переработанная ткань корпуса',
      'Лямки из spacer-сетки',
      'Молнии с PU-покрытием',
    ],
    heroTone: 'mist',
    recommendationSlugs: [
      'polar-transit-parka',
      'drift-trail-sneaker',
      'summit-insulated-vest',
    ],
    variants: [
      { id: 'p8-fog-os', color: 'Туман', size: 'Единый', inventory: 14 },
      { id: 'p8-black-os', color: 'Чёрный', size: 'Единый', inventory: 9 },
    ],
  },
  {
    id: 'p9',
    slug: 'summit-stove-kit',
    title: 'Горелка Summit Stove Kit',
    subtitle: 'Компактный набор для готовки на ранних выходах и коротких стоянках.',
    department: 'equipment',
    price: 8290,
    compareAtPrice: 9790,
    rating: 4.5,
    reviewCount: 46,
    description:
      'Система с быстрой горелкой, вложенной кастрюлей и складной конструкцией для двух человек на коротких маршрутах.',
    story:
      'Создана для коротких выездов, когда скорость развёртывания важнее лагерной романтики.',
    features: [
      'Компактная система с баллонной горелкой',
      'Кастрюля 1.2 л из анодированного алюминия',
      'Пьезоподжиг',
    ],
    materials: ['Анодированный алюминий', 'Стальные лапки горелки', 'Термочехол'],
    heroTone: 'sand',
    recommendationSlugs: [
      'signal-climbing-pack',
      'ridge-expedition-boot',
      'aurora-shell-jacket',
    ],
    variants: [{ id: 'p9-sand-os', color: 'Песочный', size: 'Единый', inventory: 13 }],
  },
] as const;

export const collections: readonly Collection[] = [
  {
    slug: 'storm-front',
    title: 'Линия Storm Front',
    description:
      'Верхняя одежда и ботинки для резкой погоды, долгих маршрутов и переменчивого рельефа.',
    routeHint: '/catalog?department=outerwear',
    featuredSlugs: [
      'aurora-shell-jacket',
      'polar-transit-parka',
      'ridge-expedition-boot',
    ],
  },
  {
    slug: 'commuter-kit',
    title: 'Набор для города',
    description: 'Лёгкие рюкзаки, кроссовки и компактные утепляющие слои на каждый день.',
    routeHint: '/catalog?department=equipment',
    featuredSlugs: ['northline-day-pack', 'drift-trail-sneaker', 'summit-insulated-vest'],
  },
  {
    slug: 'weekend-ridge',
    title: 'Выходные в горах',
    description:
      'Техническое снаряжение для коротких выездов: подходная обувь, рюкзаки и компактная готовка.',
    routeHint: '/catalog?department=equipment',
    featuredSlugs: ['granite-approach-shoe', 'signal-climbing-pack', 'summit-stove-kit'],
  },
] as const;

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getProductsBySlugs(slugs: readonly string[]) {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => product !== null);
}

export function getRecommendedProducts(product: Product) {
  return getProductsBySlugs(product.recommendationSlugs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}
