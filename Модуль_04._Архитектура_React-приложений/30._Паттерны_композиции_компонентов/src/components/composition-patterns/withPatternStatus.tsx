import type { ComponentType } from 'react';

import { describeHocScenario } from '../../lib/hoc-pattern-model';
import type { StatusTone } from '../../lib/learning-model';

export type InjectedStatusProps = {
  tone: StatusTone;
  statusLabel: string;
  note: string;
};

type HocSignals = {
  consumers: number;
  crossCutting: boolean;
  legacyInterop: boolean;
};

export function withPatternStatus<P extends object>(
  Component: ComponentType<P & InjectedStatusProps>,
) {
  type OuterProps = P & HocSignals;

  function WrappedComponent(props: OuterProps) {
    const { consumers, crossCutting, legacyInterop, ...rest } = props;
    const diagnostics = describeHocScenario({
      consumers,
      crossCutting,
      legacyInterop,
    });

    // Это и есть главная особенность HOC: полезные данные приходят в base
    // component не напрямую из JSX, а через wrapper-слой.
    return (
      <Component
        {...(rest as P)}
        tone={diagnostics.tone}
        statusLabel={diagnostics.statusLabel}
        note={diagnostics.note}
      />
    );
  }

  WrappedComponent.displayName = `withPatternStatus(${
    Component.displayName ?? Component.name ?? 'Anonymous'
  })`;

  return WrappedComponent;
}
