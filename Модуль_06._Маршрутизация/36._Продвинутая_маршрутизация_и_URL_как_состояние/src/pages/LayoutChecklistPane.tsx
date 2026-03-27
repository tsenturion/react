import { ListBlock } from '../components/ui';

export function LayoutChecklistPane() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-600">
        Checklist child route показывает другой leaf screen, но использует тот же самый
        parent layout instance.
      </p>
      <ListBlock
        title="Checklist для ветки"
        items={[
          'Sidebar и header должны остаться на месте',
          'Shell note не должен теряться между child routes',
          'Меняется только область, в которую рендерится Outlet',
        ]}
      />
    </div>
  );
}
