import { useState } from 'react';

export function useSelectionHistory(limit = 4) {
  const [history, setHistory] = useState<string[]>([]);

  return {
    history,
    rememberSelection: (itemId: string) => {
      setHistory((current) =>
        [itemId, ...current.filter((id) => id !== itemId)].slice(0, limit),
      );
    },
    clearHistory: () => setHistory([]),
  };
}
