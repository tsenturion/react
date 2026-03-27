import { Component, type ChangeEvent } from 'react';

import {
  classStateTakeaways,
  describeCommitCallback,
  normalizeLegacyTag,
  previewDoubleIncrement,
} from '../../lib/class-state-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type ClassStateLabState = {
  count: number;
  draftTag: string;
  tags: string[];
  commitLog: string[];
  lastAction: string;
};

const initialTags = ['legacy-shell', 'migration-pass'];

export class ClassStateLab extends Component<object, ClassStateLabState> {
  state: ClassStateLabState = {
    count: 2,
    draftTag: '',
    tags: initialTags,
    commitLog: ['Счётчик и теги готовы к экспериментам с setState.'],
    lastAction: 'Сначала сравните object-form и updater-form очередь обновлений.',
  };

  private pushLog = (entry: string) => {
    this.setState((prev) => ({
      commitLog: [entry, ...prev.commitLog].slice(0, 6),
    }));
  };

  private handleUnsafeIncrement = () => {
    const snapshot = this.state.count;

    this.setState({
      count: snapshot + 1,
      lastAction: `Оба object-form обновления прочитали snapshot ${snapshot}, поэтому результатом стал только ${snapshot + 1}.`,
    });
    this.setState({ count: snapshot + 1 });
    this.pushLog(`Object-form очередь завершилась значением ${snapshot + 1}.`);
  };

  private handleSafeIncrement = () => {
    this.setState((prev) => ({ count: prev.count + 1 }));
    this.setState((prev) => ({
      count: prev.count + 1,
      lastAction: `Updater-form reopened queue и довёл значение до ${prev.count + 1}.`,
    }));
    this.pushLog(
      'Updater-form очередь использовала актуальный prevState на каждом шаге.',
    );
  };

  private handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ draftTag: event.target.value });
  };

  private handleCommitTag = () => {
    const normalized = normalizeLegacyTag(this.state.draftTag);

    if (!normalized) {
      this.setState({
        lastAction:
          'Пустую строку нечего коммитить. Здесь важно увидеть, что callback нужен после успешного commit.',
      });
      return;
    }

    this.setState(
      (prev) => ({
        tags: [normalized, ...prev.tags],
        draftTag: '',
        lastAction: `Тег "${normalized}" поставлен в очередь и станет доступен в callback после commit.`,
      }),
      () => {
        // Callback нужен именно для post-commit действий: в этот момент this.state
        // уже отражает финальный результат обновления очереди.
        this.pushLog(describeCommitCallback(normalized, this.state.tags.length));
      },
    );
  };

  private handleReset = () => {
    this.setState({
      count: 2,
      draftTag: '',
      tags: initialTags,
      commitLog: ['Состояние сброшено к исходному snapshot.'],
      lastAction: 'Теперь снова можно сравнить object-form и updater-form поведение.',
    });
  };

  render() {
    const preview = previewDoubleIncrement(this.state.count);

    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">setState queue</StatusPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Здесь state живёт в экземпляре класса. Поэтому важно смотреть не только на
                итоговый value, но и на форму каждого queued update.
              </p>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Сбросить лабораторию
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <MetricCard
              label="Текущее значение"
              value={String(this.state.count)}
              hint="Именно этот snapshot читают object-form handlers в момент вызова."
            />
            <MetricCard
              label="Object-form result"
              value={String(preview.objectFormResult)}
              hint="Если сейчас нажать unsafe queue, итог будет только +1."
              tone="accent"
            />
            <MetricCard
              label="Updater-form result"
              value={String(preview.updaterFormResult)}
              hint="Updater-form пересчитывает значение на каждом шаге очереди."
              tone="cool"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-slate-900">
                Счётчик: {this.state.count}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={this.handleUnsafeIncrement}
                  className="button-primary"
                >
                  Object-form +2
                </button>
                <button
                  type="button"
                  onClick={this.handleSafeIncrement}
                  className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  Updater-form +2
                </button>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Последнее объяснение
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {this.state.lastAction}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Очередь setState
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {preview.explanation.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>

        <Panel className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <label
              className="block text-sm font-semibold text-slate-800"
              htmlFor="legacy-tag"
            >
              Добавить тег через callback after commit
            </label>
            <div className="flex flex-wrap gap-3">
              <input
                id="legacy-tag"
                value={this.state.draftTag}
                onChange={this.handleDraftChange}
                placeholder="например: uncontrolled form"
                className="min-w-[260px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
              />
              <button
                type="button"
                onClick={this.handleCommitTag}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Коммитить тег
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {this.state.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Commit log
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {this.state.commitLog.map((entry) => (
                <li
                  key={entry}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel>
          <ListBlock title="Что важно запомнить" items={classStateTakeaways} />
        </Panel>
      </div>
    );
  }
}
