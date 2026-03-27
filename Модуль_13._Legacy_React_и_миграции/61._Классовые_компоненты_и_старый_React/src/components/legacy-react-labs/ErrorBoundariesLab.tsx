import { Component } from 'react';

import {
  legacyContextOptions,
  placesYouStillMeetClasses,
  recommendLegacyAction,
  type LegacyContextId,
} from '../../lib/legacy-playbook-model';
import { ListBlock, Panel, StatusPill } from '../ui';
import { LegacyErrorBoundary } from './LegacyErrorBoundary';

type ExplosiveWidgetProps = {
  shouldCrash: boolean;
};

class ExplosiveWidget extends Component<ExplosiveWidgetProps> {
  render() {
    if (this.props.shouldCrash) {
      throw new Error('Legacy widget crashed during render.');
    }

    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Problem widget
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Пока crash flag не включён, этот class-based widget живёт внутри локального
          boundary.
        </p>
      </div>
    );
  }
}

type SidebarCounterProps = {
  value: number;
};

class SidebarCounter extends Component<SidebarCounterProps> {
  render() {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-teal-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Stable sibling
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Счётчик соседнего виджета: {this.props.value}
        </p>
      </div>
    );
  }
}

type ErrorBoundariesLabState = {
  shouldCrash: boolean;
  sidebarCount: number;
  boundaryVersion: number;
  boundaryLog: string[];
  handlerNote: string;
  context: LegacyContextId;
};

export class ErrorBoundariesLab extends Component<object, ErrorBoundariesLabState> {
  state: ErrorBoundariesLabState = {
    shouldCrash: false,
    sidebarCount: 0,
    boundaryVersion: 1,
    boundaryLog: ['Boundary готов. Сначала уроните виджет, потом сбросьте его локально.'],
    handlerNote:
      'Отдельно обратите внимание: boundary ловит render/lifecycle сбои, но не ваши event handler исключения.',
    context: 'error-boundary',
  };

  private appendBoundaryLog = (entry: string) => {
    this.setState((prev) => ({
      boundaryLog: [entry, ...prev.boundaryLog].slice(0, 6),
    }));
  };

  private triggerCrash = () => {
    this.setState({
      shouldCrash: true,
    });
  };

  private resetBoundary = () => {
    this.setState((prev) => ({
      shouldCrash: false,
      boundaryVersion: prev.boundaryVersion + 1,
    }));
  };

  private incrementSidebar = () => {
    this.setState((prev) => ({
      sidebarCount: prev.sidebarCount + 1,
    }));
  };

  private simulateHandlerFailure = () => {
    try {
      throw new Error('Event handler error');
    } catch (error) {
      this.setState({
        handlerNote: `Handler пришлось ловить вручную: ${(error as Error).message}. Boundary сюда не пришёл.`,
      });
    }
  };

  private selectContext = (context: LegacyContextId) => {
    this.setState({ context });
  };

  render() {
    const recommendation = recommendLegacyAction(this.state.context);

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">Class-based boundaries</StatusPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Эта лаборатория показывает, что boundary изолирует сбой локально и не
                рушит соседний интерфейс. Одновременно она напоминает, что event handler
                ошибки boundary не ловит.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.triggerCrash}
                className="button-primary"
              >
                Уронить проблемный виджет
              </button>
              <button
                type="button"
                onClick={this.resetBoundary}
                className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Сбросить boundary
              </button>
              <button
                type="button"
                onClick={this.incrementSidebar}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Обновить соседний счётчик
              </button>
              <button
                type="button"
                onClick={this.simulateHandlerFailure}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Симулировать handler error
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <LegacyErrorBoundary
              label="Legacy widget boundary"
              resetKey={this.state.boundaryVersion}
              fallbackCopy="Boundary локализовал сбой этого виджета. Соседний интерфейс продолжает жить, а resetKey может восстановить экран."
              onCatch={this.appendBoundaryLog}
            >
              <ExplosiveWidget shouldCrash={this.state.shouldCrash} />
            </LegacyErrorBoundary>

            <SidebarCounter value={this.state.sidebarCount} />
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {this.state.handlerNote}
          </div>
        </Panel>

        <Panel className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {legacyContextOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => this.selectContext(option.id)}
                  className={`chip ${this.state.context === option.id ? 'chip-active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {recommendation.title}
                </h3>
                <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {recommendation.why}
              </p>
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
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Boundary log
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {this.state.boundaryLog.map((entry) => (
                  <li
                    key={entry}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
            <ListBlock
              title="Где классы всё ещё встречаются"
              items={placesYouStillMeetClasses}
            />
          </div>
        </Panel>
      </div>
    );
  }
}
