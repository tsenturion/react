import { describe, expect, it } from 'vitest';

import {
  renderSpaShell,
  renderSsrStorefront,
  renderStreamingStorefront,
  storefrontStreamSegments,
} from './storefront-runtime';

describe('storefront runtime', () => {
  const payload = {
    title: 'Экипировка Aurora',
    subtitle: 'Техническое снаряжение для холодных маршрутов.',
    skuCount: 148,
    region: 'RU',
  };

  it('renders CSR shell', () => {
    expect(renderSpaShell(payload)).toContain('data-render-mode="csr-storefront"');
    expect(renderSpaShell(payload)).toContain('Загружаем витрину магазина');
  });

  it('renders SSR markup', () => {
    expect(renderSsrStorefront(payload)).toContain('data-render-mode="ssr-storefront"');
    expect(renderSsrStorefront(payload)).toContain('Экипировка Aurora');
  });

  it('streams storefront transcript by chunks', async () => {
    const transcript = await renderStreamingStorefront(storefrontStreamSegments);

    expect(transcript.html).toContain('data-render-mode="streaming-storefront"');
    expect(transcript.html).toContain('С этим товаром покупают');
    expect(transcript.chunks.length).toBeGreaterThan(0);
  });
});
