import {
  analyzeBoundaryWorkspace,
  boundaryPresets,
  type BoundaryPresetId,
} from './rsc-boundary-model';

export function compareArchitecturePresets() {
  return (Object.keys(boundaryPresets) as BoundaryPresetId[]).map((presetId) => {
    const preset = boundaryPresets[presetId];
    const report = analyzeBoundaryWorkspace(preset.workspace);

    return {
      presetId,
      label: preset.label,
      description: preset.description,
      clientBundleKb: report.clientBundleKb,
      hydrationUnits: report.hydrationUnits,
      bridgeCount: report.bridgeCount,
      invalidCount: report.invalidCount,
      summary: report.summary,
    };
  });
}

export function describeBundlePressure(clientBundleKb: number): string {
  if (clientBundleKb <= 40) {
    return 'Bundle остаётся узким: клиент гидрирует только действительно interactive islands.';
  }

  if (clientBundleKb <= 80) {
    return 'Bundle ещё контролируем, но клиентская часть уже заметно влияет на initial hydration.';
  }

  return 'Bundle стал тяжёлым: hydration и bridge-логика начинают съедать архитектурный выигрыш от mixed tree.';
}
