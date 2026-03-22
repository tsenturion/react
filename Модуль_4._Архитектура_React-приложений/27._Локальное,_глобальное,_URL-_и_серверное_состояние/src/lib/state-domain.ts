export type Density = 'compact' | 'comfortable';
export type ArchitectureLens = 'tradeoffs' | 'debug';
export type PlacementKind = 'local' | 'global' | 'url' | 'server' | 'hybrid';
export type ServerItem = {
  id: string;
  title: string;
  track: 'UI' | 'Routing' | 'Data' | 'Infra';
  owner: string;
  syncCost: 'low' | 'medium' | 'high';
  summary: string;
};

export const localDraftCards = [
  {
    id: 'draft-a',
    title: 'Форма фильтра каталога',
    summary: 'Текстовый ввод и локальный чекбокс, нужные только этой карточке.',
  },
  {
    id: 'draft-b',
    title: 'Панель заметок ревью',
    summary: 'Незавершённый черновик, который не должен менять соседние блоки.',
  },
  {
    id: 'draft-c',
    title: 'Временный disclosure',
    summary: 'Открытие/закрытие подробностей только в пределах одной ветки.',
  },
] as const;

export const advisorPresets = [
  {
    id: 'search-query',
    title: 'Поиск по каталогу, который должен переживать reload и делиться ссылкой',
    sharedAcrossTree: false,
    shareableLink: true,
    serverOwned: false,
    remoteFreshness: false,
    affectsManyBranches: true,
    ephemeralDraft: false,
  },
  {
    id: 'editor-draft',
    title: 'Незавершённый черновик в одной карточке',
    sharedAcrossTree: false,
    shareableLink: false,
    serverOwned: false,
    remoteFreshness: false,
    affectsManyBranches: false,
    ephemeralDraft: true,
  },
  {
    id: 'pricing-feed',
    title: 'Лента данных, которая приходит с сервера и должна обновляться',
    sharedAcrossTree: true,
    shareableLink: false,
    serverOwned: true,
    remoteFreshness: true,
    affectsManyBranches: true,
    ephemeralDraft: false,
  },
  {
    id: 'workspace-density',
    title: 'Глобальная плотность интерфейса для нескольких далёких секций',
    sharedAcrossTree: true,
    shareableLink: false,
    serverOwned: false,
    remoteFreshness: false,
    affectsManyBranches: true,
    ephemeralDraft: false,
  },
] as const;
