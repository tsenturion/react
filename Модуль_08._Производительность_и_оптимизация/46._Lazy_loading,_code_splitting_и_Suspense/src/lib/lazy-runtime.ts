export function waitForDemo(ms: number) {
  const actualDelay = import.meta.env.MODE === 'test' ? Math.min(ms, 30) : ms;

  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, actualDelay);
  });
}

// В локальном dev-бандле chunk может прилетать слишком быстро и учебный fallback
// просто не будет заметен. Эта обёртка не имитирует сеть "в целом", а только делает
// split-point наблюдаемым внутри урока.
export async function delayImport<TModule>(
  loader: () => Promise<TModule>,
  delayMs: number,
) {
  const [module] = await Promise.all([loader(), waitForDemo(delayMs)]);

  return module;
}
