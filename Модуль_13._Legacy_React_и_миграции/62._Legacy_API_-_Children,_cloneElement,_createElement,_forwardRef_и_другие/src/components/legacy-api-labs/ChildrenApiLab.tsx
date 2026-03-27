/* eslint-disable react-refresh/only-export-components */
import {
  Children,
  Component,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from 'react';

import {
  childrenApiTakeaways,
  describeOnlyChildMode,
  type OnlyChildMode,
} from '../../lib/children-api-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

function LegacyChip({ label, tone = 'sky' }: { label: string; tone?: 'sky' | 'teal' }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        tone === 'sky' ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800'
      }`}
    >
      {label}
    </span>
  );
}

function CompositeGroup({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600">
      <span>{label}</span>
      <span>внутри render создаёт ещё один внутренний чип</span>
      <LegacyChip label="inner" tone="teal" />
    </div>
  );
}

class SingleSlotInspector extends Component<{ children: ReactNode }> {
  render() {
    try {
      const child = Children.only(this.props.children);

      if (isValidElement<{ label?: string }>(child)) {
        return (
          <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            `Children.only` вернул один element:{' '}
            {child.props.label ??
              (typeof child.type === 'string' ? child.type : 'custom component')}
          </div>
        );
      }

      return (
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          `Children.only` вернул одиночный node без props.
        </div>
      );
    } catch (error) {
      return (
        <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          {(error as Error).message}
        </div>
      );
    }
  }
}

type ChildrenApiLabState = {
  includeText: boolean;
  includeComposite: boolean;
  includeNullSlot: boolean;
  onlyMode: OnlyChildMode;
};

export class ChildrenApiLab extends Component<object, ChildrenApiLabState> {
  state: ChildrenApiLabState = {
    includeText: true,
    includeComposite: true,
    includeNullSlot: true,
    onlyMode: 'single-element',
  };

  private toggleFlag = (key: 'includeText' | 'includeComposite' | 'includeNullSlot') => {
    this.setState(
      (prev) =>
        ({
          [key]: !prev[key],
        }) as Pick<ChildrenApiLabState, typeof key>,
    );
  };

  private setOnlyMode = (onlyMode: OnlyChildMode) => {
    this.setState({ onlyMode });
  };

  render() {
    const rawChildren: ReactNode[] = [
      <LegacyChip key="draft" label="Draft lane" />,
      this.state.includeText ? 'Plain text note' : null,
      this.state.includeComposite ? (
        <CompositeGroup key="composite" label="Composite child" />
      ) : null,
      this.state.includeNullSlot ? null : (
        <LegacyChip key="approved" label="Approved lane" tone="teal" />
      ),
    ];

    const countedChildren = Children.count(rawChildren);
    const normalizedChildren = Children.toArray(rawChildren);
    const validElements = normalizedChildren.filter(
      (child): child is ReactElement<{ label?: string }> =>
        isValidElement<{ label?: string }>(child),
    );

    const onlyModeInfo = describeOnlyChildMode(this.state.onlyMode);
    const onlyChildren =
      this.state.onlyMode === 'single-element' ? (
        <LegacyChip label="Single slot child" />
      ) : this.state.onlyMode === 'two-elements' ? (
        [
          <LegacyChip key="first" label="First child" />,
          <LegacyChip key="second" label="Second child" tone="teal" />,
        ]
      ) : (
        'Only plain text'
      );

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">Opaque children</StatusPill>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                `Children` APIs смотрят на входной набор children как на opaque structure.
                Они не знают, что отрендерят вложенные компоненты внутри себя.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => this.toggleFlag('includeText')}
                className={`chip ${this.state.includeText ? 'chip-active' : ''}`}
              >
                Text node
              </button>
              <button
                type="button"
                onClick={() => this.toggleFlag('includeComposite')}
                className={`chip ${this.state.includeComposite ? 'chip-active' : ''}`}
              >
                Composite child
              </button>
              <button
                type="button"
                onClick={() => this.toggleFlag('includeNullSlot')}
                className={`chip ${this.state.includeNullSlot ? 'chip-active' : ''}`}
              >
                Null slot
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <MetricCard
              label="Children.count"
              value={String(countedChildren)}
              hint="Считает структуру children на входе."
            />
            <MetricCard
              label="Children.toArray"
              value={String(normalizedChildren.length)}
              hint="Нормализует children в плоский массив для дальнейшей обработки."
              tone="accent"
            />
            <MetricCard
              label="Valid elements"
              value={String(validElements.length)}
              hint="Только эти nodes безопасно читать через props или clone."
              tone="cool"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Нормализованные children
              </p>
              <div className="mt-4 space-y-3">
                {Children.map(rawChildren, (child, index) => {
                  if (child == null || typeof child === 'boolean') {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500"
                      >
                        Empty placeholder at position {index}
                      </div>
                    );
                  }

                  if (typeof child === 'string' || typeof child === 'number') {
                    return (
                      <div
                        key={`text-${index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        Text node: {String(child)}
                      </div>
                    );
                  }

                  if (isValidElement<{ label?: string }>(child)) {
                    const displayName =
                      child.props.label ??
                      (typeof child.type === 'string'
                        ? child.type
                        : child.type.name || 'anonymous component');

                    return (
                      <div
                        key={`element-${index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        Element slot: {displayName}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Ключевой вывод
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                `Composite child` выше считается одним child element, хотя внутри своего
                render создаёт ещё внутренний чип. Children API не раскрывает subtree.
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">Children.only</StatusPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Этот API полезен для строгого single-slot контракта, но он требует ровно
                один валидный React element.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => this.setOnlyMode('single-element')}
                className={`chip ${this.state.onlyMode === 'single-element' ? 'chip-active' : ''}`}
              >
                Один element
              </button>
              <button
                type="button"
                onClick={() => this.setOnlyMode('two-elements')}
                className={`chip ${this.state.onlyMode === 'two-elements' ? 'chip-active' : ''}`}
              >
                Два элемента
              </button>
              <button
                type="button"
                onClick={() => this.setOnlyMode('text-node')}
                className={`chip ${this.state.onlyMode === 'text-node' ? 'chip-active' : ''}`}
              >
                Text node
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">{onlyModeInfo.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {onlyModeInfo.expectation}
            </p>
            <div className="mt-4">
              <SingleSlotInspector>{onlyChildren}</SingleSlotInspector>
            </div>
          </div>
        </Panel>

        <Panel>
          <ListBlock title="Children API guardrails" items={childrenApiTakeaways} />
        </Panel>
      </div>
    );
  }
}
