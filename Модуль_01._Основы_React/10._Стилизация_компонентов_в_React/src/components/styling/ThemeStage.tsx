import type { ThemeControls } from '../../lib/theme-model';
import '../../styles/theme-stage.css';

export function ThemeStage({ controls }: { controls: ThemeControls }) {
  return (
    <section
      className="theme-stage"
      data-theme={controls.theme}
      data-density={controls.density}
      data-elevated={controls.elevated}
    >
      <div className="theme-stage__hero">
        <div>
          <p className="theme-stage__eyebrow">Theme switching</p>
          <h3 className="theme-stage__title">Один компонентный набор, разные темы</h3>
          <p className="theme-stage__copy">
            Компоненты читают CSS variables, а не жёстко зашитые цвета. Поэтому тема
            меняется через контейнер, а JSX остаётся тем же.
          </p>
        </div>
        <span className="theme-stage__badge">{controls.theme}</span>
      </div>

      <div className="theme-stage__grid">
        <article className="theme-stage__panel">
          <p className="theme-stage__label">Main panel</p>
          <strong className="theme-stage__metric">12 visual tokens</strong>
          <p className="theme-stage__copy">
            Цвета, фон, бордеры и accent приходят из темы.
          </p>
        </article>
        <article className="theme-stage__panel theme-stage__panel--accent">
          <p className="theme-stage__label">Accent panel</p>
          <strong className="theme-stage__metric">Responsive UI</strong>
          <p className="theme-stage__copy">
            Разные поверхности остаются согласованными без ручной правки каждого блока.
          </p>
        </article>
      </div>
    </section>
  );
}
