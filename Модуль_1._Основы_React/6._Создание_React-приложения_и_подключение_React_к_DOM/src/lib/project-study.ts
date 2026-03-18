export const projectStudy = {
  entry: {
    files: [
      {
        path: 'index.html',
        note: 'Здесь находится буквальный mount container `#root` и script entry в `src/main.tsx`.',
      },
      {
        path: 'src/main.tsx',
        note: 'Главная точка входа: поиск контейнера, `createRoot(container)` и `root.render(...)`.',
      },
      {
        path: 'src/lib/dom-entry-model.ts',
        note: 'Pure model для анализа всей цепочки входа в DOM и типовых поломок.',
      },
    ],
    snippets: [
      {
        label: 'src/main.tsx',
        note: 'Здесь тема урока присутствует буквально, а не только описывается в тексте.',
        code: `const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root.');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
      },
      {
        label: 'src/lib/dom-entry-model.ts',
        note: 'Входная цепочка разобрана как последовательность явных этапов, каждый из которых можно сломать отдельно.',
        code: `const stages = [
  { label: 'index.html', status: config.htmlHasRoot ? 'done' : 'error' },
  { label: 'createRoot(container)', status: config.useCreateRoot ? 'done' : 'error' },
];`,
      },
    ],
  },
  lifecycle: {
    files: [
      {
        path: 'src/components/root/RootLifecycleSandbox.tsx',
        note: 'Отдельный sub-root создаётся и очищается по-настоящему через `createRoot(...)` и `root.unmount()`.',
      },
      {
        path: 'src/lib/root-lifecycle-model.ts',
        note: 'Модель объясняет состояние host/root/tree и последствия текущего snapshot.',
      },
      {
        path: 'src/pages/RootLifecyclePage.tsx',
        note: 'Страница связывает live sandbox с предметной моделью и метриками.',
      },
    ],
    snippets: [
      {
        label: 'src/components/root/RootLifecycleSandbox.tsx',
        note: 'Для урока создан отдельный root вне главного App tree.',
        code: `if (!rootRef.current) {
  rootRef.current = createRoot(hostRef.current);
}

rootRef.current.render(<SandboxCounterCard onLog={appendLog} />);`,
      },
      {
        label: 'src/components/root/RootLifecycleSandbox.tsx',
        note: 'Root lifecycle должен быть симметричным: mount, update, unmount.',
        code: `rootRef.current.unmount();
rootRef.current = null;
setRootCreated(false);
setActiveView('none');`,
      },
    ],
  },
  strictMode: {
    files: [
      {
        path: 'src/components/root/StrictModeSandbox.tsx',
        note: 'Sandbox создаёт отдельный root и сравнивает subtree с StrictMode и без него.',
      },
      {
        path: 'src/lib/strict-mode-model.ts',
        note: 'Модель фиксирует смысл dev-only checks и типичные ошибки интерпретации.',
      },
      {
        path: 'src/main.tsx',
        note: 'Главный App tree тоже запускается в `React.StrictMode`, чтобы проект был близок к реальной разработке.',
      },
    ],
    snippets: [
      {
        label: 'src/components/root/StrictModeSandbox.tsx',
        note: 'Отдельный root нужен, чтобы можно было сравнить StrictMode и non-Strict subtree внутри одного приложения.',
        code: `const probe = strictEnabled ? <StrictMode>{probeTree}</StrictMode> : probeTree;
rootRef.current.render(probe);`,
      },
      {
        label: 'src/components/root/StrictModeSandbox.tsx',
        note: 'Impure probe специально мутирует данные в render, чтобы StrictMode делал проблему заметнее.',
        code: `sourceItems.push(\`render side effect \${sourceItems.length}\`);`,
      },
    ],
  },
  structure: {
    files: [
      {
        path: 'index.html',
        note: 'HTML-shell остаётся минимальным и не пытается хранить React-UI внутри себя.',
      },
      {
        path: 'src/main.tsx',
        note: '`main.tsx` остаётся прозрачной точкой подключения React к DOM.',
      },
      {
        path: 'src/App.tsx',
        note: 'App открывает уже само дерево лабораторий, а не заменяет bootstrap-файл.',
      },
    ],
    snippets: [
      {
        label: 'src/App.tsx',
        note: 'После `main.tsx` начинается уже обычное дерево приложения.',
        code: `const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
const ActiveComponent = activeLab.component;`,
      },
      {
        label: 'index.html',
        note: 'HTML здесь содержит только root container и script entry.',
        code: `<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>`,
      },
    ],
  },
  runtime: {
    files: [
      {
        path: 'package.json',
        note: 'Скрипты разделяют development, build, preview и проверку качества.',
      },
      {
        path: 'vite.config.ts',
        note: 'Vite обслуживает dev-server и build pipeline, но режимы запуска остаются разными по назначению.',
      },
      {
        path: 'src/components/root/StrictModeSandbox.tsx',
        note: 'Sandbox использует `import.meta.env.DEV`, чтобы показывать фактический runtime mode.',
      },
    ],
    snippets: [
      {
        label: 'package.json',
        note: 'Development и production здесь уже разведены через отдельные скрипты.',
        code: `"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview --host 0.0.0.0 --port 4173"
}`,
      },
      {
        label: 'src/components/root/StrictModeSandbox.tsx',
        note: 'Runtime mode берётся из текущего окружения, а не выдумывается в UI.',
        code: `const runtimeMode = import.meta.env.DEV ? 'development' : 'production';`,
      },
    ],
  },
  diagnostics: {
    files: [
      {
        path: 'src/lib/startup-diagnostics-model.ts',
        note: 'Содержит типовые причины, симптомы и направления поиска по текущему проекту.',
      },
      {
        path: 'src/main.tsx',
        note: 'Показывает корректную обработку случая, когда DOM-контейнер не найден.',
      },
      {
        path: 'src/components/root/RootLifecycleSandbox.tsx',
        note: 'Здесь прямо виден плохой сценарий повторного `createRoot(...)` и правильный `root.unmount()`.',
      },
    ],
    snippets: [
      {
        label: 'src/main.tsx',
        note: 'Если контейнер отсутствует, проект падает сразу и явно, а не тихо продолжает работу в некорректном состоянии.',
        code: `if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}`,
      },
      {
        label: 'src/lib/startup-diagnostics-model.ts',
        note: 'Диагностика ведёт не только к симптому, но и к конкретным файлам текущего проекта.',
        code: `whereToLook: ['src/main.tsx', 'src/components/root/StrictModeSandbox.tsx']`,
      },
    ],
  },
} as const;
