export type RuntimeLayer = 'server' | 'client';

export type RuntimeNode = {
  id: string;
  label: string;
  layer: RuntimeLayer;
  asyncMs?: number;
  clientBundleKb?: number;
  children?: readonly RuntimeNode[];
};

export type FlightLikeRow = {
  id: string;
  layer: RuntimeLayer;
  label: string;
  readyAtMs: number;
};

export type RuntimeReport = {
  htmlShell: string;
  flightRows: readonly FlightLikeRow[];
  clientIslands: readonly string[];
  clientBundleKb: number;
};

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Настоящий Flight protocol собирается framework-уровнем.
// В этом учебном проекте runtime ниже не подменяет настоящий RSC transport,
// а показывает ту же идею в проверяемом виде:
// какие узлы резолвятся на сервере, какие становятся client islands
// и сколько JS уезжает в браузер после выбора границы.
export async function buildFlightLikeReport(root: RuntimeNode): Promise<RuntimeReport> {
  const startedAt = Date.now();
  const rows: FlightLikeRow[] = [];
  const shellParts: string[] = [];
  const clientIslands: string[] = [];
  let clientBundleKb = 0;

  async function visit(node: RuntimeNode) {
    if (node.layer === 'server' && node.asyncMs) {
      await wait(node.asyncMs);
    }

    rows.push({
      id: node.id,
      layer: node.layer,
      label: node.label,
      readyAtMs: Date.now() - startedAt,
    });

    if (node.layer === 'server') {
      shellParts.push(`<section data-server="${node.id}">${node.label}</section>`);
    } else {
      shellParts.push(`<div data-client="${node.id}">${node.label} island</div>`);
      clientIslands.push(node.label);
      clientBundleKb += node.clientBundleKb ?? 0;
    }

    for (const child of node.children ?? []) {
      await visit(child);
    }
  }

  await visit(root);

  return {
    htmlShell: shellParts.join(''),
    flightRows: rows,
    clientIslands,
    clientBundleKb,
  };
}

export const sampleRuntimeTree: RuntimeNode = {
  id: 'lesson-page',
  label: 'Lesson page',
  layer: 'server',
  children: [
    {
      id: 'metrics-panel',
      label: 'Metrics panel',
      layer: 'server',
      asyncMs: 40,
    },
    {
      id: 'live-search',
      label: 'Live search island',
      layer: 'client',
      clientBundleKb: 16,
    },
    {
      id: 'recommendation-grid',
      label: 'Recommendation grid',
      layer: 'server',
      asyncMs: 70,
    },
  ],
};
