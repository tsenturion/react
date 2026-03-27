import type { RenderSurface } from '../../lib/render-description-model';
import { buildLessonCatalogElement } from '../../lib/lesson-catalog-element';

export function LessonCatalogSurface({ surface }: { surface: RenderSurface }) {
  return buildLessonCatalogElement(surface);
}
