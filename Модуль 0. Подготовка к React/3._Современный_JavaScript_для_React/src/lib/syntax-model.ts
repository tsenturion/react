export type BindingMode = 'const' | 'let';
export type CaptionState = 'filled' | 'empty' | 'undefined' | 'null';

export type SyntaxPlaygroundInput = {
  bindingMode: BindingMode;
  captionState: CaptionState;
  includeMentor: boolean;
  city: string;
  extraTopics: string[];
};

export const syntaxExtraTopics = [
  'closures',
  'async/await',
  'immutability',
  'array methods',
] as const;

const captionStateMap: Record<CaptionState, string | null | undefined> = {
  filled: 'react-ready',
  empty: '',
  undefined: undefined,
  null: null,
};

export const buildSyntaxPlayground = ({
  bindingMode,
  captionState,
  includeMentor,
  city,
  extraTopics,
}: SyntaxPlaygroundInput) => {
  const course = {
    title: 'Modern JavaScript for React',
    meta: {
      city: city.trim() || 'Екатеринбург',
      mentor: includeMentor ? { name: 'Ирина', focus: 'React foundations' } : undefined,
      caption: captionStateMap[captionState],
    },
    topics: ['const/let', 'destructuring', 'spread/rest', ...extraTopics],
  };

  const {
    title,
    meta: { city: safeCity, mentor, caption },
    topics: [firstTopic, ...otherTopics],
  } = course;

  const safeMentor = mentor?.name ?? 'не назначен';
  const mergedTopics = [...course.topics, `binding:${bindingMode}`];
  const captionWithOr = caption || 'react-ready';
  const captionWithNullish = caption ?? 'react-ready';
  const bindingNote =
    bindingMode === 'const'
      ? '`const` подходит по умолчанию: ссылка не переопределяется, а вычисления остаются проще для чтения.'
      : '`let` нужен, когда значение действительно будет переназначаться в текущей области видимости.';

  const greeting = `${title} разворачивается из ${firstTopic} и ${otherTopics.length} дополнительных тем.`;
  const codePreview = `const course = {
  title: '${title}',
  meta: {
    city: '${safeCity}',
    mentor: ${includeMentor ? "{ name: 'Ирина' }" : 'undefined'},
    caption: ${caption === '' ? "''" : caption === null ? 'null' : caption === undefined ? 'undefined' : "'react-ready'"},
  },
  topics: ['const/let', 'destructuring', 'spread/rest'],
};

const {
  meta: { mentor, caption },
  topics: [firstTopic, ...otherTopics],
} = course;

const safeMentor = mentor?.name ?? 'не назначен';
const mergedTopics = [...course.topics, ...extraTopics];
const visibleCaption = caption ?? 'react-ready';`;

  return {
    greeting,
    safeCity,
    safeMentor,
    captionWithOr,
    captionWithNullish,
    bindingNote,
    mergedTopics,
    firstTopic,
    otherTopics,
    codePreview,
  };
};
