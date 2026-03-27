import { Component, createElement } from 'react';

import {
  baseBlocks,
  buildFactorySnippet,
  createElementGuardrails,
  describeFactoryState,
  type LegacyBlock,
  type LegacyLayout,
} from '../../lib/create-element-model';
import { CodeBlock, ListBlock, Panel, StatusPill } from '../ui';

function renderLegacyBlock(block: LegacyBlock, emphasize: boolean) {
  const commonClassName = `rounded-[24px] border p-4 ${
    emphasize ? 'border-sky-300 bg-sky-50/70' : 'border-slate-200 bg-white'
  }`;

  if (block.kind === 'metric') {
    return createElement(
      'div',
      { key: block.id, className: commonClassName },
      createElement(
        'p',
        {
          className: 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-500',
        },
        block.title,
      ),
      createElement(
        'p',
        {
          className: 'mt-3 text-sm leading-6 text-slate-700',
        },
        block.body,
      ),
    );
  }

  if (block.kind === 'note') {
    return createElement(
      'aside',
      { key: block.id, className: commonClassName },
      createElement(
        'h3',
        { className: 'text-lg font-semibold text-slate-900' },
        block.title,
      ),
      createElement(
        'p',
        { className: 'mt-3 text-sm leading-6 text-slate-600' },
        block.body,
      ),
    );
  }

  return createElement(
    'section',
    { key: block.id, className: commonClassName },
    createElement(
      'h3',
      { className: 'text-lg font-semibold text-slate-900' },
      block.title,
    ),
    createElement(
      'ul',
      { className: 'mt-3 space-y-2 text-sm leading-6 text-slate-700' },
      createElement(
        'li',
        { className: 'rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3' },
        block.body,
      ),
    ),
  );
}

type FactoryCanvasProps = {
  layout: LegacyLayout;
  blocks: readonly LegacyBlock[];
  emphasize: boolean;
  showFooter: boolean;
};

class FactoryCanvas extends Component<FactoryCanvasProps> {
  render() {
    return createElement(
      this.props.layout,
      {
        className:
          'space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm',
      },
      createElement(
        'header',
        null,
        createElement(
          'p',
          {
            className: 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-500',
          },
          'createElement canvas',
        ),
        createElement(
          'p',
          { className: 'mt-2 text-sm leading-6 text-slate-600' },
          'Этот блок целиком собирается через createElement, без JSX внутри render.',
        ),
      ),
      ...this.props.blocks.map((block) => renderLegacyBlock(block, this.props.emphasize)),
      this.props.showFooter
        ? createElement(
            'footer',
            {
              className:
                'rounded-[24px] border border-dashed border-slate-300 px-4 py-4 text-sm leading-6 text-slate-600',
            },
            'Footer branch тоже создан через createElement.',
          )
        : null,
    );
  }
}

type CreateElementLabState = {
  layout: LegacyLayout;
  emphasize: boolean;
  showFooter: boolean;
  reverseOrder: boolean;
};

export class CreateElementLab extends Component<object, CreateElementLabState> {
  state: CreateElementLabState = {
    layout: 'section',
    emphasize: false,
    showFooter: true,
    reverseOrder: false,
  };

  private setLayout = (layout: LegacyLayout) => {
    this.setState({ layout });
  };

  private toggleFlag = (key: 'emphasize' | 'showFooter' | 'reverseOrder') => {
    this.setState(
      (prev) =>
        ({
          [key]: !prev[key],
        }) as Pick<CreateElementLabState, typeof key>,
    );
  };

  render() {
    const blocks = this.state.reverseOrder ? [...baseBlocks].reverse() : [...baseBlocks];
    const summary = describeFactoryState(this.state.layout, this.state.showFooter);
    const snippet = buildFactorySnippet(
      this.state.layout,
      this.state.emphasize,
      this.state.showFooter,
    );

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">createElement</StatusPill>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Эта лаборатория собирает UI tree через `createElement`, чтобы было видно,
                как JSX опирается на более низкий уровень React API.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['section', 'article', 'aside'] as const).map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => this.setLayout(layout)}
                  className={`chip ${this.state.layout === layout ? 'chip-active' : ''}`}
                >
                  {layout}
                </button>
              ))}
              <button
                type="button"
                onClick={() => this.toggleFlag('emphasize')}
                className={`chip ${this.state.emphasize ? 'chip-active' : ''}`}
              >
                Emphasize
              </button>
              <button
                type="button"
                onClick={() => this.toggleFlag('showFooter')}
                className={`chip ${this.state.showFooter ? 'chip-active' : ''}`}
              >
                Footer
              </button>
              <button
                type="button"
                onClick={() => this.toggleFlag('reverseOrder')}
                className={`chip ${this.state.reverseOrder ? 'chip-active' : ''}`}
              >
                Reverse order
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <FactoryCanvas
              layout={this.state.layout}
              blocks={blocks}
              emphasize={this.state.emphasize}
              showFooter={this.state.showFooter}
            />
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Factory state
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{summary}</p>
              </div>
              <CodeBlock label="createElement factory" code={snippet} />
            </div>
          </div>
        </Panel>

        <Panel>
          <ListBlock title="createElement guardrails" items={createElementGuardrails} />
        </Panel>
      </div>
    );
  }
}
