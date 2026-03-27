import { Form, Link, useActionData, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { type AuthUxLoaderData } from '../lib/auth-runtime';
import { projectStudyByLab } from '../lib/project-study';

type AuthUxActionData = {
  ok: boolean;
  message: string;
  values: {
    personaId: string;
    next: string;
  };
};

const presetLinks = [
  {
    href: '/auth-ux?next=/protected-workspace/billing',
    label: 'Перейти в protected billing',
  },
  {
    href: '/auth-ux?next=/role-access/admin-panel',
    label: 'Перейти в admin panel',
  },
] as const;

export function AuthUxPage() {
  const data = useLoaderData() as AuthUxLoaderData;
  const actionData = useActionData() as AuthUxActionData | undefined;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Login and Redirect UX"
        title="После входа важно продолжить сценарий, а не потерять намерение пользователя"
        copy="Этот login route принимает safe next path, показывает personas и после submit возвращает туда, куда пользователь действительно собирался попасть."
        aside={<StatusPill tone="success">{data.reason}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Next path"
          value={data.next}
          hint="Маршрут already sanitized intended destination и убрал небезопасные варианты."
        />
        <MetricCard
          label="Current session"
          value={data.session?.displayName ?? 'none'}
          hint="Даже если сессия уже есть, login route может использоваться для смены роли и проверки redirect UX."
          tone="accent"
        />
        <MetricCard
          label="Personas"
          value={String(data.personas.length)}
          hint="В проекте есть несколько personas, чтобы видно было разницу между role flows."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Login form
          </p>

          <Form method="post" className="space-y-4">
            <input
              type="hidden"
              name="next"
              value={actionData?.values.next ?? data.next}
            />

            <div className="space-y-3">
              {data.personas.map((persona) => (
                <label
                  key={persona.id}
                  className="block rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300"
                >
                  <input
                    type="radio"
                    name="personaId"
                    value={persona.id}
                    defaultChecked={
                      (actionData?.values.personaId ?? data.personas[0]?.id) ===
                      persona.id
                    }
                    className="sr-only"
                  />
                  <p className="text-sm font-semibold text-slate-900">
                    {persona.displayName} / {persona.role}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {persona.summary}
                  </p>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Войти и продолжить путь
            </button>
          </Form>

          {actionData?.message ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
              {actionData.message}
            </div>
          ) : null}
        </Panel>

        <Panel className="space-y-4">
          <ListBlock
            title="Как читать этот сценарий"
            items={[
              'Откройте одну из preset-ссылок ниже и посмотрите, как route получает next path.',
              'Войдите разными personas и сравните, куда приведёт redirect после login.',
              'После входа попробуйте открыть role-sensitive route с недостаточной ролью.',
            ]}
          />

          <div className="flex flex-wrap gap-2">
            {presetLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.ux} />
      </Panel>
    </div>
  );
}
