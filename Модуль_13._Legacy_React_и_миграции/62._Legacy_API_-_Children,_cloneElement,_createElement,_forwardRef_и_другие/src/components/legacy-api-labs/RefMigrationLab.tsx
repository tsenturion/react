/* eslint-disable react-refresh/only-export-components */
import {
  Component,
  createRef,
  forwardRef,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react';

import {
  describeRefMigration,
  refMigrationTakeaways,
  type RefMigrationChoice,
} from '../../lib/ref-migration-model';
import { ListBlock, Panel, StatusPill } from '../ui';

type BaseFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'children'> & {
  label: string;
  description: string;
};

const ForwardRefField = forwardRef<HTMLInputElement, BaseFieldProps>(
  function ForwardRefField({ label, description, ...props }, ref) {
    const labelId = `${props.id}-label`;

    return (
      <label htmlFor={props.id} className="block space-y-2">
        <span id={labelId} className="text-sm font-semibold text-slate-800">
          {label}
        </span>
        <input
          {...props}
          aria-labelledby={labelId}
          ref={ref}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
        />
        <span className="block text-xs leading-5 text-slate-500">{description}</span>
      </label>
    );
  },
);

type RefAsPropFieldProps = BaseFieldProps & {
  ref?: Ref<HTMLInputElement>;
};

function RefAsPropField({ label, description, ref, ...props }: RefAsPropFieldProps) {
  const labelId = `${props.id}-label`;

  return (
    <label htmlFor={props.id} className="block space-y-2">
      <span id={labelId} className="text-sm font-semibold text-slate-800">
        {label}
      </span>
      <input
        {...props}
        aria-labelledby={labelId}
        ref={ref}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-400"
      />
      <span className="block text-xs leading-5 text-slate-500">{description}</span>
    </label>
  );
}

type RefMigrationLabState = {
  lastFocused: string;
  choice: RefMigrationChoice;
};

export class RefMigrationLab extends Component<object, RefMigrationLabState> {
  private domRef = createRef<HTMLInputElement>();
  private forwardRefField = createRef<HTMLInputElement>();
  private refAsPropField = createRef<HTMLInputElement>();

  state: RefMigrationLabState = {
    lastFocused: 'Пока фокус не переводился imperatively.',
    choice: 'ref-as-prop',
  };

  private focusTarget = (target: RefMigrationChoice) => {
    if (target === 'dom') {
      this.domRef.current?.focus();
      this.setState({
        lastFocused: 'Фокус поставлен на DOM input напрямую через createRef.',
        choice: 'dom',
      });
      return;
    }

    if (target === 'forward-ref') {
      this.forwardRefField.current?.focus();
      this.setState({
        lastFocused: 'Фокус дошёл до input через legacy-friendly forwardRef wrapper.',
        choice: 'forward-ref',
      });
      return;
    }

    if (target === 'ref-as-prop') {
      this.refAsPropField.current?.focus();
      this.setState({
        lastFocused:
          'Фокус дошёл до input через React 19 ref-as-prop без forwardRef wrapper.',
        choice: 'ref-as-prop',
      });
      return;
    }

    this.setState({
      lastFocused:
        'Если задача решается через state и props, реф лучше вообще не использовать.',
      choice: 'avoid-ref',
    });
  };

  render() {
    const recommendation = describeRefMigration(this.state.choice);

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">createRef → forwardRef → ref-as-prop</StatusPill>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Здесь видно, как старый imperative path эволюционировал: class-based
                `createRef`, затем wrapper через `forwardRef`, а в React 19 уже и прямой
                `ref`-as-prop для function components.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => this.focusTarget('dom')}
                className="button-primary"
              >
                Фокус в DOM ref
              </button>
              <button
                type="button"
                onClick={() => this.focusTarget('forward-ref')}
                className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                Фокус через forwardRef
              </button>
              <button
                type="button"
                onClick={() => this.focusTarget('ref-as-prop')}
                className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Фокус через ref-as-prop
              </button>
              <button
                type="button"
                onClick={() => this.focusTarget('avoid-ref')}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ref не нужен
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label htmlFor="legacy-dom-ref-field" className="block space-y-2">
              <span
                id="legacy-dom-ref-field-label"
                className="text-sm font-semibold text-slate-800"
              >
                DOM input ref
              </span>
              <input
                aria-labelledby="legacy-dom-ref-field-label"
                id="legacy-dom-ref-field"
                ref={this.domRef}
                defaultValue="direct dom ref"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
              />
              <span className="block text-xs leading-5 text-slate-500">
                Прямой реф на DOM node без промежуточных обёрток.
              </span>
            </label>

            <ForwardRefField
              id="legacy-forward-ref-field"
              ref={this.forwardRefField}
              label="forwardRef wrapper"
              defaultValue="legacy forwardRef"
              description="Старый мост от внешнего ref к внутреннему input."
            />

            <RefAsPropField
              id="legacy-ref-as-prop-field"
              ref={this.refAsPropField}
              label="React 19 ref-as-prop"
              defaultValue="modern ref prop"
              description="Новый стиль без отдельной forwardRef-обёртки."
            />
          </div>
        </Panel>

        <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {recommendation.title}
              </h3>
              <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{recommendation.note}</p>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {this.state.lastFocused}
            </div>
          </div>

          <ListBlock title="Ref migration takeaways" items={refMigrationTakeaways} />
        </Panel>
      </div>
    );
  }
}
