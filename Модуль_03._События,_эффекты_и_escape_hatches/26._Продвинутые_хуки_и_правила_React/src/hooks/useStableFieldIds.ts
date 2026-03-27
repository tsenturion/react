import { useId } from 'react';

export function useStableFieldIds(scope: string) {
  const baseId = useId();
  const normalizedScope = scope.toLowerCase().replace(/\s+/g, '-');

  // useId нужен для стабильных DOM-связей вроде label/input и aria-describedby.
  // Это не замена key: идентичность элементов в списке по-прежнему задаётся key.
  return {
    titleId: `${baseId}-${normalizedScope}-title`,
    ownerId: `${baseId}-${normalizedScope}-owner`,
    notesId: `${baseId}-${normalizedScope}-notes`,
  };
}
