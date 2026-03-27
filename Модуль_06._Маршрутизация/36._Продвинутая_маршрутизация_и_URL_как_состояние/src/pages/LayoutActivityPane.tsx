import { ListBlock } from '../components/ui';

export function LayoutActivityPane() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-600">
        Activity child route полезен как проверка, что parent layout держит общий
        navigation context, а дочерний экран меняется внутри него.
      </p>
      <ListBlock
        title="Признаки хорошего layout route"
        items={[
          'общий chrome не дублируется по нескольким страницам',
          'state родителя переживает переходы между дочерними ветками',
          'child routes отражают разные экраны одной рабочей области',
        ]}
      />
    </div>
  );
}
