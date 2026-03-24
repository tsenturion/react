import { Link } from 'react-router-dom';

import { Panel, SectionIntro, StatusPill } from '../components/ui';
import { useJourneyState } from '../state/JourneyStateContext';

export function SubmissionReviewPage() {
  const { lastSubmission } = useJourneyState();

  if (!lastSubmission) {
    return (
      <div className="space-y-8">
        <SectionIntro
          eyebrow="Review route"
          title="Review screen пока пуст"
          copy="Без прохождения form journey этот экран ничего не знает о последней отправке. Это хороший сигнал, что review действительно принадлежит маршруту, а не скрытому локальному флагу."
          aside={<StatusPill tone="warn">empty review</StatusPill>}
        />

        <Panel>
          <div
            role="alert"
            className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950"
          >
            Сначала пройдите форму и только потом возвращайтесь на review route.
          </div>
          <Link
            to="/form-journeys"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Перейти к форме
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Review route"
        title="Review screen подтверждает завершение form journey"
        copy="Теперь итог сценария виден уже на отдельном маршруте. Именно это делает E2E-путь на форме системным, а не локальным."
        aside={<StatusPill tone="success">/submission-review</StatusPill>}
      />

      <Panel className="space-y-4">
        <div
          role="status"
          className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-950"
        >
          Review screen готов. Сценарий <strong>{lastSubmission.title}</strong> передан на
          следующий этап.
        </div>

        <dl className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Ответственный поток
            </dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              {lastSubmission.owner}
            </dd>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Критичность
            </dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              {lastSubmission.scope}
            </dd>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 md:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Примечание
            </dt>
            <dd className="mt-2 text-sm leading-6 text-slate-700">
              {lastSubmission.notes}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/form-journeys"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Вернуться к форме
          </Link>
          <Link
            to="/data-journeys"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Перейти к data journey
          </Link>
        </div>
      </Panel>
    </div>
  );
}
