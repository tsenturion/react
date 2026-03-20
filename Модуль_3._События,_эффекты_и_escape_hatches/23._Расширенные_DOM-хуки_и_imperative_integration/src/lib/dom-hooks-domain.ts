export type SyncMode = 'layout' | 'effect';
export type DensityMode = 'compact' | 'expanded';
export type InjectionMode = 'insertion' | 'effect';
export type StyleThemeId = 'signal' | 'ocean' | 'ember';
export type TrackVariant = 'compact' | 'wide';
export type WorkspacePresetId = 'audit' | 'launch' | 'stabilize';
export type WidgetThemeId = 'midnight' | 'paper';
export type WidgetDatasetId = 'latency' | 'adoption' | 'load';
export type DecisionScenarioId =
  | 'derived-filter'
  | 'focus-invalid'
  | 'position-popover'
  | 'inject-styles'
  | 'child-command'
  | 'widget-bridge';

export const styleThemes = [
  {
    id: 'signal',
    label: 'Signal',
    accent: '#0f766e',
    surface: '#ecfeff',
    card: '#ffffff',
    text: '#0f172a',
    border: '#5eead4',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    accent: '#2563eb',
    surface: '#eff6ff',
    card: '#ffffff',
    text: '#172554',
    border: '#93c5fd',
  },
  {
    id: 'ember',
    label: 'Ember',
    accent: '#c2410c',
    surface: '#fff7ed',
    card: '#ffffff',
    text: '#7c2d12',
    border: '#fdba74',
  },
] as const satisfies readonly {
  id: StyleThemeId;
  label: string;
  accent: string;
  surface: string;
  card: string;
  text: string;
  border: string;
}[];

export const trackItems = [
  {
    id: 'render',
    title: 'Render contract',
    blurb: 'React собрал новый JSX snapshot и ещё не измерял DOM.',
  },
  {
    id: 'anchor',
    title: 'Measured anchor',
    blurb: 'Popover или underline должен опереться на реальный DOM-узел.',
  },
  {
    id: 'paint',
    title: 'Paint-safe result',
    blurb:
      'Пользователь должен увидеть уже согласованное положение, а не промежуточный кадр.',
  },
] as const;

export const workspacePresets = [
  {
    id: 'audit',
    label: 'UI audit',
    summary: 'Проверка visual glitches и нестабильных измерений.',
  },
  {
    id: 'launch',
    label: 'Launch deck',
    summary: 'Фокус на командных действиях: открыть, найти, подготовить.',
  },
  {
    id: 'stabilize',
    label: 'Stabilize',
    summary: 'Набор команд для быстрого возвращения к исходному состоянию.',
  },
] as const satisfies readonly {
  id: WorkspacePresetId;
  label: string;
  summary: string;
}[];

export const widgetThemes = [
  {
    id: 'midnight',
    label: 'Midnight',
    panel: '#0f172a',
    text: '#e2e8f0',
    accent: '#38bdf8',
    border: '#1e293b',
  },
  {
    id: 'paper',
    label: 'Paper',
    panel: '#f8fafc',
    text: '#0f172a',
    accent: '#2563eb',
    border: '#cbd5e1',
  },
] as const satisfies readonly {
  id: WidgetThemeId;
  label: string;
  panel: string;
  text: string;
  accent: string;
  border: string;
}[];

export const widgetDatasets = [
  {
    id: 'latency',
    label: 'Latency',
    series: [42, 55, 38, 64],
    description: 'Следит за задержкой на критичных точках интерфейса.',
  },
  {
    id: 'adoption',
    label: 'Adoption',
    series: [18, 28, 44, 62],
    description: 'Показывает, как быстро команда забирает новый паттерн.',
  },
  {
    id: 'load',
    label: 'Load',
    series: [70, 58, 66, 49],
    description: 'Имитация нагрузки стороннего виджета при смене сценария.',
  },
] as const satisfies readonly {
  id: WidgetDatasetId;
  label: string;
  series: readonly number[];
  description: string;
}[];

