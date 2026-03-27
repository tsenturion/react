import { describe, expect, it } from 'vitest';

import { buildCardViewModel, defaultCardControls } from './catalog-card-model';
import { inspectReactNode } from './element-inspector';
import { buildExpressionReport } from './expression-model';
import { buildFragmentReport } from './fragment-model';
import { buildJsxCatalogCard } from './jsx-card-element';
import { buildRenderSurface, defaultCatalogState } from './render-description-model';

describe('jsx rendering lesson models', () => {
  it('disables cta when stock is sold out', () => {
    const viewModel = buildCardViewModel({
      ...defaultCardControls,
      stockState: 'sold-out',
    });

    expect(viewModel.ctaDisabled).toBe(true);
    expect(viewModel.stockTone).toBe('error');
  });

  it('inspects jsx card as article root', () => {
    const viewModel = buildCardViewModel(defaultCardControls);
    const tree = inspectReactNode(buildJsxCatalogCard(viewModel));

    expect(tree[0]).toMatchObject({
      kind: 'element',
      typeName: 'article',
    });
  });

  it('marks if statement inside jsx as invalid', () => {
    const report = buildExpressionReport('if-statement', {
      viewerName: 'Анна',
      seatsLeft: 0,
      tagCount: 2,
      authorMode: 'missing',
      hasCertificate: false,
    });

    expect(report.tone).toBe('error');
    expect(report.fix).toContain('тернарный');
  });

  it('counts wrappers as extra nodes in fragment lesson', () => {
    const wrapper = buildFragmentReport('wrapper', 4);
    const fragment = buildFragmentReport('fragment', 4);

    expect(wrapper.extraNodeCount).toContain('лишних');
    expect(fragment.extraNodeCount).toContain('0');
  });

  it('filters render surface by query and availability', () => {
    const surface = buildRenderSurface({
      ...defaultCatalogState,
      query: 'fragment',
      availableOnly: true,
    });

    expect(surface.lessons).toHaveLength(1);
    expect(surface.lessons[0]?.id).toBe('fragment-lab');
  });
});
