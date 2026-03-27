import type { StatusTone } from './learning-model';

export type PlacementScenario = {
  sharedAcrossTree: boolean;
  shareableLink: boolean;
  serverOwned: boolean;
  remoteFreshness: boolean;
  affectsManyBranches: boolean;
  ephemeralDraft: boolean;
};

export function recommendStatePlacement(scenario: PlacementScenario): {
  primary: 'local' | 'global' | 'url' | 'server' | 'hybrid';
  tone: StatusTone;
  summary: string;
  reasons: string[];
  risks: string[];
} {
  const reasons: string[] = [];

  if (scenario.serverOwned || scenario.remoteFreshness) {
    reasons.push('Источник истины находится вне браузера и требует загрузки/обновления.');
    if (scenario.shareableLink || scenario.ephemeralDraft) {
      return {
        primary: 'hybrid',
        tone: 'warn',
        summary:
          'Здесь нужен гибрид: серверный слой для данных и отдельный UI-слой для URL или локального черновика.',
        reasons,
        risks: [
          'Если смешать это с обычным global state, кэш, loading и refetch быстро перепутаются с UI-переключателями.',
        ],
      };
    }

    return {
      primary: 'server',
      tone: 'success',
      summary:
        'Это server state: данные приходят извне и должны жить в слое загрузки и кэша.',
      reasons,
      risks: [
        'Если держать такие данные как обычный local state, сложнее объяснять stale, refetch и loading.',
      ],
    };
  }

  if (scenario.shareableLink) {
    reasons.push('Состояние должно переживать reload и открываться по ссылке.');
    return {
      primary: 'url',
      tone: 'success',
      summary:
        'Это URL state: значение должно жить в адресной строке, а не исчезать после обновления страницы.',
      reasons,
      risks: [
        'Если оставить такое состояние только в local state, ссылка перестанет воспроизводить экран.',
      ],
    };
  }

  if (scenario.sharedAcrossTree || scenario.affectsManyBranches) {
    reasons.push('Состояние синхронизирует далёкие части дерева.');
    return {
      primary: 'global',
      tone: 'success',
      summary:
        'Это global state: данные нужны нескольким удалённым веткам и их неудобно протаскивать через props.',
      reasons,
      risks: [
        'Если поднять выше лишнее состояние, глобальный слой начнёт тащить в себя локальные мелочи и станет шумным.',
      ],
    };
  }

  if (scenario.ephemeralDraft) {
    reasons.push('Это временный черновик или раскрытие внутри одной ветки.');
  }

  return {
    primary: 'local',
    tone: 'success',
    summary:
      'Это local state: состояние нужно только одной ветке и не должно расползаться по приложению.',
    reasons,
    risks: [
      'Если вынести такую деталь в global state, независимые части UI начнут мешать друг другу.',
    ],
  };
}
