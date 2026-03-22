import { useContext } from 'react';

import { ArchitecturePreferencesContext } from './architecture-preferences-context';

export function useArchitecturePreferences() {
  const context = useContext(ArchitecturePreferencesContext);

  if (!context) {
    throw new Error(
      'useArchitecturePreferences must be used inside ArchitecturePreferencesProvider.',
    );
  }

  return context;
}
