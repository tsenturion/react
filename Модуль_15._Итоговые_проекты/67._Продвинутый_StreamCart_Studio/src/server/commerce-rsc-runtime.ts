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
  label: string;
  layer: RuntimeLayer;
  readyAtMs: number;
};

export type RuntimeReport = {
  htmlShell: string;
  flightRows: readonly FlightLikeRow[];
  clientBundleKb: number;
  clientIslands: readonly string[];
};

function wait(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function buildFlightLikeReport(root: RuntimeNode): Promise<RuntimeReport> {
  const startedAt = Date.now();
  const rows: FlightLikeRow[] = [];
  const htmlShellParts: string[] = [];
  const clientIslands: string[] = [];
  let clientBundleKb = 0;

  async function visit(node: RuntimeNode) {
    if (node.layer === 'server' && node.asyncMs) {
      await wait(node.asyncMs);
    }

    rows.push({
      id: node.id,
      label: node.label,
      layer: node.layer,
      readyAtMs: Date.now() - startedAt,
    });

    if (node.layer === 'server') {
      htmlShellParts.push(`<section data-server="${node.id}">${node.label}</section>`);
    } else {
      htmlShellParts.push(`<div data-client="${node.id}">${node.label} island</div>`);
      clientIslands.push(node.label);
      clientBundleKb += node.clientBundleKb ?? 0;
    }

    for (const child of node.children ?? []) {
      await visit(child);
    }
  }

  await visit(root);

  return {
    htmlShell: htmlShellParts.join(''),
    flightRows: rows,
    clientBundleKb,
    clientIslands,
  };
}
