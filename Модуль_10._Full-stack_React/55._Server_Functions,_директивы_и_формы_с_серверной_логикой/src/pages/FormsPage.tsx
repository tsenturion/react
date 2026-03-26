import { ServerFormsLab } from '../components/server-functions-labs/ServerFormsLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function FormsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Forms with server logic"
        title="Почему форма становится естественной точкой серверного действия, а не просто local state вокруг ручного `fetch`"
        copy="Здесь форма живёт в client island, но сама мутация выполняется на сервере. Это позволяет собрать pending, error и result UX вокруг submit boundary, а не вокруг отдельного REST-обработчика и дублирующей ручной обвязки."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Submit уже задаёт момент пересечения границы
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Это особенно полезно для черновиков, публикации, approval-flow и других
              сценариев, где важны серверные правила и права доступа.
            </p>
          </div>
        }
      />

      <BeforeAfter
        beforeTitle="Старый поток"
        before="Форма вручную собирает payload, сама управляет `fetch`, отдельно хранит pending/error/success и дублирует часть контракта вокруг route handler."
        afterTitle="Новая модель"
        after="Форма пересекает server boundary через submit. Серверная функция принимает сериализуемые данные, выполняет валидацию и возвращает обратно итоговый результат как единый поток."
      />

      <ServerFormsLab />

      <ProjectStudy
        files={projectStudyByLab.forms.files}
        snippets={projectStudyByLab.forms.snippets}
      />
    </div>
  );
}
