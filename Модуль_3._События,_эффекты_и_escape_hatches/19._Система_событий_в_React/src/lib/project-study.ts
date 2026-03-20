import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  synthetic: {
    files: [
      {
        path: 'src/components/react-events/SyntheticEventLab.tsx',
        note: 'Живой sandbox с разными паттернами назначения обработчиков и логированием SyntheticEvent.',
      },
      {
        path: 'src/lib/synthetic-event-model.ts',
        note: 'Чистая модель формулирует подходящие паттерны для direct, inline и curried handlers.',
      },
      {
        path: 'src/pages/SyntheticEventPage.tsx',
        note: 'Страница связывает обработчики и структуру event object с практикой UI.',
      },
    ],
    snippets: [
      {
        label: 'Inline handler with args',
        note: 'Когда нужен action name, wrapper передаёт и событие, и дополнительный аргумент.',
        code: [
          '<button',
          '  onClick={(event) => handleNamedAction("archive", "inline", event)}',
          '>',
          '  Archive',
          '</button>',
        ].join('\n'),
      },
      {
        label: 'Synthetic event snapshot',
        note: 'React даёт нормализованный event object и доступ к nativeEvent.',
        code: [
          'const snapshot = {',
          '  action,',
          '  pattern,',
          '  type: event.type,',
          '  currentTarget: readElementLabel(event.currentTarget),',
          '  nativeType: event.nativeEvent.constructor.name,',
          '};',
        ].join('\n'),
      },
    ],
  },
  bubbling: {
    files: [
      {
        path: 'src/components/react-events/BubblingLab.tsx',
        note: 'Nested zones показывают порядок всплытия и влияние `stopPropagation()`.',
      },
      {
        path: 'src/lib/bubbling-model.ts',
        note: 'Модель урока объясняет propagation chain и точки остановки.',
      },
      {
        path: 'src/pages/BubblingPage.tsx',
        note: 'Страница связывает порядок логов и архитектуру вложенных обработчиков.',
      },
    ],
    snippets: [
      {
        label: 'Bubble chain',
        note: 'Без остановки событие проходит от button вверх к card и board.',
        code: [
          '<div onClick={handleBoardClick}>',
          '  <div onClick={handleCardClick}>',
          '    <button onClick={handleButtonClick}>Run</button>',
          '  </div>',
          '</div>',
        ].join('\n'),
      },
      {
        label: 'Stop propagation',
        note: 'Остановка на button не даёт родителям получить событие.',
        code: [
          'function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {',
          '  event.stopPropagation();',
          '}',
        ].join('\n'),
      },
    ],
  },
  bridge: {
    files: [
      {
        path: 'src/components/react-events/ReactNativeBridgeLab.tsx',
        note: 'Один и тот же клик логируется и через React onClick, и через native addEventListener.',
      },
      {
        path: 'src/lib/react-native-model.ts',
        note: 'Модель формулирует основные отличия SyntheticEvent и DOM Event.',
      },
      {
        path: 'src/pages/ReactNativeBridgePage.tsx',
        note: 'Страница связывает live bridge и объяснение различий двух уровней.',
      },
    ],
    snippets: [
      {
        label: 'Native listener',
        note: 'Native подписка живёт в effect и снимается вручную.',
        code: [
          'useEffect(() => {',
          '  node?.addEventListener("click", handleNativeClick);',
          '  return () => node?.removeEventListener("click", handleNativeClick);',
          '}, []);',
        ].join('\n'),
      },
      {
        label: 'Synthetic to native bridge',
        note: 'SyntheticEvent даёт normalized API и прямой доступ к nativeEvent.',
        code: [
          'pushEntry({',
          "  source: 'react',",
          '  host,',
          '  type: event.type,',
          '  target: readNodeLabel(event.target),',
          '  nativeType: event.nativeEvent.constructor.name,',
          '});',
        ].join('\n'),
      },
    ],
  },
  default: {
    files: [
      {
        path: 'src/components/react-events/DefaultActionLab.tsx',
        note: 'Показывает `preventDefault()` на ссылке и checkbox без перехода к абстрактной теории.',
      },
      {
        path: 'src/lib/default-action-model.ts',
        note: 'Модель объясняет, что именно отменяет preventDefault и что он не делает.',
      },
      {
        path: 'src/pages/DefaultActionPage.tsx',
        note: 'Страница связывает default browser behavior и React-handlers.',
      },
    ],
    snippets: [
      {
        label: 'Prevent link default',
        note: 'Отмена default action не отменяет само событие как объект.',
        code: [
          'function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {',
          '  event.preventDefault();',
          '}',
        ].join('\n'),
      },
      {
        label: 'Checkbox default',
        note: 'PreventDefault на checkbox блокирует нативное переключение checked.',
        code: ['if (preventCheckbox) {', '  event.preventDefault();', '}'].join('\n'),
      },
    ],
  },
  flow: {
    files: [
      {
        path: 'src/components/react-events/EventToRenderLab.tsx',
        note: 'Итоговый sandbox показывает цикл действие → state → UI на event-driven панели.',
      },
      {
        path: 'src/lib/event-flow-model.ts',
        note: 'Чистая модель считает visible items, selected item и handled count после событий.',
      },
      {
        path: 'src/pages/EventToRenderPage.tsx',
        note: 'Страница связывает обработчики событий и повторный рендер интерфейса.',
      },
    ],
    snippets: [
      {
        label: 'Event to state',
        note: 'Один click handler меняет state, а следующий render строит новый UI.',
        code: [
          'const nextLessons = toggleHandled(eventState.lessons, lessonId);',
          'commitNextState({ ...eventState, lessons: nextLessons }, "...", "...");',
        ].join('\n'),
      },
      {
        label: 'Derived visible list',
        note: 'UI не хранит видимые элементы отдельно, а пересчитывает их от state после события.',
        code: [
          'const visibleLessons = filterEventLessons(',
          '  eventState.lessons,',
          '  eventState.onlyUnhandled,',
          ');',
        ].join('\n'),
      },
    ],
  },
  pitfalls: {
    files: [
      {
        path: 'src/components/react-events/HandlerPitfallsLab.tsx',
        note: 'Интерактивно показывает target vs currentTarget и ошибки передачи обработчиков.',
      },
      {
        path: 'src/lib/event-pitfall-model.ts',
        note: 'Модель формулирует типичные ошибки и корректные варианты кода.',
      },
      {
        path: 'src/pages/HandlerPitfallsPage.tsx',
        note: 'Страница связывает live-симптомы и кодовые анти-паттерны.',
      },
    ],
    snippets: [
      {
        label: 'Wrong target read',
        note: 'Если нужен dataset обработчика, обычно нужен currentTarget.',
        code: ['const lessonId = event.currentTarget.dataset.lessonId;'].join('\n'),
      },
      {
        label: 'Invoke vs pass',
        note: 'В обработчик нужно передавать функцию, а не результат её вызова.',
        code: ['<button onClick={() => removeLesson(id)}>Delete</button>'].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
