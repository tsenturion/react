import { describe, expect, it } from 'vitest';

import { evaluateAccessibilityScenario } from './accessibility-model';
import { describeEventScenario } from './event-model';
import { evaluateFocusScenario } from './focus-model';
import { describeFormBehavior, summarizeSubmittedEntries } from './form-model';
import { getBridgeScenario } from './platform-bridge-model';
import { buildSemanticScenario } from './semantics-model';

describe('platform foundations models', () => {
  it('drops landmarks in generic page structure', () => {
    const semantic = buildSemanticScenario({
      pageKind: 'checkout',
      structureMode: 'semantic',
      includeComplementary: true,
    });
    const generic = buildSemanticScenario({
      pageKind: 'checkout',
      structureMode: 'generic',
      includeComplementary: true,
    });

    expect(semantic.landmarkCount).toBeGreaterThan(generic.landmarkCount);
    expect(generic.warnings.length).toBeGreaterThan(1);
  });

  it('explains disabled and missing-name form omissions', () => {
    const behavior = describeFormBehavior({
      trackHasName: false,
      messageMode: 'disabled',
      requireConsent: true,
    });
    const submitted = summarizeSubmittedEntries([['email', 'hello@example.com']], {
      trackHasName: false,
      messageMode: 'disabled',
      requireConsent: true,
    });

    expect(behavior.omissions).toHaveLength(2);
    expect(submitted.omitted.some((item) => item.includes('track'))).toBe(true);
  });

  it('describes event propagation consequences', () => {
    const view = describeEventScenario({
      stopPropagation: true,
      preventDefault: true,
    });

    expect(view.expectations.some((item) => item.includes('Bubble остановится'))).toBe(
      true,
    );
    expect(view.expectations.some((item) => item.includes('hash не изменится'))).toBe(
      true,
    );
  });

  it('flags fake interactive element without keyboard support', () => {
    const view = evaluateFocusScenario({
      kind: 'div',
      hasHref: false,
      tabMode: 'zero',
      addRole: false,
      addKeyboardSupport: false,
    });

    expect(view.focusableInTabOrder).toBe(true);
    expect(view.warnings.some((item) => item.includes('role'))).toBe(true);
    expect(view.warnings.some((item) => item.includes('key handlers'))).toBe(true);
  });

  it('requires a name for icon-only button', () => {
    const view = evaluateAccessibilityScenario({
      pattern: 'icon-button',
      hasVisibleLabel: false,
      hasAriaLabel: false,
      addRedundantRole: false,
      addAriaRequired: false,
    });

    expect(view.nameSource).toBe('missing');
    expect(view.warnings.some((item) => item.includes('aria-label'))).toBe(true);
  });

  it('connects testing scenario to platform semantics', () => {
    const scenario = getBridgeScenario('testing', true);

    expect(scenario.reactLayer).toContain('getByRole');
    expect(scenario.visibleConsequences.length).toBeGreaterThan(0);
  });
});
