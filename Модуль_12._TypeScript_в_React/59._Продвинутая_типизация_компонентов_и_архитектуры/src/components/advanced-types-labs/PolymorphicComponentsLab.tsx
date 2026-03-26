import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  describePolymorphicSemantics,
  getPolymorphicExample,
  looseAsSnippet,
  polymorphicExampleIds,
  polymorphicHelperSnippet,
  type PolymorphicExampleId,
} from '../../lib/polymorphic-components-model';

type ActionTone = 'neutral' | 'accent' | 'danger';

type PrimitiveOwnProps = {
  tone: ActionTone;
  children: ReactNode;
  className?: string;
};

// Базовый helper-type делает возможным typed `as`-pattern без потери props
// выбранного элемента.
type PolymorphicProps<T extends ElementType, OwnProps> = OwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;

function ActionPrimitive<T extends ElementType = 'button'>({
  as,
  tone,
  children,
  className,
  ...rest
}: PolymorphicProps<T, PrimitiveOwnProps>) {
  const Component = as ?? 'button';

  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition',
        tone === 'neutral' && 'border-slate-300 bg-white text-slate-900',
        tone === 'accent' && 'border-sky-700 bg-sky-700 text-white',
        tone === 'danger' && 'border-rose-300 bg-rose-100 text-rose-950',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function PolymorphicComponentsLab() {
  const [exampleId, setExampleId] = useState<PolymorphicExampleId>('button');
  const [activationCount, setActivationCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const example = getPolymorphicExample(exampleId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {polymorphicExampleIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setExampleId(id)}
            className={`chip ${exampleId === id ? 'chip-active' : ''}`}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active semantics
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {example.title}
              </h3>
            </div>
            <StatusPill tone="warn">{example.renderedAs}</StatusPill>
          </div>

          <p className="text-sm leading-6 text-slate-600">{example.blurb}</p>

          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Live primitive
            </p>
            <div className="mt-4">
              {exampleId === 'button' ? (
                <ActionPrimitive
                  tone="accent"
                  onClick={() => {
                    setActivationCount((count) => count + 1);
                    setLog((entries) => ['button:onClick', ...entries].slice(0, 5));
                  }}
                >
                  Run typed action
                </ActionPrimitive>
              ) : null}

              {exampleId === 'anchor' ? (
                <ActionPrimitive
                  as="a"
                  tone="neutral"
                  href="https://react.dev/learn/typescript"
                  onClick={(event) => {
                    event.preventDefault();
                    setLog((entries) =>
                      ['anchor:navigation intent', ...entries].slice(0, 5),
                    );
                  }}
                >
                  Open migration guide
                </ActionPrimitive>
              ) : null}

              {exampleId === 'label' ? (
                <div className="flex items-center gap-3">
                  <input
                    id="review-mode-toggle"
                    type="checkbox"
                    checked={reviewMode}
                    onChange={(event) => setReviewMode(event.currentTarget.checked)}
                  />
                  <ActionPrimitive as="label" tone="danger" htmlFor="review-mode-toggle">
                    Toggle review mode
                  </ActionPrimitive>
                </div>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {example.runtimeEffect}
            </p>
          </div>

          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              Почему loose API опасен
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-950">{example.risk}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Rendered as"
              value={example.renderedAs}
              hint="`as` меняет не только DOM tag, но и expected props плюс semantic role."
              tone="accent"
            />
            <MetricCard
              label="Current semantic"
              value={describePolymorphicSemantics(exampleId)}
              hint="Primitive должен переносить смысл действия вместе с визуальным слоем."
              tone="cool"
            />
          </div>

          <MetricCard
            label="Live side effect"
            value={
              exampleId === 'label'
                ? `review mode: ${reviewMode ? 'on' : 'off'}`
                : `log entries: ${log.length}, clicks: ${activationCount}`
            }
            hint="Поведение примитива зависит от semantics выбранного элемента."
            tone="dark"
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Polymorphic helper" code={polymorphicHelperSnippet} />
            <CodeBlock label="Loose anti-pattern" code={looseAsSnippet} />
          </div>

          <ListBlock
            title="Когда pattern действительно нужен"
            items={[
              'Primitive живёт в shared layer и переносит один visual contract между несколькими semantics.',
              'Команда готова отдельно проверять link, button и form cases.',
              'В проекте уже есть потребность в единых primitives, а не просто желание сделать компонент “универсальным”.',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
