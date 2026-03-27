import type { LabId } from './learning-model';

export type AccessibilityFocus =
  | 'all'
  | 'labels'
  | 'keyboard'
  | 'semantics'
  | 'testing'
  | 'architecture';

export type AccessibilityGuide = {
  id: string;
  focus: Exclude<AccessibilityFocus, 'all'>;
  title: string;
  summary: string;
  signal: string;
  caution: string;
};

export const accessibilityGuides: readonly AccessibilityGuide[] = [
  {
    id: 'labels-guide',
    focus: 'labels',
    title:
      'Accessible name должен рождаться из интерфейса, а не из случайного placeholder',
    summary:
      'Поле становится понятным, когда его имя видно глазу и связано с контролом. Подсказка и ошибка тоже должны входить в наблюдаемую модель поля.',
    signal:
      'Проверяйте, что label фокусирует контрол, а ошибка и helper text доходят до aria-describedby.',
    caution:
      'Placeholder, отдельно стоящий текст и дублирующий aria-label создают неустойчивую и часто противоречивую модель поля.',
  },
  {
    id: 'keyboard-guide',
    focus: 'keyboard',
    title: 'Keyboard support начинается не с hotkeys, а с предсказуемого порядка фокуса',
    summary:
      'Диалог, меню и кнопки должны открываться, закрываться и возвращать фокус так, чтобы экран можно было пройти без мыши.',
    signal:
      'Смотрите, возвращается ли фокус к триггеру и можно ли пройти путь через Tab и Escape без ловушек.',
    caution:
      'Click-only div, потерянный фокус после закрытия диалога и отсутствие Escape превращают сценарий в тупик.',
  },
  {
    id: 'semantics-guide',
    focus: 'semantics',
    title:
      'Native HTML даёт роли и поведение дешевле и надёжнее, чем ручное исправление через ARIA',
    summary:
      'Когда действие выражено через button, а структура через nav, main и headings, браузер и assistive tech уже понимают интерфейс без лишней магии.',
    signal:
      'Сначала ищите native element. Только если его не хватает, добавляйте ровно тот ARIA-слой, который закрывает реальный пробел.',
    caution:
      'Лишний или неверный ARIA часто скрывает доступное имя, ломает ожидания по роли и маскирует плохую структуру.',
  },
  {
    id: 'testing-guide',
    focus: 'testing',
    title: 'Accessibility тестируется языком ролей, имён и keyboard-поведения',
    summary:
      'User-centric test спрашивает не о className, а о том, можно ли найти поле по имени, увидеть alert и пройти путь с клавиатуры.',
    signal:
      'Используйте role-based queries, проверки accessible name и сценарии с user-event.',
    caution:
      'Тесты по DOM-shape или классам не страхуют регрессии имени, роли и keyboard-пути.',
  },
  {
    id: 'architecture-guide',
    focus: 'architecture',
    title:
      'Доступность становится архитектурой, когда влияет на форму, маршрут, события и сообщения о состоянии',
    summary:
      'Форма, диалог, навигация и async-status должны проектироваться вместе. Тогда a11y перестаёт быть финальным патчем перед релизом.',
    signal:
      'Определяйте заранее, где нужны landmarks, где экран меняется через route, а где статус обязан объявляться явно.',
    caution:
      'Если думать о доступности в конце, придётся латать имена, фокус и тесты поверх уже хрупкой структуры.',
  },
] as const;

export const shellAccessibilitySurfaces = [
  {
    id: 'skip-link',
    label: 'skip link -> #lesson-content',
    purpose:
      'Даёт быстрый переход мимо меню лабораторий прямо к основному содержимому урока.',
  },
  {
    id: 'landmarks',
    label: 'header / nav / main / footer',
    purpose:
      'Shell страницы уже разбит на landmarks, поэтому навигация по областям видна и в коде, и в реальном интерфейсе.',
  },
  {
    id: 'nav-label',
    label: 'nav[aria-label="Лаборатории урока"]',
    purpose:
      'Область навигации получает явное имя, чтобы отличаться от других списков ссылок на странице.',
  },
  {
    id: 'route-announcement',
    label: 'aria-live для активной лаборатории',
    purpose:
      'Маршрутный shell сообщает о смене активной лаборатории без ручного обновления всего экрана.',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  if (pathname.startsWith('/labels-and-names')) return 'labels';
  if (pathname.startsWith('/keyboard-and-focus')) return 'keyboard';
  if (pathname.startsWith('/semantics-and-roles')) return 'semantics';
  if (pathname.startsWith('/testing-and-audits')) return 'testing';
  if (pathname.startsWith('/a11y-architecture')) return 'architecture';

  return 'overview';
}
