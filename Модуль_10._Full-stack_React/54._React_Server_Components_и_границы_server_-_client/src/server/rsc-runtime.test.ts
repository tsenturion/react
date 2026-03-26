import { describe, expect, it } from 'vitest';

import { buildFlightLikeReport, sampleRuntimeTree } from './rsc-runtime';

describe('rsc runtime model', () => {
  it('builds flight-like report with server rows and client islands', async () => {
    const report = await buildFlightLikeReport(sampleRuntimeTree);

    expect(report.htmlShell).toContain('data-server="lesson-page"');
    expect(report.clientIslands).toContain('Live search island');
    expect(report.clientBundleKb).toBe(16);
    expect(report.flightRows.some((row) => row.layer === 'server')).toBe(true);
    expect(report.flightRows.some((row) => row.layer === 'client')).toBe(true);
  });

  it('keeps async server nodes later in ready timeline than shell', async () => {
    const report = await buildFlightLikeReport(sampleRuntimeTree);
    const shellRow = report.flightRows.find((row) => row.id === 'lesson-page');
    const gridRow = report.flightRows.find((row) => row.id === 'recommendation-grid');

    expect(shellRow).toBeDefined();
    expect(gridRow).toBeDefined();
    expect(gridRow!.readyAtMs).toBeGreaterThanOrEqual(shellRow!.readyAtMs);
  });
});
