import type { CardViewModel } from '../../lib/catalog-card-model';
import { buildJsxCatalogCard } from '../../lib/jsx-card-element';

export function JsxCatalogCard({ viewModel }: { viewModel: CardViewModel }) {
  return buildJsxCatalogCard(viewModel);
}
