import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  mutable: {
    files: [
      {
        path: 'src/components/dom-refs/MutableRefLab.tsx',
        note: 'Здесь ref меняется без render, а DOM-узел статуса обновляется imperatively для наглядности.',
      },
      {
        path: 'src/lib/mutable-ref-model.ts',
        note: 'Модель формулирует разницу между ref, state и внешними handles.',
      },
      {
        path: 'src/pages/MutableRefPage.tsx',
        note: 'Страница связывает sandbox и code-level выводы по useRef.',
      },
    ],
    snippets: [
      {
        label: 'Mutable value in ref',
        note: 'Ref сохраняет значение между render-ами и не инициирует новый render сам по себе.',
        code: [
          'const draftRef = useRef(0);',
          '',
          'function handleRefWrite() {',
          '  draftRef.current += 1;',
          '}',
        ].join('\n'),
      },
      {
        label: 'Imperative status node',
        note: 'Этот DOM-узел обновляется вручную, чтобы было видно: ref уже изменился, а JSX ещё нет.',
        code: [
          'if (statusNodeRef.current) {',
          '  statusNodeRef.current.textContent =',
          '    `ref.current = ${draftRef.current}, JSX snapshot = ${visibleSnapshot}`;',
          '}',
        ].join('\n'),
      },
    ],
  },
  focus: {
    files: [
      {
        path: 'src/components/dom-refs/FocusLab.tsx',
        note: 'Лаборатория использует DOM refs для focus(), submit flow и восстановления последнего узла.',
      },
      {
        path: 'src/lib/focus-dom-model.ts',
        note: 'Здесь лежит pure validation-логика для выбора первого invalid field.',
      },
      {
        path: 'src/pages/FocusPage.tsx',
        note: 'Страница связывает реальный DOM focus и чистую модель ошибок формы.',
      },
    ],
    snippets: [
      {
        label: 'Focus specific field',
        note: 'Ручной focus делается ровно по событию и только через ref к нужному input.',
        code: [
          'const emailRef = useRef<HTMLInputElement | null>(null);',
          'emailRef.current?.focus();',
        ].join('\n'),
      },
      {
        label: 'Focus first invalid',
        note: 'После submit логика выбирает первый invalid field и переводит туда focus.',
        code: [
          'const firstInvalid = getFirstInvalidField(values);',
          'map[firstInvalid].current?.focus();',
        ].join('\n'),
      },
    ],
  },
  scroll: {
    files: [
      {
        path: 'src/components/dom-refs/ScrollLab.tsx',
        note: 'Лаборатория хранит map из id в DOM-узлы и скроллит к выбранной карточке.',
      },
      {
        path: 'src/lib/ref-domain.ts',
        note: 'Здесь находится массив карточек и общие типы scroll/focus/measurement для урока.',
      },
      {
        path: 'src/lib/scroll-model.ts',
        note: 'Модель фиксирует, почему element refs устойчивее глобального window scroll.',
      },
    ],
    snippets: [
      {
        label: 'Ref map for list items',
        note: 'Коллекция refs связывает данные списка и реальные DOM-узлы.',
        code: [
          'const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});',
          'itemRefs.current[id]?.scrollIntoView({ behavior, block });',
        ].join('\n'),
      },
      {
        label: 'Callback ref in list',
        note: 'Каждая карточка записывает свой DOM-узел в map текущего списка.',
        code: ['ref={(node) => {', '  itemRefs.current[card.id] = node;', '}}'].join(
          '\n',
        ),
      },
    ],
  },
  measure: {
    files: [
      {
        path: 'src/components/dom-refs/MeasureLab.tsx',
        note: 'Здесь ref используется вместе с getBoundingClientRect() и ResizeObserver.',
      },
      {
        path: 'src/lib/ref-domain.ts',
        note: 'В доменной библиотеке находится readBoxMetrics() для чтения реальных размеров DOM-узла.',
      },
      {
        path: 'src/lib/measure-model.ts',
        note: 'Модель объясняет разницу между guess и реальным measurement.',
      },
    ],
    snippets: [
      {
        label: 'Measure actual box',
        note: 'Чтение размеров происходит из реального DOM, а не из предположений о layout.',
        code: [
          'const rect = element.getBoundingClientRect();',
          'return {',
          '  clientWidth: element.clientWidth,',
          '  rectWidth: rect.width,',
          '};',
        ].join('\n'),
      },
      {
        label: 'Resize observer bridge',
        note: 'Observer обновляет state только когда браузер уже пересчитал layout.',
        code: [
          'const observer = new ResizeObserver(() => {',
          '  setMetrics(readBoxMetrics(node));',
          '});',
          'observer.observe(node);',
        ].join('\n'),
      },
    ],
  },
  timers: {
    files: [
      {
        path: 'src/components/dom-refs/TimersObjectsLab.tsx',
        note: 'Лаборатория хранит interval id и внешний mutable object в refs.',
      },
      {
        path: 'src/lib/timer-object-model.ts',
        note: 'Здесь лежат helper-ы для stopwatch formatting и кодовые выводы по handles.',
      },
      {
        path: 'src/lib/ref-domain.ts',
        note: 'В уроке есть собственный createDemoConsole() как внешний mutable object.',
      },
    ],
    snippets: [
      {
        label: 'Timer handle in ref',
        note: 'Interval id нужен для stop/cleanup, но не описывает интерфейс в JSX.',
        code: [
          'const intervalRef = useRef<number | null>(null);',
          'intervalRef.current = window.setInterval(tick, 200);',
        ].join('\n'),
      },
      {
        label: 'External instance in ref',
        note: 'Внешний объект создаётся один раз и переживает последующие render-ы.',
        code: [
          'if (consoleRef.current === null) {',
          '  consoleRef.current = createDemoConsole();',
          '}',
        ].join('\n'),
      },
    ],
  },
  imperative: {
    files: [
      {
        path: 'src/components/dom-refs/ImperativeConflictLab.tsx',
        note: 'Лаборатория показывает безопасный imperative focus и конфликтную ручную подмену React-owned DOM.',
      },
      {
        path: 'src/lib/imperative-dom-model.ts',
        note: 'Модель фиксирует границу между safe escape hatch и конфликтом с declarative UI.',
      },
      {
        path: 'src/pages/ImperativeConflictPage.tsx',
        note: 'Страница собирает общий вывод по допустимому и недопустимому imperative DOM.',
      },
    ],
    snippets: [
      {
        label: 'Safe escape hatch',
        note: 'Focus направляет уже существующий DOM, но не создаёт второй источник истины.',
        code: ['cardRef.current?.focus();'].join('\n'),
      },
      {
        label: 'Conflict with React-owned DOM',
        note: 'Ручная подмена className и textContent начинает конкурировать с JSX.',
        code: [
          'cardRef.current?.classList.add("ring-4", "ring-rose-500");',
          'titleRef.current!.textContent = "Manual DOM rewrite";',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
