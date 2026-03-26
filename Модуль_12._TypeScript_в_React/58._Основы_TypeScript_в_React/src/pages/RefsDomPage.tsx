import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { RefsDomLab } from '../components/typescript-labs/RefsDomLab';
import { projectStudyByLab } from '../lib/project-study';

export function RefsDomPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Refs & DOM"
        title="Как типы делают imperative части интерфейса менее хрупкими: DOM-узлы, фокус, скролл и таймеры"
        copy="`useRef` без типа быстро превращается в серую зону между React и DOM. Здесь видно, как TypeScript помогает честно описывать, к какому узлу ведёт ref и что именно можно с ним делать."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Typed refs уменьшают hidden null and wrong-node bugs
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Особенно это заметно в DOM API, где ошибка всплывает не в compile time, а
              уже в момент конкретного пользовательского действия.
            </p>
          </div>
        }
      />

      <RefsDomLab />

      <ProjectStudy
        files={projectStudyByLab.refs.files}
        snippets={projectStudyByLab.refs.snippets}
      />
    </div>
  );
}
