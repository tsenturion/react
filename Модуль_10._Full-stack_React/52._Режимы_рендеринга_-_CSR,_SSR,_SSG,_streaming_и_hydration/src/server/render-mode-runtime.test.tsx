import { describe, expect, it } from 'vitest';

import {
  renderCsrShell,
  renderHydrationPair,
  renderSsgMarkup,
  renderSsrMarkup,
  renderStreamingTranscript,
} from './render-mode-runtime';

const articlePayload = {
  title: 'Rendering modes release note',
  excerpt: 'CSR, SSR, SSG and streaming solve different delivery problems.',
  updatedAt: '2026-03-26T08:00:00.000Z',
  bullets: ['HTML delivery', 'Hydration cost', 'SEO impact'],
} as const;

describe('server rendering runtime', () => {
  it('renders csr shell without server content body', () => {
    expect(renderCsrShell(articlePayload)).toContain('data-render-mode="csr"');
    expect(renderCsrShell(articlePayload)).toContain('Loading client application');
  });

  it('renders ssr and ssg variants', () => {
    expect(renderSsrMarkup(articlePayload)).toContain('data-render-mode="ssr"');
    expect(renderSsgMarkup(articlePayload)).toContain('Статический HTML');
  });

  it('compares server and client hydration markup', () => {
    const pair = renderHydrationPair(
      {
        ordersLabel: 'Заказов в очереди: 12 500',
        timeLabel: 'Серверное время: 09:00:00',
      },
      {
        ordersLabel: 'Заказов в очереди: 12,500',
        timeLabel: 'Серверное время: 09:00:07',
      },
    );

    expect(pair.mismatch).toBe(true);
  });

  it('streams suspense boundaries progressively', async () => {
    const transcript = await renderStreamingTranscript([
      { id: 'hero', label: 'Hero', delayMs: 20 },
      { id: 'results', label: 'Results', delayMs: 60 },
    ]);

    expect(transcript.html).toContain('data-fallback');
    expect(transcript.html).toContain('data-stream-ready');
    expect(transcript.chunks.length).toBeGreaterThan(1);
  });
});
