import { Component, type ErrorInfo, type ReactNode } from 'react';

type LegacyErrorBoundaryProps = {
  label: string;
  children: ReactNode;
  resetKey?: string | number;
  fallbackTitle?: string;
  fallbackCopy?: string;
  onCatch?: (entry: string) => void;
};

type LegacyErrorBoundaryState = {
  error: Error | null;
};

export class LegacyErrorBoundary extends Component<
  LegacyErrorBoundaryProps,
  LegacyErrorBoundaryState
> {
  state: LegacyErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): LegacyErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const componentStack = (info.componentStack ?? '')
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean);

    this.props.onCatch?.(
      `${this.props.label}: ${error.message}${componentStack ? ` (${componentStack})` : ''}`,
    );
  }

  componentDidUpdate(prevProps: LegacyErrorBoundaryProps) {
    // resetKey даёт boundary внешний сигнал восстановления: так shell или playground
    // могут сбросить fallback без полного перезапуска всего приложения.
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div
        role="alert"
        className="rounded-[24px] border border-rose-300 bg-rose-50 p-5 text-rose-950"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          {this.props.label}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">
          {this.props.fallbackTitle ?? 'Boundary поймал ошибку'}
        </h3>
        <p className="mt-3 text-sm leading-6 text-rose-900">
          {this.props.fallbackCopy ??
            'Class-based boundary локализовал сбой и не дал ему разрушить соседний интерфейс.'}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-rose-900">
          <code>{this.state.error.message}</code>
        </pre>
        <button
          type="button"
          onClick={this.handleReset}
          className="mt-4 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Сбросить boundary
        </button>
      </div>
    );
  }
}
