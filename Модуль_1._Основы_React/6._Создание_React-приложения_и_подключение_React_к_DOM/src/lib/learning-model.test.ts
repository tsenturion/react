import { describe, expect, it } from 'vitest';

import { analyzeEntryFlow } from './dom-entry-model';
import { describeRootLifecycle } from './root-lifecycle-model';
import { compareRuntimeModes } from './runtime-mode-model';
import { diagnoseStartupIssue } from './startup-diagnostics-model';
import { analyzeStarterStructure } from './starter-structure-model';
import { describeStrictModeScenario } from './strict-mode-model';

describe('react root and dom mounting models', () => {
  it('breaks entry flow when html container is missing', () => {
    const scenario = analyzeEntryFlow({
      htmlHasRoot: false,
      rootIdMatches: true,
      scriptLoads: true,
      useCreateRoot: true,
      wrapsStrictMode: true,
    });

    expect(scenario.tone).toBe('error');
    expect(scenario.blockers.length).toBeGreaterThan(0);
  });

  it('treats active root with mounted tree as healthy lifecycle state', () => {
    const scenario = describeRootLifecycle({
      hostPresent: true,
      rootCreated: true,
      treeMounted: true,
      activeView: 'counter',
      logCount: 3,
    });

    expect(scenario.tone).toBe('success');
    expect(scenario.allowedActions).toContain('Размонтировать через `root.unmount()`');
  });

  it('explains strict mode as dev-only check', () => {
    const scenario = describeStrictModeScenario({
      runtimeMode: 'development',
      strictEnabled: true,
      probeKind: 'impure',
      renderedItems: 5,
      effectLogCount: 2,
    });

    expect(scenario.tone).toBe('success');
    expect(scenario.expectedRenderPattern).toContain('development');
  });

  it('prefers recommended starter structure', () => {
    const clean = analyzeStarterStructure('recommended');
    const htmlDriven = analyzeStarterStructure('html-driven');

    expect(clean.tone).toBe('success');
    expect(htmlDriven.tone).toBe('error');
  });

  it('separates development and production concerns', () => {
    const scenario = compareRuntimeModes({
      mode: 'production',
      strictMode: false,
      hmrEnabled: false,
      optimizedBundle: true,
    });

    expect(scenario.tone).toBe('success');
    expect(scenario.visibleOutcome).toContain('оптимизированный bundle');
  });

  it('diagnoses double createRoot as a runtime discipline issue', () => {
    const scenario = diagnoseStartupIssue('double-create-root');

    expect(scenario.tone).toBe('warn');
    expect(scenario.whereToLook).toContain(
      'src/components/root/RootLifecycleSandbox.tsx',
    );
  });
});
