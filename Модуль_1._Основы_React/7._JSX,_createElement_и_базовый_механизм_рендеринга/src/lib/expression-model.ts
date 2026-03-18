import type { StatusTone } from './learning-model';

export type ExpressionCaseId =
  | 'template'
  | 'ternary'
  | 'map'
  | 'optional-nullish'
  | 'if-statement'
  | 'for-loop'
  | 'plain-object'
  | 'mutation';

export type ExpressionScenario = {
  viewerName: string;
  seatsLeft: number;
  tagCount: number;
  authorMode: 'named' | 'missing';
  hasCertificate: boolean;
};

export type ExpressionReport = {
  title: string;
  tone: StatusTone;
  verdict: string;
  why: string;
  previewKind: 'text' | 'list' | 'none';
  previewText: string;
  previewItems: string[];
  example: string;
  fix: string;
};

export const expressionCases: readonly {
  id: ExpressionCaseId;
  label: string;
  group: 'Работает' | 'Ошибка' | 'Опасный паттерн';
}[] = [
  { id: 'template', label: 'Шаблонная строка', group: 'Работает' },
  { id: 'ternary', label: 'Тернарный оператор', group: 'Работает' },
  { id: 'map', label: 'map(...)', group: 'Работает' },
  { id: 'optional-nullish', label: '?. и ??', group: 'Работает' },
  { id: 'if-statement', label: 'if внутри JSX', group: 'Ошибка' },
  { id: 'for-loop', label: 'for внутри JSX', group: 'Ошибка' },
  { id: 'plain-object', label: 'Голый объект', group: 'Ошибка' },
  { id: 'mutation', label: 'Мутация в рендере', group: 'Опасный паттерн' },
] as const;

export const defaultExpressionScenario: ExpressionScenario = {
  viewerName: 'Елена',
  seatsLeft: 4,
  tagCount: 3,
  authorMode: 'named',
  hasCertificate: true,
};

const tagPool = ['JSX', 'Fragments', 'Element tree', 'createElement'] as const;

export function buildExpressionReport(
  caseId: ExpressionCaseId,
  scenario: ExpressionScenario,
): ExpressionReport {
  const tags = tagPool.slice(0, scenario.tagCount);
  const authorName = scenario.authorMode === 'named' ? 'Команда React Core' : undefined;

  switch (caseId) {
    case 'template':
      return {
        title: 'Шаблонная строка',
        tone: 'success',
        verdict: 'Работает корректно.',
        why: 'Шаблонная строка остаётся обычным JavaScript-выражением.',
        previewKind: 'text',
        previewText: `${scenario.viewerName}, открыт доступ к лаборатории JSX.`,
        previewItems: [],
        example: '{`${viewerName}, открыт доступ к лаборатории JSX.`}',
        fix: 'Здесь ничего исправлять не нужно: выражение уже читаемо и чисто.',
      };
    case 'ternary':
      return {
        title: 'Тернарный оператор',
        tone: 'success',
        verdict: 'Подходит для компактного выбора одной из двух веток.',
        why: '`condition ? A : B` возвращает значение, а JSX ждёт именно значение.',
        previewKind: 'text',
        previewText:
          scenario.seatsLeft > 0
            ? `Осталось мест: ${scenario.seatsLeft}.`
            : 'Мест нет, открыт лист ожидания.',
        previewItems: [],
        example:
          '{seatsLeft > 0 ? `Осталось мест: ${seatsLeft}.` : "Мест нет, открыт лист ожидания."}',
        fix: 'Если веток становится больше двух, вынесите выбор в переменную или helper.',
      };
    case 'map':
      return {
        title: 'map(...)',
        tone: 'success',
        verdict: 'Это основной способ развернуть массив в список JSX-узлов.',
        why: '`map(...)` возвращает новый массив значений, который React умеет рендерить.',
        previewKind: 'list',
        previewText: '',
        previewItems: tags.map((tag) => `Тег: ${tag}`),
        example: '{tags.map((tag) => <span key={tag}>{tag}</span>)}',
        fix: 'Главное правило: добавляйте стабильный `key`, чтобы React различал элементы.',
      };
    case 'optional-nullish':
      return {
        title: 'Optional chaining и nullish coalescing',
        tone: 'success',
        verdict: 'Подходит для безопасного доступа к данным без лишних guard-блоков.',
        why: '`?.` и `??` тоже являются выражениями и хорошо читаются внутри JSX.',
        previewKind: 'text',
        previewText: authorName ?? 'Автор ещё не указан.',
        previewItems: [],
        example: '{course.author?.name ?? "Автор ещё не указан."}',
        fix: 'Если fallback сложный, вынесите его в переменную до `return`.',
      };
    case 'if-statement':
      return {
        title: 'if внутри JSX',
        tone: 'error',
        verdict: 'Такой код не скомпилируется.',
        why: '`if` является инструкцией, а не выражением. JSX не может вставить его как значение.',
        previewKind: 'none',
        previewText: '',
        previewItems: [],
        example: '<div>{if (seatsLeft > 0) { return "Есть места"; }}</div>',
        fix: 'Используйте тернарный оператор или посчитайте строку до `return`.',
      };
    case 'for-loop':
      return {
        title: 'for внутри JSX',
        tone: 'error',
        verdict: 'Такой код тоже не подходит для вставки в JSX.',
        why: '`for` не возвращает значение. JSX ждёт итоговый результат вычисления.',
        previewKind: 'none',
        previewText: '',
        previewItems: [],
        example: '<ul>{for (const tag of tags) { <li>{tag}</li>; }}</ul>',
        fix: 'Подготовьте массив до `return` или используйте `tags.map(...)`.',
      };
    case 'plain-object':
      return {
        title: 'Голый объект',
        tone: 'error',
        verdict: 'React не умеет рендерить обычный объект как дочерний узел.',
        why: 'Объект не превращается в текст автоматически и не является valid React child.',
        previewKind: 'none',
        previewText: '',
        previewItems: [],
        example: '<div>{{ level: "base", duration: 45 }}</div>',
        fix: 'Выведите конкретное поле, список полей или строковое представление объекта.',
      };
    case 'mutation':
      return {
        title: 'Мутация в рендере',
        tone: 'warn',
        verdict: 'Синтаксис может сработать, но такой рендер становится нечистым.',
        why: 'Мутация и побочные эффекты внутри JSX ломают предсказуемость повторных рендеров.',
        previewKind: 'text',
        previewText: scenario.hasCertificate
          ? 'Сертификат лучше добавить через чистое условие, а не push(...) во время рендера.'
          : 'Даже без сертификата правило то же: рендер ничего не мутирует.',
        previewItems: [],
        example:
          '{badges.push("Сертификат") && badges.map((badge) => <span key={badge}>{badge}</span>)}',
        fix: 'Соберите новый массив заранее: `const visibleBadges = hasCertificate ? [...badges, "Сертификат"] : badges;`',
      };
  }
}
