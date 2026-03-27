const impureRegistry: string[] = [];

export function resetImpureRegistry() {
  impureRegistry.length = 0;
}

export function pushImpureRegistry(label: string) {
  impureRegistry.push(label);
  return impureRegistry.length;
}

export function getImpureRegistrySnapshot() {
  return [...impureRegistry];
}
