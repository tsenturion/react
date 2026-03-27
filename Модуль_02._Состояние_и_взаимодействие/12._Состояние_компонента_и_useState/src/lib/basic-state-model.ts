import type { StatusTone } from './learning-model';

export type BasicCardState = {
  likes: number;
  bookmarked: boolean;
  expanded: boolean;
};

export type BasicStateReport = {
  tone: StatusTone;
  summary: string;
  reactionLabel: string;
  snippet: string;
};

export function buildBasicStateReport(state: BasicCardState): BasicStateReport {
  return {
    tone: state.bookmarked ? 'success' : 'warn',
    summary:
      'useState даёт компоненту локальную память между рендерами. Значения читаются в текущем рендере, а обновления переводят UI в следующее состояние после пользовательского действия.',
    reactionLabel:
      state.likes > 20
        ? 'Высокий интерес'
        : state.likes > 8
          ? 'Нормальная активность'
          : 'Нужно ещё взаимодействие',
    snippet: [
      'const [likes, setLikes] = useState(12);',
      'const [bookmarked, setBookmarked] = useState(false);',
      'const [expanded, setExpanded] = useState(true);',
    ].join('\n'),
  };
}
