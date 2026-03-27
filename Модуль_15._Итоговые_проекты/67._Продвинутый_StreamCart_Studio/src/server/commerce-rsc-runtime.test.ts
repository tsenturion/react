import { describe, expect, it } from 'vitest';

import { buildFlightLikeReport } from './commerce-rsc-runtime';

describe('commerce rsc runtime', () => {
  it('builds a flight-like report with client islands', async () => {
    const report = await buildFlightLikeReport({
      id: 'pdp',
      label: 'Product page',
      layer: 'server',
      children: [
        {
          id: 'hero',
          label: 'Hero copy',
          layer: 'server',
          asyncMs: 20,
        },
        {
          id: 'variant-picker',
          label: 'Variant picker',
          layer: 'client',
          clientBundleKb: 18,
        },
      ],
    });

    expect(report.htmlShell).toContain('data-server="pdp"');
    expect(report.clientBundleKb).toBe(18);
    expect(report.clientIslands).toContain('Variant picker');
  });
});
