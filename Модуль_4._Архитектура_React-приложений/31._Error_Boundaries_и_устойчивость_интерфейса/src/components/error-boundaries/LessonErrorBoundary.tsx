import { Component, type ErrorInfo, type ReactNode } from 'react';

import { haveResetKeysChanged, type ResetReason } from '../../lib/boundary-reset-model';

type LessonErrorBoundaryProps = {
  label: string;
  children: ReactNode;
  resetKeys?: readonly unknown[];
  onError?: (error: Error, componentStack: string) => void;
  onReset?: (reason: Extract<ResetReason, 'manual' | 'reset-keys'>) => void;
  fallbackRender?: (args: { error: Error; reset: () => void }) => ReactNode;
};

type LessonErrorBoundaryState = {
  error: Error | null;
};

export class LessonErrorBoundary extends Component<
  LessonErrorBoundaryProps,
  LessonErrorBoundaryState
> {
  state: LessonErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info.componentStack ?? '');
  }

  componentDidUpdate(previousProps: LessonErrorBoundaryProps) {
    // resetKeys нужны не для любого re-render, а именно для тех случаев, когда
    // новый набор входных данных должен сбросить boundary обратно в рабочий режим.
    if (
      this.state.error &&
      haveResetKeysChanged(previousProps.resetKeys, this.props.resetKeys)
    ) {
      this.resetBoundary('reset-keys');
    }
  }

  private resetBoundary = (reason: Extract<ResetReason, 'manual' | 'reset-keys'>) => {
    this.setState({ error: null });
    this.props.onReset?.(reason);
  };

  render() {
    if (this.state.error) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error,
          reset: () => this.resetBoundary('manual'),
        });
      }

      return (
        <div className="space-y-4 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
          <span className="inline-flex rounded-full border border-rose-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
            Boundary fallback
          </span>
          <div>
            <h3 className="text-xl font-semibold text-rose-950">
              Упал блок: {this.props.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-rose-900">
              Boundary локализовал сбой и заменил сломанный subtree на fallback UI.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-300 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
            {this.state.error.message}
          </div>
          <button
            type="button"
            onClick={() => this.resetBoundary('manual')}
            className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Повторить render
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
