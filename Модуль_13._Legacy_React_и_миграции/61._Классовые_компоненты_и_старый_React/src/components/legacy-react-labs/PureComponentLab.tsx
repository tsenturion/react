import React, { Component, PureComponent } from 'react';

import {
  pureComponentGuardrails,
  pureScenarioCards,
} from '../../lib/pure-component-model';
import { ListBlock, Panel, StatusPill } from '../ui';

type ReviewCard = {
  title: string;
  reviews: number;
  owner: string;
};

type PreviewProps = {
  card: ReviewCard;
};

class RegularPreview extends Component<PreviewProps> {
  private renderCount = 0;

  render() {
    this.renderCount += 1;

    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Regular Component
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Regular reviews: {this.props.card.reviews}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Regular renders: {this.renderCount}
        </p>
      </div>
    );
  }
}

class PurePreview extends PureComponent<PreviewProps> {
  private renderCount = 0;

  render() {
    this.renderCount += 1;

    return (
      <div className="rounded-[24px] border border-teal-200 bg-teal-50/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          PureComponent
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Pure reviews: {this.props.card.reviews}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Pure renders: {this.renderCount}
        </p>
      </div>
    );
  }
}

type PureComponentLabState = {
  card: ReviewCard;
  parentNoise: number;
  note: string;
};

export class PureComponentLab extends Component<object, PureComponentLabState> {
  state: PureComponentLabState = {
    card: {
      title: 'Legacy review widget',
      reviews: 2,
      owner: 'UI platform',
    },
    parentNoise: 0,
    note: 'Сначала создайте parent noise, затем сравните мутацию по ссылке и immutable update.',
  };

  private bumpParentNoise = () => {
    this.setState((prev) => ({
      parentNoise: prev.parentNoise + 1,
      note: 'Родитель обновился, но card prop остался той же ссылкой.',
    }));
  };

  private mutateCardInPlace = () => {
    // Мутация здесь намеренная: лаборатория показывает типичный legacy bug,
    // при котором PureComponent не замечает изменений внутри той же ссылки.
    this.state.card.reviews += 1;
    this.setState({
      card: this.state.card,
      note: 'Объект мутирован по ссылке. Regular Component увидит новые данные, PureComponent - нет.',
    });
  };

  private applyImmutableUpdate = () => {
    this.setState((prev) => ({
      card: {
        ...prev.card,
        reviews: prev.card.reviews + 1,
      },
      note: 'Новая ссылка на объект позволяет PureComponent корректно пройти shallow compare.',
    }));
  };

  private resetLab = () => {
    this.setState({
      card: {
        title: 'Legacy review widget',
        reviews: 2,
        owner: 'UI platform',
      },
      parentNoise: 0,
      note: 'Лаборатория сброшена. Снова сравните reference equality и мутацию.',
    });
  };

  render() {
    return (
      <div className="space-y-6">
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusPill tone="warn">shallow compare</StatusPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `PureComponent` оптимизирует рендер только пока props и state меняются
                иммутабельно и предсказуемо.
              </p>
            </div>
            <button
              type="button"
              onClick={this.resetLab}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Сбросить лабораторию
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.bumpParentNoise}
              className="button-primary"
            >
              Добавить parent noise
            </button>
            <button
              type="button"
              onClick={this.mutateCardInPlace}
              className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Мутировать объект по ссылке
            </button>
            <button
              type="button"
              onClick={this.applyImmutableUpdate}
              className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Обновить иммутабельно
            </button>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Parent noise
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Шум родителя: {this.state.parentNoise}. Текущая заметка: {this.state.note}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RegularPreview card={this.state.card} />
            <PurePreview card={this.state.card} />
          </div>
        </Panel>

        <Panel className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-3">
            {pureScenarioCards.map((card) => (
              <div
                key={card.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <StatusPill tone={card.tone}>{card.tone}</StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Regular: {card.regularReaction}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Pure: {card.pureReaction}
                </p>
              </div>
            ))}
          </div>

          <ListBlock title="Guardrails" items={pureComponentGuardrails} />
        </Panel>
      </div>
    );
  }
}
