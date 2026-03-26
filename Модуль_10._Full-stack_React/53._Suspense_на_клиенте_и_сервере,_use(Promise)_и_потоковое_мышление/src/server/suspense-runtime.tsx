import { Suspense, use } from 'react';
import { renderToReadableStream, renderToString } from 'react-dom/server';

export type RuntimeSegment = {
  id: string;
  label: string;
  delayMs: number;
};

type StreamTranscript = {
  html: string;
  chunks: { offsetMs: number; text: string }[];
};

function wait(delayMs: number, value: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}

function createSuspenseApp(segments: readonly RuntimeSegment[]) {
  const cache = new Map<string, Promise<string>>();

  function readSegment(segment: RuntimeSegment): Promise<string> {
    const cacheKey = `${segment.id}:${segment.delayMs}`;

    if (!cache.has(cacheKey)) {
      // Promise кэшируется по boundary. Без этого каждый server pass создавал бы
      // новый async resource и Suspense не смог бы стабильно дойти до resolved state.
      cache.set(
        cacheKey,
        wait(segment.delayMs, `${segment.label} ready after ${segment.delayMs}ms`),
      );
    }

    return cache.get(cacheKey)!;
  }

  function AsyncSection({ segment }: { segment: RuntimeSegment }) {
    const text = use(readSegment(segment));

    return (
      <section data-ready={segment.id}>
        <h3>{segment.label}</h3>
        <p>{text}</p>
      </section>
    );
  }

  return function SuspenseApp() {
    return (
      <main data-runtime="suspense-server">
        <header>
          <h1>Server Suspense shell</h1>
          <p>Shell можно отдать раньше, чем доедут все boundaries.</p>
        </header>

        {segments.map((segment) => (
          <Suspense
            key={segment.id}
            fallback={
              <section data-fallback={segment.id}>
                <h3>{segment.label}</h3>
                <p>Waiting inside boundary...</p>
              </section>
            }
          >
            <AsyncSection segment={segment} />
          </Suspense>
        ))}
      </main>
    );
  };
}

export function renderServerSuspenseToString(
  segments: readonly RuntimeSegment[],
): string {
  const App = createSuspenseApp(segments);

  return renderToString(<App />);
}

export async function renderServerSuspenseTranscript(
  segments: readonly RuntimeSegment[],
): Promise<StreamTranscript> {
  const App = createSuspenseApp(segments);
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

    // Здесь читается настоящий web stream chunk за chunk-ом. Это важно:
    // урок показывает реальную серверную потоковую механику, а не выдуманный лог.
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
