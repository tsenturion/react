/* eslint-disable react-refresh/only-export-components */
import { Component, createContext, useContext } from 'react';

import {
  contextScenarioCards,
  describeContextRecommendation,
} from '../../lib/context-interop-model';
import {
  historicalContextWarnings,
  historicalLegacyContextSnippet,
} from '../../lib/historical-context-reference';
import { CodeBlock, ListBlock, Panel, StatusPill } from '../ui';

type ThemeState = {
  theme: 'classic' | 'contrast';
  density: 'cozy' | 'compact';
};

const ThemeContext = createContext<ThemeState>({
  theme: 'classic',
  density: 'cozy',
});

class ClassConsumerCard extends Component {
  static contextType = ThemeContext;
  declare context: ThemeState;

  render() {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          class contextType
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Theme from contextType: {this.context.theme} / {this.context.density}
        </p>
      </div>
    );
  }
}

function ConsumerRenderPropCard() {
  return (
    <ThemeContext.Consumer>
      {(value) => (
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Context.Consumer
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Theme from Consumer: {value.theme} / {value.density}
          </p>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}

function HookConsumerCard({ label }: { label: string }) {
  const value = useContext(ThemeContext);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-700">
        Theme from useContext: {value.theme} / {value.density}
      </p>
    </div>
  );
}

type LegacyContextLabState = {
  theme: ThemeState['theme'];
  density: ThemeState['density'];
  nestedOverride: boolean;
  useLegacyShellAdvice: boolean;
};

export class LegacyContextLab extends Component<object, LegacyContextLabState> {
  state: LegacyContextLabState = {
    theme: 'classic',
    density: 'cozy',
    nestedOverride: false,
    useLegacyShellAdvice: true,
  };

  private setTheme = (theme: ThemeState['theme']) => {
    this.setState({ theme });
  };

  private setDensity = (density: ThemeState['density']) => {
    this.setState({ density });
  };

  private toggleFlag = (key: 'nestedOverride' | 'useLegacyShellAdvice') => {
    this.setState(
      (prev) =>
        ({
          [key]: !prev[key],
        }) as Pick<LegacyContextLabState, typeof key>,
    );
  };

  render() {
    const providerValue: ThemeState = {
      theme: this.state.theme,
      density: this.state.density,
    };

    const scopedValue: ThemeState =
      this.state.theme === 'classic'
        ? { theme: 'contrast', density: 'compact' }
        : { theme: 'classic', density: 'cozy' };

    const recommendation = describeContextRecommendation(
      this.state.useLegacyShellAdvice ? 'legacy-class-shell' : 'new-feature',
    );

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">Context before hooks</StatusPill>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Эта лаборатория сравнивает старые и новые способы чтения context:
                `contextType`, `Consumer` и `useContext`. Заодно видно, как nested
                provider меняет только часть поддерева.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => this.setTheme('classic')}
                className={`chip ${this.state.theme === 'classic' ? 'chip-active' : ''}`}
              >
                Classic theme
              </button>
              <button
                type="button"
                onClick={() => this.setTheme('contrast')}
                className={`chip ${this.state.theme === 'contrast' ? 'chip-active' : ''}`}
              >
                Contrast theme
              </button>
              <button
                type="button"
                onClick={() => this.setDensity('cozy')}
                className={`chip ${this.state.density === 'cozy' ? 'chip-active' : ''}`}
              >
                Cozy
              </button>
              <button
                type="button"
                onClick={() => this.setDensity('compact')}
                className={`chip ${this.state.density === 'compact' ? 'chip-active' : ''}`}
              >
                Compact
              </button>
              <button
                type="button"
                onClick={() => this.toggleFlag('nestedOverride')}
                className={`chip ${this.state.nestedOverride ? 'chip-active' : ''}`}
              >
                Nested override
              </button>
            </div>
          </div>

          <ThemeContext.Provider value={providerValue}>
            <div className="grid gap-4 md:grid-cols-3">
              <ClassConsumerCard />
              <ConsumerRenderPropCard />
              {this.state.nestedOverride ? (
                <ThemeContext.Provider value={scopedValue}>
                  <HookConsumerCard label="useContext in nested provider" />
                </ThemeContext.Provider>
              ) : (
                <HookConsumerCard label="useContext in outer provider" />
              )}
            </div>
          </ThemeContext.Provider>
        </Panel>

        <Panel className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {contextScenarioCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                    <StatusPill tone={card.tone}>{card.tone}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{card.note}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {recommendation.title}
                </h3>
                <button
                  type="button"
                  onClick={() => this.toggleFlag('useLegacyShellAdvice')}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Переключить сценарий
                </button>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {recommendation.steps.map((step) => (
                  <li
                    key={step}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <CodeBlock
              label="Historical legacy context"
              code={historicalLegacyContextSnippet}
            />
            <ListBlock
              title="Почему это осталось историческим API"
              items={historicalContextWarnings}
            />
          </div>
        </Panel>
      </div>
    );
  }
}
