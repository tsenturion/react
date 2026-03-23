import { ListBlock } from '../components/ui';

export function LayoutOverviewPane() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-600">
        Overview child route живёт внутри общего parent layout. Toolbar, textarea и route
        navigation родителя не размонтируются при переходе к соседним child routes.
      </p>
      <ListBlock
        title="Что живёт в parent layout"
        items={[
          'textarea с локальной заметкой',
          'вкладки overview / checklist / activity',
          'общая шапка и пояснение для всей ветки',
        ]}
      />
    </div>
  );
}