export const decisionScenarios = [
  {
    id: 'derived-filter',
    title: 'Фильтрация каталога',
    prompt: 'Есть список и строка поиска. Нужно показать отфильтрованный набор.',
  },
  {
    id: 'focus-invalid',
    title: 'Фокус на ошибке',
    prompt: 'После submit нужно перевести focus на первое невалидное поле.',
  },
  {
    id: 'position-popover',
    title: 'Позиционирование overlay',
    prompt: 'Tooltip должен измериться и встать на место без промежуточного кадра.',
  },
  {
    id: 'inject-styles',
    title: 'Инъекция CSS',
    prompt: 'Библиотека должна подложить style tag до layout-эффектов.',
  },
  {
    id: 'child-command',
    title: 'Команда в дочерний компонент',
    prompt:
      'Нужно открыть child-panel и сфокусировать внутренний input по команде родителя.',
  },
  {
    id: 'widget-bridge',
    title: 'Сторонний виджет',
    prompt: 'Есть внешний imperative widget, который живёт в DOM-контейнере.',
  },
] as const satisfies readonly {
  id: DecisionScenarioId;
  title: string;
  prompt: string;
}[];

export function getStyleTheme(id: StyleThemeId) {
  return styleThemes.find((theme) => theme.id === id) ?? styleThemes[0];
}

export function getWidgetTheme(id: WidgetThemeId) {
  return widgetThemes.find((theme) => theme.id === id) ?? widgetThemes[0];
}

export function getWidgetDataset(id: WidgetDatasetId) {
  return widgetDatasets.find((dataset) => dataset.id === id) ?? widgetDatasets[0];
}

export type DemoWidgetSnapshot = {
  mounted: boolean;
  themeId: WidgetThemeId;
  datasetId: WidgetDatasetId;
  renderCount: number;
  seriesCount: number;
};

export function createDemoWidget() {
  let host: HTMLElement | null = null;
  let themeId: WidgetThemeId = widgetThemes[0].id;
  let datasetId: WidgetDatasetId = widgetDatasets[0].id;
  let renderCount = 0;
  let mounted = false;

  function renderWidget() {
    if (!host) {
      return;
    }

    const theme = getWidgetTheme(themeId);
    const dataset = getWidgetDataset(datasetId);
    renderCount += 1;

    host.replaceChildren();
    host.setAttribute('data-demo-widget', 'true');
    host.style.background = theme.panel;
    host.style.border = `1px solid ${theme.border}`;
    host.style.borderRadius = '24px';
    host.style.padding = '18px';
    host.style.color = theme.text;
    host.style.minHeight = '220px';

    const title = document.createElement('p');
    title.textContent = `Widget dataset: ${dataset.label}`;
    title.style.margin = '0';
    title.style.fontWeight = '700';
    title.style.fontSize = '15px';

    const description = document.createElement('p');
    description.textContent = dataset.description;
    description.style.margin = '8px 0 0';
    description.style.fontSize = '13px';
    description.style.lineHeight = '1.6';
    description.style.opacity = '0.82';

    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = `repeat(${dataset.series.length}, minmax(0, 1fr))`;
    row.style.gap = '12px';
    row.style.marginTop = '18px';

    dataset.series.forEach((point, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${point}`;
      button.tabIndex = 0;
      button.setAttribute('data-widget-bar', String(index));
      button.style.height = `${Math.max(52, point + 24)}px`;
      button.style.border = '0';
      button.style.borderRadius = '18px';
      button.style.background = theme.accent;
      button.style.color = theme.panel;
      button.style.fontWeight = '700';
      button.style.cursor = 'pointer';
      button.style.boxShadow = 'inset 0 -10px 20px rgba(15, 23, 42, 0.12)';
      row.append(button);
    });

    host.append(title, description, row);
  }

  return {
    mount(node: HTMLElement) {
      host = node;
      mounted = true;
      renderWidget();
    },
    setTheme(nextTheme: WidgetThemeId) {
      themeId = nextTheme;
      renderWidget();
    },
    setDataset(nextDataset: WidgetDatasetId) {
      datasetId = nextDataset;
      renderWidget();
    },
    focusPrimaryBar() {
      host?.querySelector<HTMLElement>('[data-widget-bar="0"]')?.focus();
    },
    snapshot(): DemoWidgetSnapshot {
      return {
        mounted,
        themeId,
        datasetId,
        renderCount,
        seriesCount: getWidgetDataset(datasetId).series.length,
      };
    },
    destroy() {
      if (host) {
        host.removeAttribute('data-demo-widget');
        host.replaceChildren();
      }

      host = null;
      mounted = false;
    },
  };
}
