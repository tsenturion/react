import clsx from 'clsx';

import type { ClassNameControls } from '../../lib/class-name-model';
import '../../styles/marketing-card.css';

export function MarketingCard({ controls }: { controls: ClassNameControls }) {
  // Импорт CSS сделан прямо в компоненте намеренно:
  // так видно, что `className` и сам stylesheet связаны с одним UI-блоком.
  return (
    <article
      className={clsx(
        'marketing-card',
        `marketing-card--${controls.accent}`,
        `marketing-card--${controls.density}`,
        `marketing-card--${controls.emphasis}`,
        controls.outlined && 'marketing-card--outlined',
      )}
    >
      <div className="marketing-card__glow" />
      <div className="marketing-card__content">
        <p className="marketing-card__eyebrow">className + CSS file</p>
        <h3 className="marketing-card__title">Карточка релиза</h3>
        <p className="marketing-card__copy">
          Один и тот же JSX остаётся прежним, а внешний вид управляется набором
          модификаторов через `className`.
        </p>

        {controls.showMeta ? (
          <div className="marketing-card__meta">
            <span>Новый onboarding</span>
            <span>Адаптивные блоки</span>
            <span>Плавные переходы</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
