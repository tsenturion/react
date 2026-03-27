import type { StatusTone } from './learning-model';

export type FragmentMode = 'wrapper' | 'fragment' | 'shorthand';

export type AuditEntry = {
  id: string;
  title: string;
  detail: string;
};

export type FragmentReport = {
  tone: StatusTone;
  summary: string;
  extraNodeCount: number;
  snippet: string;
};

export const auditEntries: readonly AuditEntry[] = [
  {
    id: 'deploy',
    title: 'Deploy в staging',
    detail: 'Второй ряд нужен для служебной информации прямо под основной строкой.',
  },
  {
    id: 'audit',
    title: 'Аудит ключей',
    detail: 'В таблице нельзя вставить `div` между `tbody` и `tr` без поломки структуры.',
  },
  {
    id: 'review',
    title: 'Code review',
    detail: 'Fragment оставляет две строки siblings без дополнительного DOM-узла.',
  },
] as const;

export function buildFragmentReport(
  mode: FragmentMode,
  entryCount: number,
): FragmentReport {
  if (mode === 'wrapper') {
    return {
      tone: 'error',
      summary:
        'Промежуточный wrapper дал бы лишние узлы между `tbody` и `tr`, а для таблицы это структурная ошибка.',
      extraNodeCount: entryCount,
      snippet: [
        '<tbody>',
        '  {entries.map((entry) => (',
        '    <div key={entry.id}>',
        '      <tr>...</tr>',
        '      <tr>...</tr>',
        '    </div>',
        '  ))}',
        '</tbody>',
      ].join('\n'),
    };
  }

  if (mode === 'fragment') {
    return {
      tone: 'success',
      summary:
        'Fragment держит две строки рядом и не добавляет новый DOM-узел в таблицу.',
      extraNodeCount: 0,
      snippet: [
        '<tbody>',
        '  {entries.map((entry) => (',
        '    <Fragment key={entry.id}>',
        '      <tr>...</tr>',
        '      <tr>...</tr>',
        '    </Fragment>',
        '  ))}',
        '</tbody>',
      ].join('\n'),
    };
  }

  return {
    tone: 'success',
    summary:
      'Короткая запись `<>...</>` подходит там, где ключ не нужен на верхнем фрагменте карты.',
    extraNodeCount: 0,
    snippet: [
      'return (',
      '  <>',
      '    <td>{title}</td>',
      '    <td>{detail}</td>',
      '  </>',
      ');',
    ].join('\n'),
  };
}
