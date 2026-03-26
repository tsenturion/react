import { describe, expect, it } from 'vitest';

import {
  renderServerSuspenseToString,
  renderServerSuspenseTranscript,
} from './suspense-runtime';

describe('server suspense runtime', () => {
  it('renders fallback markup with renderToString', () => {
    const html = renderServerSuspenseToString([
      { id: 'summary', label: 'Summary', delayMs: 30 },
    ]);

    expect(html).toContain('data-fallback="summary"');
    expect(html).toContain('Waiting inside boundary');
  });

  it('streams ready boundaries progressively', async () => {
    const transcript = await renderServerSuspenseTranscript([
      { id: 'hero', label: 'Hero', delayMs: 20 },
      { id: 'details', label: 'Details', delayMs: 60 },
    ]);

    expect(transcript.html).toContain('data-ready=');
    expect(transcript.html).toContain('data-fallback=');
    expect(transcript.chunks.length).toBeGreaterThan(1);
  });
});
