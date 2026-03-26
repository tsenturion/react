/* eslint-disable react-refresh/only-export-components */
import { Suspense, use } from 'react';
import {
  renderToReadableStream,
  renderToStaticMarkup,
  renderToString,
} from 'react-dom/server';

type ArticlePayload = {
  title: string;
  excerpt: string;
  updatedAt: string;
  bullets: readonly string[];
};

type HydrationPayload = {
  ordersLabel: string;
  timeLabel?: string;
  randomLabel?: string;
  environmentLabel?: string;
};

export type StreamSegmentPayload = {
  id: string;
  label: string;
  delayMs: number;
};

export type StreamTranscript = {
  html: string;
  chunks: { offsetMs: number; text: string }[];
};

function ArticleMarkup({
  mode,
  payload,
}: {
  mode: 'ssr' | 'ssg';
  payload: ArticlePayload;
}) {
  return (
    <main data-render-mode={mode}>
      <header>
        <p>{mode === 'ssg' ? 'Статический HTML' : 'Серверный HTML на запрос'}</p>
        <h1>{payload.title}</h1>
        <p>{payload.excerpt}</p>
        <p>Updated at: {payload.updatedAt}</p>
      </header>

      <ul>
        {payload.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  );
}

function HydrationMarkup({ payload }: { payload: HydrationPayload }) {
  return (
    <section data-render-mode="hydration-preview">
      <h2>Hydration snapshot</h2>
      <p>{payload.ordersLabel}</p>
      {payload.timeLabel ? <p>{payload.timeLabel}</p> : null}
      {payload.randomLabel ? <p>{payload.randomLabel}</p> : null}
      {payload.environmentLabel ? <p>{payload.environmentLabel}</p> : null}
    </section>
  );
}

function wait(delayMs: number, value: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}

function createStreamingApp(segments: readonly StreamSegmentPayload[]) {
  const cache = new Map<string, Promise<string>>();

  function readSegment(segment: StreamSegmentPayload): Promise<string> {
    const cacheKey = `${segment.id}:${segment.delayMs}`;

    if (!cache.has(cacheKey)) {
      // Promise кэшируется по boundary, иначе каждый server render pass создавал бы
      // новую асинхронную работу и Suspense никогда не дошёл бы до resolved state.
      cache.set(
        cacheKey,
        wait(segment.delayMs, `${segment.label} ready after ${segment.delayMs}ms`),
      );
    }

    return cache.get(cacheKey)!;
  }

  function AsyncSegment({ segment }: { segment: StreamSegmentPayload }) {
    const content = use(readSegment(segment));

    return (
      <section data-stream-ready={segment.id}>
        <h3>{segment.label}</h3>
        <p>{content}</p>
      </section>
    );
  }

  return function StreamingApp() {
    return (
      <main data-render-mode="streaming">
        <header>
          <h1>Streaming shell</h1>
          <p>Shell приходит сразу, границы Suspense раскрываются по готовности.</p>
        </header>

        {segments.map((segment) => (
          <Suspense
            key={segment.id}
            fallback={
              <section data-fallback={segment.id}>
                <h3>{segment.label}</h3>
                <p>Loading boundary...</p>
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

export function renderCsrShell(payload: ArticlePayload): string {
  return `
<main data-render-mode="csr">
  <header>
    <p>Клиентский shell</p>
    <h1>${payload.title}</h1>
    <p>HTML ещё не содержит контент, который зависит от загрузки JS и данных.</p>
  </header>
  <div id="root-status">Loading client application…</div>
</main>`.trim();
}

export function renderSsrMarkup(payload: ArticlePayload): string {
  return renderToString(<ArticleMarkup mode="ssr" payload={payload} />);
}

export function renderSsgMarkup(payload: ArticlePayload): string {
  return renderToStaticMarkup(<ArticleMarkup mode="ssg" payload={payload} />);
}

export function renderHydrationPair(server: HydrationPayload, client: HydrationPayload) {
  const serverMarkup = renderToString(<HydrationMarkup payload={server} />);
  const clientMarkup = renderToString(<HydrationMarkup payload={client} />);

  return {
    serverMarkup,
    clientMarkup,
    mismatch: serverMarkup !== clientMarkup,
  };
}

export async function renderStreamingTranscript(
  segments: readonly StreamSegmentPayload[],
): Promise<StreamTranscript> {
  const App = createStreamingApp(segments);
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

    // Здесь мы читаем настоящий web stream по chunk-ам, чтобы в тестах и в code study
    // урока существовала реальная потоковая доставка, а не только синтетический массив событий.
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
