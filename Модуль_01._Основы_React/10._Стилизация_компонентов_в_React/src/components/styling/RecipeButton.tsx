import clsx from 'clsx';

import styles from './RecipeButton.module.css';

const toneClasses = {
  neutral: styles.toneNeutral,
  brand: styles.toneBrand,
  danger: styles.toneDanger,
} as const;

const densityClasses = {
  comfortable: styles.comfortable,
  compact: styles.compact,
} as const;

export function RecipeButton({
  tone,
  density,
  selected,
  disabled,
}: {
  tone: keyof typeof toneClasses;
  density: keyof typeof densityClasses;
  selected: boolean;
  disabled: boolean;
}) {
  // Variant maps вынесены из JSX, чтобы компонент не превращался
  // в трудно читаемую строку из вложенных тернарных операторов.
  const className = clsx(
    styles.button,
    toneClasses[tone],
    densityClasses[density],
    selected && styles.selected,
    disabled && styles.disabled,
  );

  return (
    <button type="button" className={className} disabled={disabled}>
      <span>Style recipe</span>
      <span className={styles.meta}>{tone}</span>
    </button>
  );
}
