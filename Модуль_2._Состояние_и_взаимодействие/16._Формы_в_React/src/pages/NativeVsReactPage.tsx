import { NativeVsReactLab } from '../components/forms/NativeVsReactLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildNativeFormPayload,
  buildNativeVsReactReport,
} from '../lib/native-react-form-model';
import { createNativeComparisonForm } from '../lib/form-domain';
import { getProjectStudy } from '../lib/project-study';

export function NativeVsReactPage() {
  const report = buildNativeVsReactReport(
    buildNativeFormPayload({
      topic: 'Управление submit flow',
      details: 'Нужен живой пример с reportValidity и ручной валидацией.',
      format: 'review',
    }),
    createNativeComparisonForm(),
  );
  const study = getProjectStudy('native');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Нативная форма и React-управление"
        copy="Платформа уже даёт сильную базу: `required`, `FormData`, `reportValidity()` и `reset()`. React добавляет управляемый state, custom UX и точную синхронизацию между вводом и интерфейсом."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Native"
          value={report.nativeLabel}
          hint="Браузер сам умеет валидацию и сбор данных формы."
          tone="cool"
        />
        <MetricCard
          label="React"
          value={report.reactLabel}
          hint="React управляет полями через state и кастомную логику."
        />
        <MetricCard
          label="Balance"
          value="platform + React"
          hint={report.summary}
          tone="accent"
        />
      </div>

      <BeforeAfter
        beforeTitle="Если опираться только на native defaults"
        before="Хватает для простого submit flow, но сложнее встроить live preview, custom errors и сложные зависимости полей."
        afterTitle="Если добавить React-управление"
        after="UI становится предсказуемым и расширяемым, но state нужно поддерживать аккуратно."
      />

      <NativeVsReactLab />

      <Panel className="space-y-4">
        <CodeBlock label="Native vs React" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
