import { Component, createRef } from 'react';

import { BeforeAfter, Panel, StatusPill } from '../ui';

const presetQueries = [
  'legacy boundary',
  'pure component mutation',
  'class lifecycle cleanup',
] as const;

type LegacyRefsLabState = {
  capturedValue: string;
  cursor: number;
  lastAction: string;
};

export class LegacyRefsLab extends Component<object, LegacyRefsLabState> {
  // В class components ref обычно создаётся как поле экземпляра:
  // объект refs живёт вместе с instance и не пересоздаётся на каждом render.
  private inputRef = createRef<HTMLInputElement>();

  private resultsRef = createRef<HTMLDivElement>();

  state: LegacyRefsLabState = {
    capturedValue: '',
    cursor: 0,
    lastAction: 'Refs здесь используются как мост к DOM, а не как замена state.',
  };

  private focusInput = () => {
    this.inputRef.current?.focus();
    this.setState({
      lastAction: 'Фокус перенесён на input imperatively через createRef.',
    });
  };

  private insertPreset = () => {
    const value = presetQueries[this.state.cursor % presetQueries.length];

    if (this.inputRef.current) {
      this.inputRef.current.value = value;
      this.inputRef.current.focus();
    }

    this.setState((prev) => ({
      cursor: prev.cursor + 1,
      lastAction: `DOM input получил значение "${value}" без controlled state.`,
    }));
  };

  private captureValue = () => {
    const value = this.inputRef.current?.value ?? '';

    this.setState({
      capturedValue: value,
      lastAction: value
        ? `Текущее значение считано из DOM в момент действия: "${value}".`
        : 'Поле пустое, поэтому DOM ничего не вернул.',
    });
  };

  private clearField = () => {
    if (this.inputRef.current) {
      this.inputRef.current.value = '';
      this.inputRef.current.focus();
    }

    this.setState({
      capturedValue: '',
      lastAction: 'Поле очищено imperatively, а фокус остался на input.',
    });
  };

  private focusResults = () => {
    this.resultsRef.current?.focus();
    this.setState({
      lastAction:
        'Фокус переведён на результирующую область без дополнительного state flow.',
    });
  };

  render() {
    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">createRef</StatusPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Здесь ref обслуживает старый imperative сценарий: input живёт как DOM
                node, а React только инициирует операции focus, read и clear.
              </p>
            </div>
          </div>

          <label
            className="block text-sm font-semibold text-slate-800"
            htmlFor="legacy-query"
          >
            Uncontrolled input
          </label>
          <div className="flex flex-wrap gap-3">
            <input
              id="legacy-query"
              ref={this.inputRef}
              defaultValue="legacy class checklist"
              className="min-w-[280px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
            />
            <button type="button" onClick={this.focusInput} className="button-primary">
              Фокус в input
            </button>
            <button
              type="button"
              onClick={this.insertPreset}
              className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Вставить preset
            </button>
            <button
              type="button"
              onClick={this.captureValue}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Считать из DOM
            </button>
            <button
              type="button"
              onClick={this.clearField}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Очистить поле
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div
              ref={this.resultsRef}
              tabIndex={-1}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Последнее считанное значение
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {this.state.capturedValue || 'Пока ничего не считано'}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {this.state.lastAction}
              </p>
              <button
                type="button"
                onClick={this.focusResults}
                className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Перевести фокус сюда
              </button>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Когда refs полезны
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Focus management и scroll restoration.
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Integrations со сторонними DOM widgets и legacy plugins.
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  Uncontrolled inputs в старых формах, где React не держит каждый символ в
                  state.
                </li>
              </ul>
            </div>
          </div>
        </Panel>

        <BeforeAfter
          beforeTitle="Плохой ref usage"
          before="Ref начинает хранить бизнес-данные и управлять логикой интерфейса вместо state. В результате DOM становится скрытым источником истины."
          afterTitle="Хороший ref usage"
          after="Ref остаётся узким escape hatch для focus, scroll, чтения uncontrolled input и bridge к imperative library."
        />
      </div>
    );
  }
}
