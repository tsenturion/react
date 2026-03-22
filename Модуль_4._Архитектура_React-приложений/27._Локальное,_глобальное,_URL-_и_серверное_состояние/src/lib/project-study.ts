import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, StudyEntry> = {
  local: {
    files: [
      {
        path: 'src/components/state-architecture/LocalStateLab.tsx',
        note: 'Здесь видно, как локальный draft живёт рядом с карточкой и как режим lifted ломает изоляцию.',
      },
      {
        path: 'src/lib/state-domain.ts',
        note: 'Набор карточек и предметные данные для local state сценария лежат отдельно от UI.',
      },
      {
        path: 'src/pages/LocalStatePage.tsx',
        note: 'Страница связывает интерактивный sandbox, метрики и учебные комментарии.',
      },
    ],
    snippets: [
      {
        label: 'Local draft inside card',
        note: 'Каждая карточка держит свой собственный `useState`. В режиме `lifted` тот же текст начинает использовать общий draft и демонстрирует, как лишний подъём состояния связывает независимые блоки.',
        code: String.raw`const [localDraft, setLocalDraft] = useState('');
const draftValue = mode === 'local' ? localDraft : sharedDraft;
const updateDraft = mode === 'local' ? setLocalDraft : onSharedDraftChange;`,
      },
      {
        label: 'Why local state leaks upward',
        note: 'Этот код подчёркивает причинно-следственную связь: у карточек одинаковый sharedDraft, поэтому они перестают быть независимыми и начинают вести себя как одна форма.',
        code: String.raw`const [mode, setMode] = useState<'local' | 'lifted'>('local');
const [sharedDraft, setSharedDraft] = useState('');

<DraftCard
  mode={mode}
  sharedDraft={sharedDraft}
  onSharedDraftChange={setSharedDraft}
/>`,
      },
    ],
  },
  global: {
    files: [
      {
        path: 'src/state/ArchitecturePreferencesContext.tsx',
        note: 'Context-store для общих preferences показывает минимальный global state без внешней библиотеки.',
      },
      {
        path: 'src/components/state-architecture/GlobalStateLab.tsx',
        note: 'Две далёкие ветки читают один и тот же store без prop drilling.',
      },
      {
        path: 'src/App.tsx',
        note: 'Те же глобальные настройки вынесены в общий shell урока, а не остаются только внутри лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'Shared preferences store',
        note: 'Global state здесь осознанно ограничен общими UI-настройками. Это хороший контраст к local draft из предыдущей лаборатории.',
        code: String.raw`const [density, setDensity] = useState<Density>('comfortable');
const [lens, setLens] = useState<ArchitectureLens>('tradeoffs');

const value = useMemo(
  () => ({ density, lens, setDensity, setLens }),
  [density, lens],
);`,
      },
      {
        label: 'Two remote branches, one source',
        note: 'Обе карточки читают одно и то же значение из context. Это и есть сигнал, что состояние действительно имеет смысл вынести выше.',
        code: String.raw`function GlobalMirrorCard() {
  const { density, lens } = useArchitecturePreferences();

  return (
    <>
      <span className="chip">Density: {density}</span>
      <span className="chip">Lens: {lens}</span>
    </>
  );
}`,
      },
    ],
  },
  url: {
    files: [
      {
        path: 'src/hooks/useQueryParamState.ts',
        note: 'Custom hook превращает query params в отдельный слой состояния с push/replace и подпиской на историю.',
      },
      {
        path: 'src/lib/url-state-model.ts',
        note: 'Чистые функции для чтения и записи query params тестируются отдельно от React UI.',
      },
      {
        path: 'src/components/state-architecture/UrlStateLab.tsx',
        note: 'Лаборатория связывает фильтр списка и address bar, чтобы URL state был виден вживую.',
      },
      {
        path: 'src/App.tsx',
        note: 'Даже выбор активной лаборатории урока живёт в URL через `lab`, поэтому shell проекта тоже отражает тему.',
      },
    ],
    snippets: [
      {
        label: 'URL state hook',
        note: 'Hook синхронно читает URL, слушает `popstate` и отдельно оповещает React после `pushState`, потому что браузер сам не посылает событие при программной записи истории.',
        code: String.raw`const [value, setValue] = useState<T>(() =>
  readQueryValue(window.location.search, key, fallback, allowedValues),
);

window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', nextUrl);
notifyUrlStateChange();`,
      },
      {
        label: 'Filter linked to address bar',
        note: 'Тот же фильтр одновременно влияет на UI и на строку запроса. Из-за этого back/forward и shared link воспроизводят тот же экран.',
        code: String.raw`const [track, setTrack] = useQueryParamState('track', 'all', tracks);
const [query, setQuery] = useQueryParamState<string>('q', '');
const filteredItems = filterServerItems(snapshot.items, track, query);`,
      },
    ],
  },
  server: {
    files: [
      {
        path: 'src/hooks/useServerPlaybookQuery.ts',
        note: 'Server cache вынесен на уровень модуля и не сбрасывается при каждом рендере отдельного компонента.',
      },
      {
        path: 'src/lib/server-state-model.ts',
        note: 'Pure layer для фильтрации и объяснения loading/error/success состояния.',
      },
      {
        path: 'public/data/state-architecture-playbook.json',
        note: 'Локальный dataset играет роль внешнего источника данных для server state сценариев.',
      },
      {
        path: 'src/components/state-architecture/ServerStateLab.tsx',
        note: 'Лаборатория разводит server data и локальную заметку по разным слоям ответственности.',
      },
    ],
    snippets: [
      {
        label: 'Module-level cache for server state',
        note: 'Данные и listeners живут вне компонента, потому что server state принадлежит не одному рендеру, а слою синхронизации с внешним источником.',
        code: String.raw`let snapshot: ServerSnapshot = initialSnapshot;
const listeners = new Set<Listener>();
let inFlightRequest: Promise<void> | null = null;`,
      },
      {
        label: 'UI reads loading/error/cache semantics',
        note: 'Компонент работает не просто с массивом, а со snapshot, у которого есть статус, ошибка, счётчик запросов и время последнего обновления.',
        code: String.raw`const { snapshot, refetch } = useServerPlaybookQuery();
const filteredItems = filterServerItems(snapshot.items, selectedTrack, '');
const summary = summarizeServerSnapshot(snapshot);`,
      },
    ],
  },
  advisor: {
    files: [
      {
        path: 'src/lib/placement-advisor-model.ts',
        note: 'Чистая функция принимает сигналы сценария и рекомендует слой состояния.',
      },
      {
        path: 'src/lib/state-domain.ts',
        note: 'Preset-сценарии помогают быстро переключать архитектурные кейсы.',
      },
      {
        path: 'src/components/state-architecture/PlacementAdvisorLab.tsx',
        note: 'Интерактивный советник использует pure model, а не зашивает рекомендации прямо в JSX.',
      },
    ],
    snippets: [
      {
        label: 'Placement recommendation rules',
        note: 'Сначала проверяется внешний источник истины, потом shareable link, затем shared branches. Такой порядок важен: он отражает архитектурный приоритет ролей, а не случайный набор if-ов.',
        code: String.raw`if (scenario.serverOwned || scenario.remoteFreshness) {
  return { primary: 'server', ... };
}

if (scenario.shareableLink) {
  return { primary: 'url', ... };
}

if (scenario.sharedAcrossTree || scenario.affectsManyBranches) {
  return { primary: 'global', ... };
}`,
      },
      {
        label: 'Pure model + interactive UI',
        note: 'Лаборатория не принимает решение сама. Она только редактирует сценарий и показывает результат чистой архитектурной функции.',
        code: String.raw`const [scenario, setScenario] = useState<PlacementScenario>({
  ...advisorPresets[0],
});
const recommendation = recommendStatePlacement(scenario);`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/components/state-architecture/IntegratedArchitectureLab.tsx',
        note: 'Один экран собирает local, global, URL и server state без смешивания обязанностей.',
      },
      {
        path: 'src/state/ArchitecturePreferencesContext.tsx',
        note: 'Global preferences используются и внутри лаборатории, и в общем shell урока.',
      },
      {
        path: 'src/hooks/useQueryParamState.ts',
        note: 'Track filter живёт в URL и влияет на то, какой набор данных получает экран.',
      },
      {
        path: 'src/hooks/useServerPlaybookQuery.ts',
        note: 'Server layer отвечает за загрузку и refetch, а не за локальные черновики панели.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Финальная страница связывает интерактивный экран, метрики и архитектурные выводы.',
      },
    ],
    snippets: [
      {
        label: 'All four state kinds in one screen',
        note: 'Этот фрагмент полезен как карта всего урока: один экран одновременно читает global prefs, URL filter, server snapshot и local UI state.',
        code: String.raw`const { density, lens } = useArchitecturePreferences();
const [track, setTrack] = useQueryParamState('archTrack', 'all', tracks);
const { snapshot, refetch } = useServerPlaybookQuery();
const [selectedId, setSelectedId] = useState('');
const [draftNote, setDraftNote] = useState('');
const [isDrawerOpen, setIsDrawerOpen] = useState(false);`,
      },
      {
        label: 'Architecture is visible in rendering',
        note: 'В одном JSX-дереве видно, какой кусок UI зависит от какого слоя. Это и есть главный architectural payoff: границы читаются прямо по компоненту.',
        code: String.raw`<MetricCard label="Global" value={density} ... />
<MetricCard label="URL" value={track} ... />
<MetricCard label="Server" value={snapshot.status} ... />
<MetricCard label="Local" value={draftNote.length > 0 ? 'draft' : 'empty'} ... />`,
      },
    ],
  },
};
