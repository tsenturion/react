import type { StatusTone } from './learning-model';

export type StrategyGoal = 'preserve' | 'reset';
export type StrategySituation =
  | 'switch-entity'
  | 'reorder-list'
  | 'visual-layout'
  | 'branch-toggle';

export type StrategyPlaybookReport = {
  tone: StatusTone;
  title: string;
  technique: string;
  why: string;
  risk: string;
  snippet: string;
};

export function buildStateStrategyReport(
  goal: StrategyGoal,
  situation: StrategySituation,
): StrategyPlaybookReport {
  if (goal === 'preserve' && situation === 'switch-entity') {
    return {
      tone: 'success',
      title: 'Отдельные черновики по id',
      technique: 'Поднимите state выше и храните его как map по id сущности.',
      why: 'Так переключение между сущностями не уничтожает и не смешивает локальные черновики.',
      risk: 'Если оставить один local state без id-map, одна сущность начнёт показывать данные другой.',
      snippet: [
        'const [drafts, setDrafts] = useState<Record<string, string>>({});',
        'const draft = drafts[activeId] ?? "";',
      ].join('\n'),
    };
  }

  if (goal === 'reset' && situation === 'switch-entity') {
    return {
      tone: 'success',
      title: 'Сброс по key при смене сущности',
      technique: 'Поставьте key на поддерево, которое должно начаться заново.',
      why: 'React увидит новый identity boundary и переинициализирует local state.',
      risk: 'Если reset не ожидался, несохранённые изменения будут потеряны сразу при переключении.',
      snippet: ['<Editor key={activeId} profile={activeProfile} />'].join('\n'),
    };
  }

  if (goal === 'preserve' && situation === 'reorder-list') {
    return {
      tone: 'success',
      title: 'Стабильный key для списка',
      technique: 'Используйте key, связанный с id данных, а не с позицией.',
      why: 'Тогда локальный state строки остаётся у той же сущности после reorder или filter.',
      risk: 'Index-key привяжет state к месту в массиве и создаст drift после перестановки.',
      snippet: ['{items.map((item) => <Row key={item.id} item={item} />)}'].join('\n'),
    };
  }

  if (goal === 'reset' && situation === 'reorder-list') {
    return {
      tone: 'warn',
      title: 'Принудительный remount списка',
      technique:
        'Меняйте version-key только если действительно нужно очистить все локальные состояния строк.',
      why: 'Это обнуляет row-state целиком и иногда полезно после полного reload набора данных.',
      risk: 'Частое применение ломает предсказуемость интерфейса и убивает reuse без необходимости.',
      snippet: ['<Row key={`${item.id}-${version}`} item={item} />'].join('\n'),
    };
  }

  if (goal === 'preserve' && situation === 'visual-layout') {
    return {
      tone: 'success',
      title: 'Меняйте layout, а не дерево',
      technique:
        'Оставьте один и тот же JSX-узел и двигайте его через CSS order или wrapper props.',
      why: 'Компонент останется в том же slot React tree и удержит local state.',
      risk: 'Если перенести JSX между разными ветками, визуально похожее действие уже приведёт к remount.',
      snippet: ['<div className={dock === "left" ? "lg:order-1" : "lg:order-2"} />'].join(
        '\n',
      ),
    };
  }

  if (goal === 'reset' && situation === 'visual-layout') {
    return {
      tone: 'warn',
      title: 'Развести слоты осознанно',
      technique:
        'Рендерите компонент в разных ветках, только если нужен новый lifecycle при перемещении.',
      why: 'Перемещение между слотами создаёт новый экземпляр и очищает внутренний state.',
      risk: 'Так легко случайно сбросить ввод пользователя при смене layout или docking mode.',
      snippet: [
        "{dock === 'left' ? <InspectorWidget /> : null}",
        "{dock === 'right' ? <InspectorWidget /> : null}",
      ].join('\n'),
    };
  }

  if (goal === 'preserve' && situation === 'branch-toggle') {
    return {
      tone: 'success',
      title: 'Один type, разные props',
      technique: 'Оставьте один и тот же component type в slot и меняйте только props.',
      why: 'React обновит входные данные, но сохранит local state экземпляра.',
      risk: 'Если initial state берётся из props, он не синхронизируется автоматически после первого mount.',
      snippet: [
        '{isAdvanced ? <SharedPanel mode="advanced" /> : <SharedPanel mode="basic" />}',
      ].join('\n'),
    };
  }

  return {
    tone: 'success',
    title: 'Новый lifecycle через type или key',
    technique: 'Если ветка должна начать жизнь заново, смените component type или key.',
    why: 'Так React корректно завершит старое поддерево и создаст новое с чистым state.',
    risk: 'Не используйте этот reset случайно: он влияет не только на state, но и на эффекты, refs и фокус.',
    snippet: ['{isAdvanced ? <AdvancedPanel /> : <BasicPanel />}'].join('\n'),
  };
}
