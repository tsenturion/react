import { Component } from 'react';

import {
  lifecycleMaintenanceNotes,
  lifecycleMethodCards,
} from '../../lib/lifecycle-model';
import { ListBlock, Panel, StatusPill } from '../ui';

type ProbeProps = {
  filter: 'draft' | 'review' | 'approved';
  showDetails: boolean;
  onLog: (entry: string) => void;
};

type ProbeState = {
  selectedTicket: string;
};

const tickets = [
  { id: 'LEG-17', title: 'Legacy class audit' },
  { id: 'LEG-21', title: 'PureComponent fix' },
  { id: 'LEG-34', title: 'Boundary cleanup' },
] as const;

class LifecycleProbe extends Component<ProbeProps, ProbeState> {
  state: ProbeState = {
    selectedTicket: tickets[0].id,
  };

  componentDidMount() {
    this.props.onLog(
      `componentDidMount: probe смонтирован с фильтром "${this.props.filter}" и тикетом ${this.state.selectedTicket}.`,
    );
  }

  componentDidUpdate(prevProps: ProbeProps, prevState: ProbeState) {
    if (prevProps.filter !== this.props.filter) {
      this.props.onLog(
        `componentDidUpdate: filter сменился с "${prevProps.filter}" на "${this.props.filter}".`,
      );
    }

    if (prevProps.showDetails !== this.props.showDetails) {
      this.props.onLog(
        `componentDidUpdate: режим подробностей теперь ${this.props.showDetails ? 'включён' : 'выключен'}.`,
      );
    }

    if (prevState.selectedTicket !== this.state.selectedTicket) {
      this.props.onLog(
        `componentDidUpdate: локальный selectedTicket сменился на ${this.state.selectedTicket}.`,
      );
    }
  }

  componentWillUnmount() {
    this.props.onLog('componentWillUnmount: probe выполняет cleanup перед удалением.');
  }

  private handleSelect = (ticketId: string) => {
    this.setState({ selectedTicket: ticketId });
  };

  render() {
    return (
      <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <StatusPill tone="success">Mounted probe</StatusPill>
          <p className="text-sm leading-6 text-slate-600">
            Активный фильтр: {this.props.filter}. Выбранный тикет:{' '}
            {this.state.selectedTicket}.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => this.handleSelect(ticket.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                this.state.selectedTicket === ticket.id
                  ? 'border-sky-600 bg-sky-50 text-sky-900'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="block text-sm font-semibold">{ticket.id}</span>
              <span className="mt-1 block text-xs leading-5">{ticket.title}</span>
            </button>
          ))}
        </div>
        {this.props.showDetails ? (
          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Детали режима обновления: probe не пишет в лог во время render. Логи
            появляются только в lifecycle methods.
          </div>
        ) : null}
      </div>
    );
  }
}

type LifecycleLabState = {
  mounted: boolean;
  filter: 'draft' | 'review' | 'approved';
  showDetails: boolean;
  probeKey: number;
  log: string[];
};

export class LifecycleLab extends Component<object, LifecycleLabState> {
  state: LifecycleLabState = {
    mounted: true,
    filter: 'draft',
    showDetails: true,
    probeKey: 1,
    log: [
      'Нажимайте controls ниже, чтобы увидеть mount/update/unmount последовательность.',
    ],
  };

  private appendLog = (entry: string) => {
    this.setState((prev) => ({
      log: [entry, ...prev.log].slice(0, 8),
    }));
  };

  private cycleFilter = () => {
    this.setState((prev) => ({
      filter:
        prev.filter === 'draft'
          ? 'review'
          : prev.filter === 'review'
            ? 'approved'
            : 'draft',
    }));
  };

  private toggleMounted = () => {
    this.setState((prev) => ({
      mounted: !prev.mounted,
    }));
  };

  private toggleDetails = () => {
    this.setState((prev) => ({
      showDetails: !prev.showDetails,
    }));
  };

  private remountProbe = () => {
    this.setState((prev) => ({
      probeKey: prev.probeKey + 1,
    }));
  };

  render() {
    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">Lifecycle phases</StatusPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Эта лаборатория показывает старый mental model напрямую: mount, update и
                cleanup читаются через методы класса и через причину конкретного update.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={this.cycleFilter} className="button-primary">
                Сменить filter
              </button>
              <button
                type="button"
                onClick={this.toggleDetails}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Переключить details
              </button>
              <button
                type="button"
                onClick={this.toggleMounted}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {this.state.mounted ? 'Размонтировать probe' : 'Смонтировать probe'}
              </button>
              <button
                type="button"
                onClick={this.remountProbe}
                className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Пересоздать через key
              </button>
            </div>
          </div>

          {this.state.mounted ? (
            <LifecycleProbe
              key={this.state.probeKey}
              filter={this.state.filter}
              showDetails={this.state.showDetails}
              onLog={this.appendLog}
            />
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
              Probe сейчас размонтирован. Следующий mount создаст новый экземпляр класса и
              снова запустит `componentDidMount`.
            </div>
          )}
        </Panel>

        <Panel className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4 md:grid-cols-3">
            {lifecycleMethodCards.map((card) => (
              <div
                key={card.method}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {card.phase}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {card.method}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.typicalUse}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{card.hookLens}</p>
                <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Типичная ошибка
                  </p>
                  <p className="mt-2 text-sm leading-6 text-rose-950">{card.pitfall}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Lifecycle log
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
            <ListBlock
              title="Как читать legacy lifecycle"
              items={lifecycleMaintenanceNotes}
            />
          </div>
        </Panel>
      </div>
    );
  }
}
