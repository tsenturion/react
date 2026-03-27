import { Fragment } from 'react';

import type { BreadcrumbItem, FragmentMode } from '../../lib/fragment-model';

function BreadcrumbPair({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) {
  return (
    <>
      <li>
        <a
          href={item.href}
          className="rounded-lg px-2 py-1 text-blue-700 hover:bg-blue-50"
        >
          {item.label}
        </a>
      </li>
      {!isLast ? (
        <li aria-hidden="true" className="text-slate-400">
          /
        </li>
      ) : null}
    </>
  );
}

export function BreadcrumbTrail({
  items,
  mode,
}: {
  items: readonly BreadcrumbItem[];
  mode: FragmentMode;
}) {
  if (mode === 'wrapper') {
    return (
      <ol className="flex flex-wrap items-center gap-2 rounded-[24px] border border-slate-200 bg-white p-4 text-sm">
        {items.map((item, index) => (
          <div key={item.id}>
            <li className="inline-flex">
              <a
                href={item.href}
                className="rounded-lg px-2 py-1 text-blue-700 hover:bg-blue-50"
              >
                {item.label}
              </a>
            </li>
            {index < items.length - 1 ? (
              <li aria-hidden="true" className="inline-flex text-slate-400">
                /
              </li>
            ) : null}
          </div>
        ))}
      </ol>
    );
  }

  if (mode === 'fragment') {
    return (
      <ol className="flex flex-wrap items-center gap-2 rounded-[24px] border border-slate-200 bg-white p-4 text-sm">
        {items.map((item, index) => (
          // Ключ ставится на Fragment, потому что именно он является внешней оболочкой пары siblings.
          <Fragment key={item.id}>
            <li>
              <a
                href={item.href}
                className="rounded-lg px-2 py-1 text-blue-700 hover:bg-blue-50"
              >
                {item.label}
              </a>
            </li>
            {index < items.length - 1 ? (
              <li aria-hidden="true" className="text-slate-400">
                /
              </li>
            ) : null}
          </Fragment>
        ))}
      </ol>
    );
  }

  return (
    <ol className="flex flex-wrap items-center gap-2 rounded-[24px] border border-slate-200 bg-white p-4 text-sm">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <BreadcrumbPair item={item} isLast={index === items.length - 1} />
        </Fragment>
      ))}
    </ol>
  );
}
