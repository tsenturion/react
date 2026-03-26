export type LocaleId = 'ru-RU' | 'en-US';

export type HydrationScenario = {
  serverLocale: LocaleId;
  clientLocale: LocaleId;
  timeDependentText: boolean;
  randomDependentText: boolean;
  localeDependentText: boolean;
  browserOnlyBranch: boolean;
  orderCount: number;
};

export type HydrationIssue = {
  id: 'time' | 'random' | 'locale' | 'browser';
  title: string;
  why: string;
  prevention: string;
};

export type HydrationSnapshot = {
  mismatch: boolean;
  serverHtml: string;
  clientHtml: string;
  issues: HydrationIssue[];
  serverNarrative: string[];
  clientNarrative: string[];
};

function formatOrderCount(locale: LocaleId, count: number): string {
  return new Intl.NumberFormat(locale).format(count);
}

function renderHydrationPreview(parts: readonly string[]): string {
  return `<section data-demo="hydration-preview">\n  ${parts.join('\n  ')}\n</section>`;
}

export function buildHydrationSnapshot(scenario: HydrationScenario): HydrationSnapshot {
  // Мы намеренно строим две версии одного initial render: серверную и клиентскую.
  // Именно этот разрыв и превращается затем в hydration mismatch.
  const serverNarrative: string[] = [
    `<h3>Релизный экран</h3>`,
    `<p>Заказов в очереди: ${formatOrderCount(scenario.serverLocale, scenario.orderCount)}</p>`,
  ];
  const clientNarrative: string[] = [
    `<h3>Релизный экран</h3>`,
    `<p>Заказов в очереди: ${formatOrderCount(scenario.clientLocale, scenario.orderCount)}</p>`,
  ];
  const issues: HydrationIssue[] = [];

  if (scenario.timeDependentText) {
    serverNarrative.push(`<p data-clock="server">Серверное время: 09:00:00</p>`);
    clientNarrative.push(`<p data-clock="client">Серверное время: 09:00:07</p>`);
    issues.push({
      id: 'time',
      title: 'Нестабильное время в initial render',
      why: 'Время на сервере и клиенте почти никогда не совпадает до миллисекунды.',
      prevention:
        'Либо передавайте уже зафиксированное значение с сервера, либо показывайте placeholder и форматируйте время после hydration.',
    });
  }

  if (scenario.randomDependentText) {
    serverNarrative.push(`<p data-slot="server">Слот A-17</p>`);
    clientNarrative.push(`<p data-slot="client">Слот C-04</p>`);
    issues.push({
      id: 'random',
      title: 'Случайные значения ломают совпадение разметки',
      why: 'Math.random() или случайный id в первом рендере дают разные строки на сервере и клиенте.',
      prevention:
        'Генерируйте значение один раз заранее и передавайте как данные, а не вычисляйте заново во время hydration.',
    });
  }

  if (scenario.localeDependentText && scenario.serverLocale !== scenario.clientLocale) {
    issues.push({
      id: 'locale',
      title: 'Locale formatting зависит от окружения',
      why: 'Одинаковое число может отформатироваться как 12,500 и как 12 500, если локали разные.',
      prevention:
        'Не вычисляйте locale-sensitive вывод по умолчанию из окружения; прокидывайте locale явно и одинаково на сервер и клиент.',
    });
  }

  if (scenario.browserOnlyBranch) {
    serverNarrative.push(
      `<p data-env="server">Серверный shell ещё не знает про localStorage.</p>`,
    );
    clientNarrative.push(
      `<p data-env="client">Локальный черновик найден в браузере.</p>`,
    );
    issues.push({
      id: 'browser',
      title: 'Browser-only ветка меняет HTML до hydration',
      why: 'Условие на window, localStorage или media query даёт разную ветку JSX на сервере и клиенте.',
      prevention:
        'Переносите browser-only разницу в effect, во второй проход или в явно клиентскую часть дерева.',
    });
  }

  const serverHtml = renderHydrationPreview(serverNarrative);
  const clientHtml = renderHydrationPreview(clientNarrative);

  return {
    mismatch: serverHtml !== clientHtml,
    serverHtml,
    clientHtml,
    issues,
    serverNarrative,
    clientNarrative,
  };
}
