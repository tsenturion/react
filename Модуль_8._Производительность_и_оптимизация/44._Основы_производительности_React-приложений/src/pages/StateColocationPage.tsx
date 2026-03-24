import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { StateColocationLab } from '../components/performance/StateColocationLab';
import { projectStudyByLab } from '../lib/project-study';

export function StateColocationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="State colocation"
        title="Первый уровень оптимизации: держите state там, где он действительно нужен"
        copy="Когда draft живёт слишком высоко, дорогое поддерево начинает жить в ритме каждого символа. Когда state находится рядом с control, expensive list может обновляться только по осознанному Apply."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">first optimization</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Эта техника часто даёт больший эффект, чем раннее добавление `memo`.
            </p>
          </div>
        }
      />

      <StateColocationLab />

      <BeforeAfter
        beforeTitle="Слишком широкий blast radius"
        before="Draft state живёт в shell, поэтому одно печатание тянет за собой filter, summary и result list."
        afterTitle="Состояние ближе к месту использования"
        after="Draft остаётся локальным до Apply, а вверх уходит только применённое значение, которое действительно нужно списку."
      />

      <ProjectStudy {...projectStudyByLab['state-colocation']} />
    </div>
  );
}
