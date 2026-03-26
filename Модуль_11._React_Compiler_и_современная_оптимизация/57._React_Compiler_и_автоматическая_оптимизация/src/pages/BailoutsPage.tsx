import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { CompilerBailoutsLab } from '../components/compiler-labs/CompilerBailoutsLab';
import { projectStudyByLab } from '../lib/project-study';

export function BailoutsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Bailouts"
        title="Где компилятор отказывается от оптимизации и почему это обычно сигнал к улучшению кода, а не повод злиться на инструмент"
        copy="Здесь видны основные классы проблем: impure render, мутабельные значения, giant context boundaries, library contracts и чисто архитектурные bottlenecks, которые compiler не может закрыть по определению."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">Bailout — это полезный сигнал</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если компилятор честно пропускает компонент, это часто делает видимой
              проблему, которая и без него мешала predictability и поддерживаемости.
            </p>
          </div>
        }
      />

      <CompilerBailoutsLab />

      <BeforeAfter
        beforeTitle="Плохая реакция"
        before="Любой bailout воспринимают как дефект самого компилятора и пытаются обойти предупреждение, не меняя исходный код."
        afterTitle="Хорошая реакция"
        after="Сначала разбирают, не потерял ли компонент чистоту, не мутируются ли значения и не пытаются ли через compiler решить чисто архитектурную проблему."
      />

      <ProjectStudy
        files={projectStudyByLab.bailouts.files}
        snippets={projectStudyByLab.bailouts.snippets}
      />
    </div>
  );
}
