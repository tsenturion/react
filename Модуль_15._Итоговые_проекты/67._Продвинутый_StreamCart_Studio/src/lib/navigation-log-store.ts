type Listener = () => void;

type PathLogStore = {
  getSnapshot: () => string[];
  subscribe: (listener: Listener) => () => void;
  record: (pathname: string) => void;
};

function createPathLogStore(): PathLogStore {
  let entries: string[] = [];
  const listeners = new Set<Listener>();

  return {
    getSnapshot: () => entries,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    record: (pathname) => {
      const nextEntries = [
        pathname,
        ...entries.filter((item) => item !== pathname),
      ].slice(0, 6);

      if (
        nextEntries.length === entries.length &&
        nextEntries.every((item, index) => item === entries[index])
      ) {
        return;
      }

      entries = nextEntries;
      listeners.forEach((listener) => listener());
    },
  };
}

export const shellTransitionLogStore = createPathLogStore();
