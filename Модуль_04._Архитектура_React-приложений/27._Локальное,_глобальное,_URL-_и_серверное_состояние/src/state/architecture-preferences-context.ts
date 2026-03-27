import { createContext } from 'react';

import type { ArchitectureLens, Density } from '../lib/state-domain';

export type ArchitecturePreferencesValue = {
  density: Density;
  lens: ArchitectureLens;
  setDensity: (density: Density) => void;
  setLens: (lens: ArchitectureLens) => void;
};

export const ArchitecturePreferencesContext =
  createContext<ArchitecturePreferencesValue | null>(null);
