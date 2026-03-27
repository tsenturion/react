/* eslint-disable react-refresh/only-export-components */
import { Children, Component, cloneElement, isValidElement, type ReactNode } from 'react';

import { cloneElementRisks, describeCloneMode } from '../../lib/clone-element-model';
import { ListBlock, Panel, StatusPill } from '../ui';

type ActionButtonProps = {
  id: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  tone?: 'neutral' | 'accent';
  onClick?: () => void;
};

function ActionButton({
  label,
  active,
  disabled,
  tone = 'neutral',
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        tone === 'accent' || active
          ? 'border-sky-600 bg-sky-50 text-sky-900'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      } disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400`}
    >
      {label}
    </button>
  );
}

type CloneRailProps = {
  children: ReactNode;
  activeId: string;
  disabledAll: boolean;
  composeHandlers: boolean;
  onInjectedAction: (entry: string) => void;
  onSelect: (id: string) => void;
};

class CloneRail extends Component<CloneRailProps> {
  render() {
    return (
      <div className="flex flex-wrap gap-3">
        {Children.map(this.props.children, (child, index) => {
          if (!isValidElement<ActionButtonProps>(child)) {
            return (
              <span
                key={`note-${index}`}
                className="rounded-full border border-dashed border-slate-300 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-500"
              >
                skipped: {String(child)}
              </span>
            );
          }

          const originalOnClick = child.props.onClick;
          const actionId = child.props.id;

          return cloneElement(child, {
            active: actionId === this.props.activeId,
            disabled: this.props.disabledAll || child.props.disabled,
            tone: actionId === this.props.activeId ? 'accent' : 'neutral',
            onClick: () => {
              if (this.props.composeHandlers) {
                originalOnClick?.();
              }

              this.props.onSelect(actionId);
              this.props.onInjectedAction(`Injected handler: ${actionId}`);
            },
          });
        })}
      </div>
    );
  }
}

type CloneElementLabState = {
  composeHandlers: boolean;
  disabledAll: boolean;
  activeId: string;
  log: string[];
};

export class CloneElementLab extends Component<object, CloneElementLabState> {
  state: CloneElementLabState = {
    composeHandlers: true,
    disabledAll: false,
    activeId: 'save',
    log: [
      'Clone rail готов. Нажмите action button и посмотрите, чьё поведение реально сработало.',
    ],
  };

  private appendLog = (entry: string) => {
    this.setState((prev) => ({
      log: [entry, ...prev.log].slice(0, 8),
    }));
  };

  private toggleComposeHandlers = () => {
    this.setState((prev) => ({
      composeHandlers: !prev.composeHandlers,
      log: [
        `Compose mode: ${!prev.composeHandlers ? 'child + injected' : 'override child handler'}`,
        ...prev.log,
      ].slice(0, 8),
    }));
  };

  private toggleDisabledAll = () => {
    this.setState((prev) => ({
      disabledAll: !prev.disabledAll,
    }));
  };

  private resetLog = () => {
    this.setState({
      log: ['Журнал очищен.'],
    });
  };

  private selectAction = (activeId: string) => {
    this.setState({ activeId });
  };

  private handleChildAction = (entry: string) => {
    this.appendLog(entry);
  };

  render() {
    const cloneMode = describeCloneMode(this.state.composeHandlers);

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">cloneElement</StatusPill>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Здесь adapter-контейнер не получает данные явно через props интерфейс, а
                незаметно подмешивает их в уже созданные children через `cloneElement`.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.toggleComposeHandlers}
                className={`chip ${this.state.composeHandlers ? 'chip-active' : ''}`}
              >
                Compose child handler
              </button>
              <button
                type="button"
                onClick={this.toggleDisabledAll}
                className={`chip ${this.state.disabledAll ? 'chip-active' : ''}`}
              >
                Disable all
              </button>
              <button
                type="button"
                onClick={this.resetLog}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Очистить лог
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{cloneMode.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{cloneMode.note}</p>
          </div>

          <CloneRail
            activeId={this.state.activeId}
            disabledAll={this.state.disabledAll}
            composeHandlers={this.state.composeHandlers}
            onInjectedAction={this.appendLog}
            onSelect={this.selectAction}
          >
            <ActionButton
              id="save"
              label="Save draft"
              onClick={() => this.handleChildAction('Child handler: save')}
            />
            <ActionButton
              id="share"
              label="Share snapshot"
              onClick={() => this.handleChildAction('Child handler: share')}
            />
            {'text child'}
            <ActionButton
              id="archive"
              label="Archive version"
              onClick={() => this.handleChildAction('Child handler: archive')}
            />
          </CloneRail>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Event log
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {this.state.log.map((entry) => (
                  <li
                    key={entry}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active injected id
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {this.state.activeId}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Active state приходит не из child props напрямую, а inject-ится adapter-ом
                поверх существующего элемента.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <ListBlock title="cloneElement risks" items={cloneElementRisks} />
        </Panel>
      </div>
    );
  }
}
