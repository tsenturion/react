import type { ListSurface } from '../../lib/list-model';
import { LessonCard } from './LessonCard';

export function LessonCatalogView({ surface }: { surface: ListSurface }) {
  if (surface.items.length === 0) {
    return (
      <section className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Пустой список</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{surface.emptyMessage}</p>
      </section>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {surface.items.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson}>
          {lesson.hasLiveReview ? 'Есть live review.' : 'Только асинхронный формат.'}
        </LessonCard>
      ))}
    </div>
  );
}
