import type { StatusTone } from './learning-model';

export type RenderTrigger =
  | 'local-state'
  | 'parent-state'
  | 'prop-change'
  | 'same-input';

export type RenderTreeNode = {
  id: string;
  label: string;
  reason: string;
  rerendered: boolean;
  outputChanged: boolean;
  children?: RenderTreeNode[];
};

export type RenderTriggerReport = {
  trigger: RenderTrigger;
  summary: string;
  affectedCount: number;
  changedOutputCount: number;
  tone: StatusTone;
  tree: RenderTreeNode;
  snippet: string;
};

function countTree(nodes: RenderTreeNode): { affected: number; changed: number } {
  const childCounts = (nodes.children ?? []).map(countTree);

  return {
    affected:
      (nodes.rerendered ? 1 : 0) + childCounts.reduce((sum, entry) => sum + entry.affected, 0),
    changed:
      (nodes.outputChanged ? 1 : 0) +
      childCounts.reduce((sum, entry) => sum + entry.changed, 0),
  };
}

export function buildRenderTriggerReport(
  trigger: RenderTrigger,
): RenderTriggerReport {
  const tree: RenderTreeNode =
    trigger === 'local-state'
      ? {
          id: 'app',
          label: 'AppShell',
          reason: 'Корневой компонент не менял своё state.',
          rerendered: false,
          outputChanged: false,
          children: [
            {
              id: 'toolbar',
              label: 'Toolbar',
              reason: 'Props не менялись.',
              rerendered: false,
              outputChanged: false,
            },
            {
              id: 'lesson-grid',
              label: 'LessonGrid',
              reason: 'Внутри LessonGrid изменилось локальное state.',
              rerendered: true,
              outputChanged: true,
              children: [
                {
                  id: 'lesson-row',
                  label: 'LessonRow',
                  reason: 'Потомки локального state-узла тоже получили новый render проход.',
                  rerendered: true,
                  outputChanged: true,
                },
              ],
            },
          ],
        }
      : trigger === 'parent-state'
        ? {
            id: 'app',
            label: 'AppShell',
            reason: 'State изменился в родителе, поэтому React снова вызывает весь поддеревом ниже.',
            rerendered: true,
            outputChanged: true,
            children: [
              {
                id: 'toolbar',
                label: 'Toolbar',
                reason: 'Toolbar был вызван снова, даже если визуально почти не изменился.',
                rerendered: true,
                outputChanged: false,
              },
              {
                id: 'lesson-grid',
                label: 'LessonGrid',
                reason: 'Поддерево тоже получает новый render cycle из-за родителя.',
                rerendered: true,
                outputChanged: true,
                children: [
                  {
                    id: 'lesson-row',
                    label: 'LessonRow',
                    reason: 'Карточки рендерятся заново как часть поддерева.',
                    rerendered: true,
                    outputChanged: false,
                  },
                ],
              },
            ],
          }
        : trigger === 'prop-change'
          ? {
              id: 'app',
              label: 'AppShell',
              reason: 'Родитель сформировал новые props для боковой панели.',
              rerendered: true,
              outputChanged: false,
              children: [
                {
                  id: 'toolbar',
                  label: 'Toolbar',
                  reason: 'Props остались прежними.',
                  rerendered: true,
                  outputChanged: false,
                },
                {
                  id: 'summary',
                  label: 'SummaryAside',
                  reason: 'Именно здесь пришёл новый prop, поэтому output меняется.',
                  rerendered: true,
                  outputChanged: true,
                },
              ],
            }
          : {
              id: 'app',
              label: 'AppShell',
              reason: 'React снова вызвал компоненты, но входные данные по сути остались прежними.',
              rerendered: true,
              outputChanged: false,
              children: [
                {
                  id: 'toolbar',
                  label: 'Toolbar',
                  reason: 'Компонент был вызван, но при чистом коде вернул тот же результат.',
                  rerendered: true,
                  outputChanged: false,
                },
                {
                  id: 'lesson-grid',
                  label: 'LessonGrid',
                  reason: 'При тех же props и state output должен остаться тем же.',
                  rerendered: true,
                  outputChanged: false,
                },
              ],
            };

  const counts = countTree(tree);

  return {
    trigger,
    summary:
      trigger === 'local-state'
        ? 'Изменение локального state не обязано поднимать новый render cycle выше компонента, где это state живёт.'
        : trigger === 'parent-state'
          ? 'Изменение state в родителе запускает новый render проход для всего его поддерева.'
          : trigger === 'prop-change'
            ? 'Новый prop делает компонент кандидатом на новый output даже без изменения его собственного state.'
            : 'Повторный вызов компонента сам по себе не проблема, если код внутри render чист и idempotent.',
    affectedCount: counts.affected,
    changedOutputCount: counts.changed,
    tone: trigger === 'same-input' ? 'warn' : 'success',
    tree,
    snippet: [
      'function AppShell() {',
      '  const [query, setQuery] = useState("");',
      '  const [tick, setTick] = useState(0);',
      '',
      '  return (',
      '    <>',
      '      <Toolbar query={query} />',
      '      <LessonGrid query={query} tick={tick} />',
      '    </>',
      '  );',
      '}',
    ].join('\n'),
  };
}
