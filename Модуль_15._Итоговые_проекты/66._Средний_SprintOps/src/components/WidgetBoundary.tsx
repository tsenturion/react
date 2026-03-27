import type { ReactNode } from 'react';
import { Component } from 'react';

interface WidgetBoundaryProps {
  title: string;
  children: ReactNode;
}

interface WidgetBoundaryState {
  hasError: boolean;
}

export class WidgetBoundary extends Component<WidgetBoundaryProps, WidgetBoundaryState> {
  state: WidgetBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`WidgetBoundary(${this.props.title})`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-state" role="alert">
          <div>
            <h3>{this.props.title}</h3>
            <p>
              Виджет упал локально, но остальная часть интерфейса продолжает работать.
            </p>
          </div>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => this.setState({ hasError: false })}
          >
            Перерисовать виджет
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
