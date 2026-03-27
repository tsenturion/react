export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'overview' | 'dom' | 'upgrade' | 'codemods' | 'tests' | 'workflow';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Overview',
    blurb: 'Карта deprecated и removed API, release channels и migration discipline.',
    href: '/migration-overview?focus=all',
  },
  {
    id: 'dom',
    label: 'Removed DOM APIs',
    blurb:
      'findDOMNode, render, hydrate, unmountComponentAtNode и другие проблемные точки.',
    href: '/deprecated-dom-apis',
  },
  {
    id: 'upgrade',
    label: '18.3 → 19',
    blurb:
      'Не механическая замена API, а проверка предположений о рендеринге, эффектах и refs.',
    href: '/upgrade-discipline',
  },
  {
    id: 'codemods',
    label: 'Codemods & Channels',
    blurb: 'Codemods, release notes, Latest vs Canary vs Experimental и staged rollout.',
    href: '/codemods-and-release-channels',
  },
  {
    id: 'tests',
    label: 'Test Guardrails',
    blurb: 'Test suite как основной барьер против регрессий во время миграции.',
    href: '/test-guardrails',
  },
  {
    id: 'workflow',
    label: 'Migration Workflow',
    blurb:
      'Полный playbook: audit, codemods, проверка предположений, rollout и support code.',
    href: '/migration-workflow',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
