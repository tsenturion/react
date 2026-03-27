import clsx from 'clsx';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

type ActionRailButtonProps = {
  value: string;
  children: ReactNode;
  active?: boolean;
  size?: 'compact' | 'comfortable';
  onSelect?: (value: string) => void;
};

function ActionRailButton({
  value,
  children,
  active = false,
  size = 'comfortable',
  onSelect,
}: ActionRailButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(value)}
      className={clsx(
        'rounded-xl border font-medium transition',
        size === 'compact' ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm',
        active
          ? 'border-blue-500 bg-blue-50 text-blue-900'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      )}
    >
      {children}
    </button>
  );
}

const ActionRailRoot = function ActionRail({
  value,
  onValueChange,
  size,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  size: 'compact' | 'comfortable';
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Children.map(children, (child) => {
        // Важное ограничение cloneElement-подхода: root умеет безопасно
        // модифицировать только прямых детей, которые знают этот injected API.
        if (!isValidElement(child) || child.type !== ActionRailButton) {
          return child;
        }

        const button = child as ReactElement<ActionRailButtonProps>;

        return cloneElement(button, {
          active: button.props.value === value,
          size,
          onSelect: onValueChange,
        });
      })}
    </div>
  );
};

export const ActionRail = Object.assign(ActionRailRoot, {
  Button: ActionRailButton,
});
