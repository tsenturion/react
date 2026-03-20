import clsx from 'clsx';

import type { ModuleTone } from '../../lib/css-modules-model';
import styles from './ModulePreviewCard.module.css';

export function ModulePreviewCard({
  tone,
  compact,
  withRibbon,
}: {
  tone: ModuleTone;
  compact: boolean;
  withRibbon: boolean;
}) {
  return (
    <article className={clsx(styles.card, styles[tone], compact && styles.compact)}>
      {withRibbon ? (
        <span className={styles.ribbon}>styles.title не конфликтует</span>
      ) : null}
      <p className={styles.eyebrow}>CSS Modules</p>
      <h3 className={styles.title}>Локальная `.title`</h3>
      <p className={styles.note}>
        Здесь тоже есть `.title` и `.note`, но они не задевают глобальный CSS, потому что
        module-классы превращаются в локальные имена.
      </p>
    </article>
  );
}
