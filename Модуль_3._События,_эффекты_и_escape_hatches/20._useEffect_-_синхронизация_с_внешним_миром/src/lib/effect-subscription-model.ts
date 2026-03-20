import type { SubscriptionMode } from './effect-domain';
import type { StatusTone } from './learning-model';

export type SubscriptionReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  snippet: string;
};

export function buildSubscriptionReport(mode: SubscriptionMode): SubscriptionReport {
  if (mode === 'cleanup') {
    return {
      tone: 'success',
      title: 'Одна актуальная подписка',
      summary:
        'При смене комнаты старая подписка снимается, поэтому компонент получает только те сообщения, которые относятся к текущему внешнему источнику.',
      snippet: [
        'useEffect(() => {',
        '  const unsubscribe = hub.subscribe(roomId, handlePacket);',
        '  return unsubscribe;',
        '}, [roomId]);',
      ].join('\n'),
    };
  }

  return {
    tone: 'error',
    title: 'Старые подписки продолжают жить',
    summary:
      'Если cleanup не вернуть, компонент будет слушать и старую, и новую комнату одновременно. Это создаёт невидимый drift между UI и внешней системой.',
    snippet: [
      'useEffect(() => {',
      '  hub.subscribe(roomId, handlePacket);',
      '}, [roomId]);',
    ].join('\n'),
  };
}
