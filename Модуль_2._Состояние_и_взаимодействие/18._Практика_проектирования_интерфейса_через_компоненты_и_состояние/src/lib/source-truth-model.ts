import type { StatusTone } from './learning-model';

export type SourcePreset = 'root-owned' | 'duplicated-selection' | 'local-draft';

export type SourceTruthReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  owners: readonly string[];
  symptoms: readonly string[];
  score: number;
  snippet: string;
};

export function buildSourceTruthReport(preset: SourcePreset): SourceTruthReport {
  if (preset === 'root-owned') {
    return {
      tone: 'success',
      title: 'Один источник истины на уровне экрана',
      summary:
        'query, activeTrack, selectedId и draftsById принадлежат одному owner state, поэтому list, summary и details смотрят на одни и те же данные.',
      owners: [
        'query → CourseWorkbench',
        'activeTrack → CourseWorkbench',
        'selectedId → CourseWorkbench',
        'draftsById → CourseWorkbench',
      ],
      symptoms: [
        'Список и details синхронны',
        'Draft сохраняется для каждой сущности по id',
        'Derived summary не расходится с фактическим UI',
      ],
      score: 100,
      snippet: [
        'const [query, setQuery] = useState("");',
        'const [activeTrack, setActiveTrack] = useState<TrackFilter>("all");',
        'const [selectedId, setSelectedId] = useState(initialId);',
        'const [draftsById, setDraftsById] = useState(createDraftMap);',
      ].join('\n'),
    };
  }

  if (preset === 'duplicated-selection') {
    return {
      tone: 'error',
      title: 'Selection продублирован в двух местах',
      summary:
        'Когда list и details хранят собственные selected value, экран может одновременно показывать два разных “текущих” урока.',
      owners: [
        'listSelection → LessonGrid local state',
        'detailsSelection → LessonDetails local state',
      ],
      symptoms: [
        'Подсветка списка не совпадает с details panel',
        'События выбора обновляют только часть экрана',
        'Причину рассинхрона трудно найти визуально',
      ],
      score: 42,
      snippet: [
        'const [gridSelectedId, setGridSelectedId] = useState("lesson-12");',
        'const [detailsSelectedId, setDetailsSelectedId] = useState("lesson-14");',
      ].join('\n'),
    };
  }

  return {
    tone: 'warn',
    title: 'Draft живёт только в details panel',
    summary:
      'Локальный draft в details удобен для быстрого старта, но он теряется при переключении выбранной сущности и не переживает пересборку панели.',
    owners: ['draft → LessonDetails local state'],
    symptoms: [
      'Черновик исчезает при смене урока',
      'Нельзя хранить отдельные заметки по id',
      'Reset выглядит как случайная потеря ввода',
    ],
    score: 63,
    snippet: [
      'function LessonDetails({ lesson }) {',
      '  const [draft, setDraft] = useState(lesson.seedDraft);',
      '}',
    ].join('\n'),
  };
}
