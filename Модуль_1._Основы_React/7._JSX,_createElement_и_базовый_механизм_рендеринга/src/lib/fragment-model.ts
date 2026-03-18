import type { StatusTone } from './learning-model';

export type FragmentMode = 'wrapper' | 'fragment' | 'component';

export type BreadcrumbItem = {
  id: string;
  label: string;
  href: string;
};

export type FragmentReport = {
  tone: StatusTone;
  verdict: string;
  why: string;
  directChildSummary: string;
  extraNodeCount: string;
  snippet: string;
};

export const fragmentModes: readonly {
  id: FragmentMode;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'wrapper',
    label: 'Лишняя обёртка',
    blurb: 'Показывает, как промежуточный wrapper меняет структуру списка.',
  },
  {
    id: 'fragment',
    label: 'React Fragment',
    blurb: 'Возвращает несколько siblings без дополнительного DOM-элемента.',
  },
  {
    id: 'component',
    label: 'Компонент + Fragment',
    blurb: 'Сохраняет читаемость кода и при этом не раздувает DOM.',
  },
] as const;

const allItems: readonly BreadcrumbItem[] = [
  { id: 'root', label: 'Курс', href: '#course' },
  { id: 'module-1', label: 'Модуль 1', href: '#module-1' },
  { id: 'lesson-7', label: 'Урок 7', href: '#lesson-7' },
  { id: 'lab', label: 'Лаборатория JSX', href: '#lab' },
] as const;

export function buildBreadcrumbItems(count: number) {
  return allItems.slice(0, count);
}

export function buildFragmentReport(
  mode: FragmentMode,
  itemCount: number,
): FragmentReport {
  const separatorCount = Math.max(itemCount - 1, 0);

  if (mode === 'wrapper') {
    return {
      tone: 'warn',
      verdict: 'Структура стала тяжелее и менее семантичной.',
      why: 'Для `ol` прямыми детьми ожидаются `li`, а лишний wrapper мешает этой модели.',
      directChildSummary: `${itemCount} wrapper-узла вместо прямой последовательности <li>.`,
      extraNodeCount: `${itemCount} лишних DOM-узлов`,
      snippet: [
        '<ol>',
        '  {items.map((item) => (',
        '    <div key={item.id}>',
        '      <li>{item.label}</li>',
        '      <li aria-hidden="true">/</li>',
        '    </div>',
        '  ))}',
        '</ol>',
      ].join('\n'),
    };
  }

  if (mode === 'fragment') {
    return {
      tone: 'success',
      verdict: 'Fragment сохраняет структуру без дополнительной разметки.',
      why: 'React группирует siblings логически, но не создаёт новый DOM-узел.',
      directChildSummary: `${itemCount + separatorCount} прямых <li> внутри <ol>.`,
      extraNodeCount: '0 лишних DOM-узлов',
      snippet: [
        '<ol>',
        '  {items.map((item, index) => (',
        '    <Fragment key={item.id}>',
        '      <li>{item.label}</li>',
        '      {index < items.length - 1 ? <li aria-hidden="true">/</li> : null}',
        '    </Fragment>',
        '  ))}',
        '</ol>',
      ].join('\n'),
    };
  }

  return {
    tone: 'success',
    verdict: 'Компонент с Fragment даёт и читаемость, и правильную структуру.',
    why: 'Сложная пара узлов уехала в отдельный компонент, но DOM не разросся.',
    directChildSummary: `${itemCount + separatorCount} прямых <li> при более чистом коде.`,
    extraNodeCount: '0 лишних DOM-узлов',
    snippet: [
      'function BreadcrumbPair({ item, isLast }) {',
      '  return (',
      '    <>',
      '      <li>{item.label}</li>',
      '      {!isLast ? <li aria-hidden="true">/</li> : null}',
      '    </>',
      '  );',
      '}',
    ].join('\n'),
  };
}
