import type { StatusTone } from './common';

export type SandboxView = 'none' | 'counter' | 'message';

export type RootLifecycleSnapshot = {
  hostPresent: boolean;
  rootCreated: boolean;
  treeMounted: boolean;
  activeView: SandboxView;
  logCount: number;
};

export function describeRootLifecycle(snapshot: RootLifecycleSnapshot) {
  const tone: StatusTone =
    snapshot.hostPresent && snapshot.rootCreated && snapshot.treeMounted
      ? 'success'
      : snapshot.hostPresent && snapshot.rootCreated
        ? 'warn'
        : 'error';

  const allowedActions = [
    ...(!snapshot.rootCreated && snapshot.hostPresent ? ['Создать React Root'] : []),
    ...(snapshot.rootCreated ? ['Смонтировать поддерево через `root.render(...)`'] : []),
    ...(snapshot.treeMounted ? ['Обновить дерево новым `root.render(...)`'] : []),
    ...(snapshot.rootCreated ? ['Размонтировать через `root.unmount()`'] : []),
    ...(snapshot.hostPresent
      ? ['Убрать host-контейнер из DOM']
      : ['Вернуть host-контейнер в DOM']),
  ];

  return {
    tone,
    allowedActions,
    stateLabel:
      snapshot.rootCreated && snapshot.treeMounted
        ? 'Root создан и сейчас обслуживает смонтированное React-поддерево.'
        : snapshot.rootCreated
          ? 'Root уже создан, но внутри него пока нет активного дерева.'
          : snapshot.hostPresent
            ? 'DOM-контейнер есть, но React Root ещё не создан.'
            : 'Нет даже DOM-контейнера, значит создавать Root пока некуда.',
    visibleUI:
      snapshot.activeView === 'counter'
        ? 'В контейнере живёт отдельный интерактивный counter-root.'
        : snapshot.activeView === 'message'
          ? 'В контейнере живёт альтернативное React-поддерево с текстовым виджетом.'
          : 'Контейнер либо пуст, либо root уже размонтирован.',
    risks: [
      ...(snapshot.rootCreated && !snapshot.hostPresent
        ? [
            'Если DOM-контейнер исчезнет, root нужно корректно очистить и не держать висящую ссылку.',
          ]
        : []),
      ...(snapshot.hostPresent && !snapshot.rootCreated
        ? [
            'Наличие контейнера ещё не означает, что React-приложение уже подключено к DOM.',
          ]
        : []),
      ...(snapshot.rootCreated && !snapshot.treeMounted
        ? [
            'Созданный root без `root.render(...)` сам по себе ничего не показывает на экране.',
          ]
        : []),
      'Создание и очистка root должны быть симметричны: `createRoot(...)` и `root.unmount()` идут парой.',
    ],
  };
}
