import type { DependencyStrategy } from './effect-domain';
import type { StatusTone } from './learning-model';

export type LifecycleReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  snippet: string;
  consequences: readonly string[];
};

export function buildLifecycleReport(strategy: DependencyStrategy): LifecycleReport {
  if (strategy === 'complete') {
    return {
      tone: 'success',
      title: 'Полный список зависимостей',
      summary:
        'Effect запускается на mount и затем повторяется только тогда, когда действительно изменилась синхронизируемая часть состояния.',
      snippet: [
        'useEffect(() => {',
        '  syncExternalRoom(roomId, presenceSync);',
        '  return () => disconnectRoom(roomId);',
        '}, [roomId, presenceSync]);',
      ].join('\n'),
      consequences: [
        'Смена комнаты вызывает cleanup старой подписки и setup новой.',
        'Смена флага presenceSync тоже приводит к повторной синхронизации.',
      ],
    };
  }

  return {
    tone: 'warn',
    title: 'Пропущена важная зависимость',
    summary:
      'Если `roomId` не указан в dependencies, effect не узнает, что синхронизируемая комната сменилась, и внешний мир останется на старом значении.',
    snippet: [
      'useEffect(() => {',
      '  syncExternalRoom(roomId, presenceSync);',
      '  return () => disconnectRoom(roomId);',
      '}, [presenceSync]);',
    ].join('\n'),
    consequences: [
      'UI показывает новую комнату, а effect продолжает жить на старой.',
      'Cleanup сработает только при смене тех зависимостей, которые реально указаны.',
    ],
  };
}
