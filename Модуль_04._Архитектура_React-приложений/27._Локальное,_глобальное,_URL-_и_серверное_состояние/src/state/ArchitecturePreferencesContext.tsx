import { useMemo, useState, type ReactNode } from 'react';

import type { ArchitectureLens, Density } from '../lib/state-domain';
import { ArchitecturePreferencesContext } from './architecture-preferences-context';

export function ArchitecturePreferencesProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<Density>('comfortable');
  const [lens, setLens] = useState<ArchitectureLens>('tradeoffs');

  const value = useMemo(
    () => ({
      density,
      lens,
      setDensity,
      setLens,
    }),
    [density, lens],
  );

  return (
    <ArchitecturePreferencesContext.Provider value={value}>
      {children}
    </ArchitecturePreferencesContext.Provider>
  );
}
