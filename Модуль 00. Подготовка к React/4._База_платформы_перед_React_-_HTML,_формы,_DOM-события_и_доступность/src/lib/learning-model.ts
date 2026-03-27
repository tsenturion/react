export type { StatusTone } from './common';

export {
  buildSemanticScenario,
  pageKinds,
  type PageKind,
  type StructureMode,
} from './semantics-model';
export {
  describeFormBehavior,
  messageModes,
  summarizeSubmittedEntries,
  type MessageMode,
  type PlatformFormConfig,
} from './form-model';
export {
  describeEventScenario,
  formatNativeEventLine,
  summarizeNativeEventLog,
  type EventNodeId,
  type EventPhaseName,
  type NativeEventRecord,
} from './event-model';
export {
  evaluateFocusScenario,
  interactiveKinds,
  tabModes,
  type InteractiveKind,
  type TabMode,
} from './focus-model';
export {
  accessibilityPatterns,
  evaluateAccessibilityScenario,
  type AccessibilityPattern,
} from './accessibility-model';
export {
  bridgeScenarios,
  getBridgeScenario,
  type BridgeScenarioId,
} from './platform-bridge-model';
