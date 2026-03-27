/* eslint-disable react-refresh/only-export-components */
import { Suspense, use } from 'react';
import { renderToReadableStream, renderToString } from 'react-dom/server';

export type StorefrontShellPayload = {
  title: string;
  subtitle: string;
  skuCount: number;
  region: string;
};

export type StreamSegment = {
  id: string;
  label: string;
  delayMs: number;
};

export type StreamTranscript = {
  html: string;
  chunks: { offsetMs: number; text: string }[];
};

function wait(delayMs: number, label: string) {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(`${label} ready after ${delayMs}ms`), delayMs);
  });
}

function StorefrontMarkup({ payload }: { payload: StorefrontShellPayload }) {
  return (
    <main data-render-mode="ssr-storefront">
      <header>
        <p>SSR-оболочка витрины</p>
        <h1>{payload.title}</h1>
        <p>{payload.subtitle}</p>
        <p>
          {payload.skuCount} SKU для региона {payload.region}
        </p>
      </header>
    </main>
  );
}

function createStreamingStorefront(segments: readonly StreamSegment[]) {
  const cache = new Map<string, Promise<string>>();

  function readSegment(segment: StreamSegment) {
    if (!cache.has(segment.id)) {
      cache.set(segment.id, wait(segment.delayMs, segment.label));
    }

    return cache.get(segment.id)!;
  }

  function AsyncSegment({ segment }: { segment: StreamSegment }) {
    const content = use(readSegment(segment));

    return (
      <section data-stream-ready={segment.id}>
        <h3>{segment.label}</h3>
        <p>{content}</p>
      </section>
    );
  }

  return function StreamingStorefront() {
    return (
      <main data-render-mode="streaming-storefront">
        <header>
          <h1>Витрина StreamCart</h1>
          <p>
            Сначала приходит оболочка, а рекомендации и наличие раскрываются в своих
            границах.
          </p>
        </header>

        {segments.map((segment) => (
          <Suspense
            key={segment.id}
            fallback={
              <section data-fallback={segment.id}>
                <h3>{segment.label}</h3>
                <p>Граница ожидает серверные данные...</p>
              </section>
            }
          >
            <AsyncSegment segment={segment} />
          </Suspense>
        ))}
      </main>
    );
  };
}

export function renderSpaShell(payload: StorefrontShellPayload): string {
  return `
<main data-render-mode="csr-storefront">
  <header>
    <p>Клиентская оболочка витрины</p>
    <h1>${payload.title}</h1>
    <p>Сетка товаров, рекомендации и наличие приходят после загрузки JS и клиентских запросов.</p>
  </header>
  <div id="catalog-loading">Загружаем витрину магазина...</div>
</main>`.trim();
}

export function renderSsrStorefront(payload: StorefrontShellPayload): string {
  return renderToString(<StorefrontMarkup payload={payload} />);
}

export async function renderStreamingStorefront(
  segments: readonly StreamSegment[],
): Promise<StreamTranscript> {
  const App = createStreamingStorefront(segments);
  const stream = await renderToReadableStream(<App />);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const startedAt = Date.now();
  const chunks: { offsetMs: number; text: string }[] = [];
  let html = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const text = decoder.decode(value, { stream: true });
    html += text;
    chunks.push({
      offsetMs: Date.now() - startedAt,
      text,
    });
  }

  html += decoder.decode();

  return {
    html,
    chunks,
  };
}

export const storefrontStreamSegments: readonly StreamSegment[] = [
  { id: 'hero', label: 'Главный баннер и featured-коллекция', delayMs: 20 },
  { id: 'inventory', label: 'Снимок наличия по вариантам', delayMs: 90 },
  { id: 'recommendations', label: 'С этим товаром покупают', delayMs: 180 },
] as const;
