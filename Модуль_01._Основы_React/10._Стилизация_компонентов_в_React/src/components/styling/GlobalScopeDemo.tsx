import clsx from 'clsx';

import '../../styles/isolation-demo.css';

export function GlobalScopeDemo({ loud }: { loud: boolean }) {
  return (
    <article className={clsx('global-scope-demo', loud && 'global-scope-demo--loud')}>
      <p className="eyebrow">Global CSS</p>
      <h3 className="title">Общий `.title`</h3>
      <p className="note">
        Этот блок использует generic-классы из обычного CSS-файла. Если такой класс
        изменить, эффект может разойтись по всему приложению.
      </p>
    </article>
  );
}
