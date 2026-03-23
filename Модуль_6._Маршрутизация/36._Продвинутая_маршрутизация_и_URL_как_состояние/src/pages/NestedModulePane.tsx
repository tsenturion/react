import { useParams } from 'react-router-dom';

import { findRoutingModule } from '../lib/routing-domain';
import { ListBlock, StatusPill } from '../components/ui';

export function NestedModulePane() {
  const { moduleId } = useParams();
  const lesson = findRoutingModule(moduleId ?? '');

  if (!lesson) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6">
        <p className="text-sm leading-6 text-rose-900">
          Ветвь `:moduleId` сматчилась, но сама сущность не найдена.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <StatusPill tone="success">:moduleId = {lesson.id}</StatusPill>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {lesson.title}
        </h2>
        <p className="text-sm leading-6 text-slate-600">{lesson.focus}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListBlock title="Экраны" items={lesson.screens} />
        <ListBlock title="Routing notes" items={lesson.routingNotes} />
        <ListBlock title="Pitfalls" items={lesson.pitfallNotes} />
      </div>
    </div>
  );
}
