import type { CardViewModel } from '../../lib/catalog-card-model';
import { buildManualCatalogCard } from '../../lib/manual-card-element';

export function ManualCatalogCard({ viewModel }: { viewModel: CardViewModel }) {
  return buildManualCatalogCard(viewModel);
}
