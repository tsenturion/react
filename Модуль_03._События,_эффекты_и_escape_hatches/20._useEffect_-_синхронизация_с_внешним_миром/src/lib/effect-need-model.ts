import type { EffectScenario } from './effect-domain';
import type { StatusTone } from './learning-model';

export type EffectNeedReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  guidance: string;
  snippet: string;
  needsEffect: boolean;
};

export function derivePreviewLabel(firstName: string, lastName: string, track: string) {
  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  return `${fullName || 'Без имени'} · ${track}`;
}

export function buildEffectNeedReport(scenario: EffectScenario): EffectNeedReport {
  switch (scenario) {
    case 'derived-value':
      return {
        tone: 'success',
        title: 'Effect не нужен',
        summary:
          'Если значение можно получить прямо из текущих props и state, его лучше вычислять в render как обычное выражение.',
        guidance:
          'Не дублируйте вычисляемые данные в состоянии. Это создаёт лишний источник истины и открывает путь к drift.',
        snippet: 'const fullName = `${firstName} ${lastName}`.trim();',
        needsEffect: false,
      };
    case 'document-title':
      return {
        tone: 'warn',
        title: 'Нужен effect для синхронизации с браузером',
        summary:
          '`document.title` находится вне React state tree, поэтому его обновление относится к синхронизации с внешней системой.',
        guidance:
          'Effect здесь не вычисляет UI, а синхронизирует внешний мир с уже отрендеренным состоянием интерфейса.',
        snippet: ['useEffect(() => {', '  document.title = title;', '}, [title]);'].join(
          '\n',
        ),
        needsEffect: true,
      };
    case 'timer':
      return {
        tone: 'warn',
        title: 'Таймер живёт вне render',
        summary:
          'Interval или timeout создают внешний процесс, который нужно запускать и останавливать через effect и cleanup.',
        guidance:
          'Без cleanup таймер продолжит работать после смены зависимостей или unmount компонента.',
        snippet: [
          'useEffect(() => {',
          '  const id = window.setInterval(tick, delay);',
          '  return () => window.clearInterval(id);',
          '}, [delay]);',
        ].join('\n'),
        needsEffect: true,
      };
    case 'subscription':
      return {
        tone: 'warn',
        title: 'Подписка требует setup и cleanup',
        summary:
          'Внешний emitter, socket или browser event listener нужно подключить и затем снять, когда зависимость изменилась или компонент ушёл.',
        guidance:
          'Если cleanup пропустить, старые подписки продолжат присылать события и интерфейс потеряет синхронность.',
        snippet: [
          'useEffect(() => {',
          '  const unsubscribe = hub.subscribe(roomId, handlePacket);',
          '  return unsubscribe;',
          '}, [roomId]);',
        ].join('\n'),
        needsEffect: true,
      };
    case 'fetch':
      return {
        tone: 'warn',
        title: 'Запрос к данным тоже является внешней синхронизацией',
        summary:
          'Сетевой запрос начинается не из render, а из effect, потому что он обращается к внешней системе и имеет lifecycle.',
        guidance:
          'Важно продумать cleanup, чтобы устаревший ответ не перезаписывал более новое состояние интерфейса.',
        snippet: [
          'useEffect(() => {',
          '  const controller = new AbortController();',
          '  fetch(url, { signal: controller.signal });',
          '  return () => controller.abort();',
          '}, [url]);',
        ].join('\n'),
        needsEffect: true,
      };
    case 'form-reset':
      return {
        tone: 'success',
        title: 'Effect не нужен, если задача решается обычным вычислением',
        summary:
          'Частая ошибка: переносить в effect вычисление, которое можно сделать прямо в render или в обработчике событий.',
        guidance:
          'Сначала спросите себя, есть ли вообще внешняя система. Если нет, вероятно, достаточно обычного JS-кода.',
        snippet: 'const visibleItems = items.filter((item) => item.active);',
        needsEffect: false,
      };
  }
}
