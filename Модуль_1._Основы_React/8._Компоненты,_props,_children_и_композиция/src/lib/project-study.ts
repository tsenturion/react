import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  functional: {
    files: [
      {
        path: 'src/components/composition/CourseCard.tsx',
        note: 'Реальный функциональный компонент этого проекта, полностью управляемый через props.',
      },
      {
        path: 'src/lib/component-props-model.ts',
        note: 'Чистая модель для подготовки разных наборов props и сравнения повторного использования.',
      },
      {
        path: 'src/pages/FunctionalComponentsPage.tsx',
        note: 'Лаборатория собирает несколько инстансов одного компонента с разными props.',
      },
    ],
    snippets: [
      {
        label: 'Functional component',
        note: 'Компонент читает props и возвращает JSX без скрытого доступа к внешнему состоянию.',
        code: [
          'export function CourseCard({ title, summary, statusLabel, children }: CourseCardProps) {',
          '  return (',
          '    <article>',
          '      <h3>{title}</h3>',
          '      <p>{summary}</p>',
          '      <span>{statusLabel}</span>',
          '      {children ? <div>{children}</div> : null}',
          '    </article>',
          '  );',
          '}',
        ].join('\n'),
      },
      {
        label: 'Props preparation',
        note: 'Данные для компонента готовятся до рендера, а не внутри него случайным образом.',
        code: [
          'export function buildCourseCardViewModel(courseId, controls) {',
          '  const course = getCourseById(courseId);',
          '  return {',
          '    title: course.title,',
          '    mentorLabel: controls.showMentor ? `Ментор: ${course.mentor}` : undefined,',
          '    highlighted: controls.highlighted,',
          '  };',
          '}',
        ].join('\n'),
      },
    ],
  },
  children: {
    files: [
      {
        path: 'src/components/composition/SlotFrame.tsx',
        note: 'Контейнер со slot-based API: основной контент приходит через `children`, дополнительные части через `aside` и `footer`.',
      },
      {
        path: 'src/lib/children-slot-model.ts',
        note: 'Модель children-сценариев и генерация текущего примера использования.',
      },
      {
        path: 'src/pages/ChildrenCompositionPage.tsx',
        note: 'Страница переключает разные варианты `children` без изменения API контейнера.',
      },
    ],
    snippets: [
      {
        label: 'SlotFrame',
        note: 'Компонент задаёт только каркас, а содержимое приходит извне.',
        code: [
          'export function SlotFrame({ title, children, aside, footer }: SlotFrameProps) {',
          '  return (',
          '    <section>',
          '      <header>{title}</header>',
          '      <div>{children}</div>',
          '      {footer ? <footer>{footer}</footer> : null}',
          '    </section>',
          '  );',
          '}',
        ].join('\n'),
      },
      {
        label: 'Children scenario',
        note: 'Одна модель даёт разный внутренний контент без переписывания контейнера.',
        code: [
          'return {',
          "  title: 'Чеклист',",
          '  childCount: 3,',
          "  snippet: '<SlotFrame>...</SlotFrame>',",
          '};',
        ].join('\n'),
      },
    ],
  },
  'props-flow': {
    files: [
      {
        path: 'src/components/composition/PropsFlowPreview.tsx',
        note: 'Рекурсивный preview показывает, какие props приходят в каждый уровень дерева.',
      },
      {
        path: 'src/lib/props-flow-model.ts',
        note: 'Чистая модель строит дерево и список компонентов, зависящих от последнего изменения.',
      },
      {
        path: 'src/pages/PropsFlowPage.tsx',
        note: 'Страница управляет верхним состоянием и показывает изменение поддеревьев.',
      },
    ],
    snippets: [
      {
        label: 'Flow report',
        note: 'Состояние верхнего уровня превращается в явную структуру дерева компонентов.',
        code: [
          'return {',
          '  affectedComponents: affectedByChange[lastChanged],',
          '  tree: {',
          '    name: "CurriculumWorkspace",',
          '    receivedProps: [`track: ${state.track}`, `density: ${state.density}`],',
          '  },',
          '};',
        ].join('\n'),
      },
      {
        label: 'Recursive preview',
        note: 'Компонент сам использует композицию и рекурсию, чтобы показать поток props.',
        code: [
          'function FlowBranch({ node, depth = 0 }) {',
          '  return (',
          '    <>',
          '      <article>{node.name}</article>',
          '      {node.children.map((child) => <FlowBranch key={...} node={child} depth={depth + 1} />)}',
          '    </>',
          '  );',
          '}',
        ].join('\n'),
      },
    ],
  },
  composition: {
    files: [
      {
        path: 'src/components/composition/ComposedDashboard.tsx',
        note: 'Экран собирается из `SlotFrame`, `CourseCard` и локальных подкомпонентов.',
      },
      {
        path: 'src/lib/composition-model.ts',
        note: 'Preset-ы композиции определяют структуру экрана через данные, а не через отдельные монолитные компоненты.',
      },
      {
        path: 'src/pages/CompositionReusePage.tsx',
        note: 'Лаборатория показывает, как один набор блоков собирает разные страницы.',
      },
    ],
    snippets: [
      {
        label: 'Composed dashboard',
        note: 'Композиция строится через вложение уже готовых компонентов.',
        code: [
          '<SlotFrame ...>',
          '  <StatsStrip labels={scenario.statLabels} />',
          '  <CourseCard ... />',
          '  <CourseCard ... />',
          '</SlotFrame>',
        ].join('\n'),
      },
      {
        label: 'Scenario model',
        note: 'Новый экран появляется как новый preset данных, а не как новый монолитный компонент.',
        code: [
          'return {',
          "  title: 'Академия компонентов',",
          "  courseIds: ['props-basics', 'children-slots'],",
          '  reusedComponentCount: 5,',
          '};',
        ].join('\n'),
      },
    ],
  },
  'api-design': {
    files: [
      {
        path: 'src/components/composition/BooleanSoupCallout.tsx',
        note: 'Намеренно проблемный API с множеством флагов.',
      },
      {
        path: 'src/components/composition/Callout.tsx',
        note: 'Более чистый компонент с явными `tone`, `density`, `align` и `border`.',
      },
      {
        path: 'src/lib/api-design-model.ts',
        note: 'Модель фиксирует конфликты boolean-soup API и собирает сравнение двух подходов.',
      },
    ],
    snippets: [
      {
        label: 'Boolean soup warning',
        note: 'Модель находит конфликты, когда несколько семантических флагов включены одновременно.',
        code: [
          'const tones = [isInfo ? "info" : null, isSuccess ? "success" : null].filter(Boolean);',
          'const badWarnings = [',
          '  tones.length > 1 ? "Несколько tone-флагов true одновременно." : null,',
          '].filter(Boolean);',
        ].join('\n'),
      },
      {
        label: 'Clean API',
        note: 'Один проп выражает смысловой вариант, остальные отвечают за presentation details.',
        code: [
          '<Callout',
          '  tone="warning"',
          '  density="compact"',
          '  align="start"',
          '  border="soft"',
          '/>',
        ].join('\n'),
      },
    ],
  },
  'anti-patterns': {
    files: [
      {
        path: 'src/components/composition/PropPitfallsSandbox.tsx',
        note: 'Здесь живут реальные sandboxes с зеркалированием props в state и с мутацией массива.',
      },
      {
        path: 'src/lib/anti-pattern-model.ts',
        note: 'Модель переводит состояние sandbox в короткие диагностические выводы.',
      },
      {
        path: 'src/pages/AntiPatternsPage.tsx',
        note: 'Страница связывает live sandbox, пояснения и code snippets.',
      },
    ],
    snippets: [
      {
        label: 'Broken mirror',
        note: 'Копирование props в локальный state выглядит безобидно, но создаёт вторую версию данных.',
        code: [
          'function BrokenMirrorField({ title }) {',
          '  const [draft, setDraft] = useState(title);',
          '  return <input value={draft} onChange={(e) => setDraft(e.target.value)} />;',
          '}',
        ].join('\n'),
      },
      {
        label: 'Mutation',
        note: 'Мутация данных приводит к изменению состояния вне нормального потока `setState`.',
        code: [
          'function MutatingTagsBad({ tags, onPing }) {',
          '  return <button onClick={() => { tags.push("mutated"); onPing(); }} />;',
          '}',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
