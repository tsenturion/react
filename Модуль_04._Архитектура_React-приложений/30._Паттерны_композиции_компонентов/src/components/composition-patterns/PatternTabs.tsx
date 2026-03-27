import clsx from 'clsx';
import { createContext, useContext, type PropsWithChildren, type ReactNode } from 'react';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const value = useContext(TabsContext);

  if (!value) {
    throw new Error('PatternTabs compound parts must be used inside PatternTabs.Root.');
  }

  return value;
}

function Root({ value, onValueChange, children }: PropsWithChildren<TabsContextValue>) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
}

function List({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>;
}

function Trigger({
  value,
  description,
  children,
}: {
  value: string;
  description?: string;
  children: ReactNode;
}) {
  const tabs = useTabsContext();
  const active = tabs.value === value;

  return (
    <button
      type="button"
      onClick={() => tabs.onValueChange(value)}
      className={clsx(
        'rounded-xl px-4 py-3 text-left transition-all duration-200',
        active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100',
      )}
    >
      <span className="block text-sm font-semibold">{children}</span>
      {description ? (
        <span
          className={clsx(
            'mt-1 block text-xs leading-5',
            active ? 'text-blue-100' : 'text-slate-500',
          )}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}

function Panel({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabsContext();

  if (tabs.value !== value) {
    return null;
  }

  return <div>{children}</div>;
}

export const PatternTabs = {
  Root,
  List,
  Trigger,
  Panel,
} as const;
