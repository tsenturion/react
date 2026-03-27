import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока построен вокруг migration workflow, а не вокруг формального списка API.',
      },
      {
        path: 'src/lib/migration-overview-model.ts',
        note: 'Карта темы: deprecated DOM APIs, release channels, tests и migration discipline.',
      },
      {
        path: 'src/main.tsx',
        note: 'Современный entrypoint уже использует createRoot как живой контраст removed DOM API.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Шесть лабораторий отражают реальные слои migration процесса.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/migration-overview?focus=all' },
  { id: 'dom', href: '/deprecated-dom-apis' },
  { id: 'upgrade', href: '/upgrade-discipline' },
  { id: 'codemods', href: '/codemods-and-release-channels' },
  { id: 'tests', href: '/test-guardrails' },
  { id: 'workflow', href: '/migration-workflow' },
];`,
      },
      {
        label: 'Modern comparison rows',
        note: 'В overview тема сравнивается по качеству migration reasoning, а не по возрасту API.',
        code: `export const migrationComparisonRows = [
  {
    legacy: '“Заменили deprecated API — миграция завершена”',
    modern: '“Проверили assumptions вокруг render/effects/refs/forms”',
  },
];`,
      },
    ],
  },
  dom: {
    files: [
      {
        path: 'src/components/migration-labs/DeprecatedDomApisLab.tsx',
        note: 'Интерактивный аудит removed DOM API и legacy migration surfaces.',
      },
      {
        path: 'src/lib/deprecated-dom-api-model.ts',
        note: 'Каталог removed/deprecated API и логика summary для 18.3/19 режимов.',
      },
      {
        path: 'src/components/migration-labs/DeprecatedDomApisLab.test.tsx',
        note: 'Тест фиксирует переход summary из warning-режима к реальной поломке в React 19.',
      },
    ],
    snippets: [
      {
        label: 'Runtime-aware summary',
        note: 'Один и тот же call site оценивается по-разному в 18.3 и 19.',
        code: `if (runtimeMode === '19-break' && removedCount > 0) {
  return {
    tone: 'error',
    title: \`React 19 сломает \${removedCount} удалённых call site\`,
  };
}`,
      },
      {
        label: 'Root API diff',
        note: 'Урок показывает не только список замен, но и смену mental model root lifecycle.',
        code: `import { createRoot, hydrateRoot } from 'react-dom/client';

const root = createRoot(container);
root.render(<App />);

const hydratedRoot = hydrateRoot(serverContainer, <App />);
hydratedRoot.unmount();`,
      },
    ],
  },
  upgrade: {
    files: [
      {
        path: 'src/components/migration-labs/UpgradeDisciplineLab.tsx',
        note: 'Workbench для assumptions audit и выбора rollout discipline.',
      },
      {
        path: 'src/lib/upgrade-discipline-model.ts',
        note: 'Вес assumptions, readiness score и переход от codemod-only к staged rollout.',
      },
      {
        path: 'src/pages/UpgradeDisciplinePage.tsx',
        note: 'Страница связывает bridge release 18.3 с проверкой предположений, а не с формальным чекбоксом.',
      },
    ],
    snippets: [
      {
        label: 'Readiness evaluation',
        note: 'Скоринг намеренно зависит не только от рисков, но и от качества rollout discipline.',
        code: `const disciplineDiscount =
  disciplineMode === 'codemod-only' ? 0 : disciplineMode === 'tests-plus-notes' ? 3 : 6;

const score = Math.max(0, scoreFromAssumptions - disciplineDiscount);`,
      },
      {
        label: 'Assumption cards',
        note: 'В коде урока assumptions выражены как реальные объекты с весом и пояснением, а не как абстрактные тезисы.',
        code: `{
  id: 'third-party-is-already-ready',
  title: 'Предполагается, что сторонние библиотеки уже совместимы',
  weight: 4,
}`,
      },
    ],
  },
  codemods: {
    files: [
      {
        path: 'src/components/migration-labs/CodemodReleaseLab.tsx',
        note: 'Интерактивная связка release channels и codemod strategy.',
      },
      {
        path: 'src/lib/codemod-release-model.ts',
        note: 'Карты Latest/Canary/Experimental и соответствие patterns → codemods.',
      },
      {
        path: 'src/components/migration-labs/CodemodReleaseLab.test.tsx',
        note: 'Тест подтверждает, что Experimental правильно помечается как не-prod migration path.',
      },
    ],
    snippets: [
      {
        label: 'Channel recommendation',
        note: 'Канал выбирается по цели миграции, а не по максимальной новизне.',
        code: `if (channel === 'experimental') {
  return {
    tone: 'error',
    title: 'Experimental не подходит для production migration',
  };
}`,
      },
      {
        label: 'Codemod catalog',
        note: 'Модель урока связывает тип проблемы с конкретным инструментом или ручным audit шагом.',
        code: `{
  id: 'removed-dom-helpers',
  title: 'Старые DOM root helpers',
  codemod: 'react/19/replace-reactdom-render-root-apis',
}`,
      },
    ],
  },
  tests: {
    files: [
      {
        path: 'src/components/migration-labs/TestGuardrailLab.tsx',
        note: 'Workbench для выбора test layers и migration-sensitive risks.',
      },
      {
        path: 'src/lib/test-guardrail-model.ts',
        note: 'Модель связывает риски миграции с теми слоями тестов, которые реально могут их поймать.',
      },
      {
        path: 'src/components/migration-labs/TestGuardrailLab.test.tsx',
        note: 'Тест проверяет, что при деградации suite до unit-only появляются пропущенные migration risks.',
      },
    ],
    snippets: [
      {
        label: 'Coverage evaluation',
        note: 'Guardrail оценивается по соответствию tests к выбранным risk surfaces.',
        code: `const missing = migrationRiskCards
  .filter((risk) => selectedRisks.includes(risk.id))
  .filter((risk) => !risk.coveredBy.some((layer) => selectedLayers.includes(layer)))
  .map((risk) => risk.title);`,
      },
      {
        label: 'Risk cards',
        note: 'Каждый migration risk в уроке явно знает, какой слой тестов способен его увидеть.',
        code: `{
  id: 'root-bootstrap',
  title: 'Root bootstrap and mount helpers',
  coveredBy: ['integration', 'e2e'],
}`,
      },
    ],
  },
  workflow: {
    files: [
      {
        path: 'src/components/migration-labs/MigrationWorkflowLab.tsx',
        note: 'Сборка полного migration plan из формы кодовой базы, blockers и rollout mode.',
      },
      {
        path: 'src/lib/migration-playbook-model.ts',
        note: 'Фазы inventory → mechanical changes → assumptions audit → tests → rollout.',
      },
      {
        path: 'src/pages/MigrationWorkflowPage.tsx',
        note: 'Финальная страница связывает workflow с evidence checklist и практикой миграций.',
      },
    ],
    snippets: [
      {
        label: 'Migration phases',
        note: 'Урок сам моделирует миграцию как sequence, а не как одно действие.',
        code: `const phases = [
  { title: '1. Inventory', steps: [...] },
  { title: '2. Mechanical changes', steps: [...] },
  { title: '3. Assumption audit', steps: [...] },
  { title: '4. Proof through tests', steps: [...] },
  { title: '5. Rollout and observation', steps: [...] },
];`,
      },
      {
        label: 'Evidence checklist',
        note: 'Завершённая миграция определяется доказательствами, а не только merge-коммитом.',
        code: `export const migrationEvidenceChecklist = [
  'Есть список removed/deprecated API call sites и их owners.',
  'Codemods отделены от ручных архитектурных решений.',
  'Есть test suite на migration-sensitive сценарии.',
];`,
      },
    ],
  },
};
