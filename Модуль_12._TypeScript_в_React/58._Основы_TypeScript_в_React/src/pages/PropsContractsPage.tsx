import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { PropsContractsLab } from '../components/typescript-labs/PropsContractsLab';
import { projectStudyByLab } from '../lib/project-study';

export function PropsContractsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Props & children"
        title="Как типы делают API компонента яснее и не дают смешивать несовместимые варианты использования"
        copy="Здесь важно увидеть, что хорошая типизация props не просто добавляет подписи к параметрам, а оформляет реальные правила использования компонента: какие поля обязательны, какие варианты взаимоисключают друг друга и как в контракт вписывается `children`."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Typed contract снижает runtime ambiguity
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Компонент перестаёт быть «контейнером на все случаи», а получает ясную
              поверхность API.
            </p>
          </div>
        }
      />

      <PropsContractsLab />

      <ProjectStudy
        files={projectStudyByLab.props.files}
        snippets={projectStudyByLab.props.snippets}
      />
    </div>
  );
}
