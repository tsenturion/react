import type { StatusTone } from './learning-model';

export type HtmlVsJsxRuleId =
  | 'className'
  | 'htmlFor'
  | 'camelCase'
  | 'styleObject'
  | 'booleanProp'
  | 'selfClosing';

export type HtmlVsJsxRule = {
  id: HtmlVsJsxRuleId;
  label: string;
  tone: StatusTone;
  htmlExample: string;
  jsxExample: string;
  reason: string;
  impact: string;
};

export const htmlVsJsxRules: readonly HtmlVsJsxRule[] = [
  {
    id: 'className',
    label: '`class` → `className`',
    tone: 'success',
    htmlExample: '<section class="card">...</section>',
    jsxExample: '<section className="card">...</section>',
    reason:
      'В JSX `class` конфликтует с синтаксисом JavaScript, поэтому React использует `className`.',
    impact:
      'Если оставить `class`, появится предупреждение и сломается единый API для props.',
  },
  {
    id: 'htmlFor',
    label: '`for` → `htmlFor`',
    tone: 'success',
    htmlExample: '<label for="email">Email</label>',
    jsxExample: '<label htmlFor="email">Email</label>',
    reason:
      '`for` уже занято в JavaScript, поэтому связка label с input в JSX оформляется через `htmlFor`.',
    impact:
      'Так сохраняется корректная связь label и поля и не появляется конфликт с JS-синтаксисом.',
  },
  {
    id: 'camelCase',
    label: 'DOM props в camelCase',
    tone: 'success',
    htmlExample: '<button onclick="save()" tabindex="0">Save</button>',
    jsxExample: '<button onClick={save} tabIndex={0}>Save</button>',
    reason:
      'В JSX DOM-свойства следуют стилю JavaScript-API браузера, а не строковым HTML-атрибутам.',
    impact:
      'Это особенно важно для событий, фокуса и доступности: `tabIndex`, `onKeyDown`, `onMouseEnter`.',
  },
  {
    id: 'styleObject',
    label: '`style` как объект',
    tone: 'warn',
    htmlExample: '<div style="color: tomato; gap: 12px"></div>',
    jsxExample: '<div style={{ color: "tomato", gap: 12 }} />',
    reason:
      'В JSX `style` принимает объект, потому что вы уже находитесь внутри JavaScript-выражения.',
    impact:
      'Числа, camelCase-ключи и вычисления становятся предсказуемыми для React и TypeScript.',
  },
  {
    id: 'booleanProp',
    label: 'Boolean props',
    tone: 'warn',
    htmlExample: '<button disabled="disabled">...</button>',
    jsxExample: '<button disabled>...</button>',
    reason: 'В JSX boolean props лучше передавать как boolean, а не как строку.',
    impact:
      'Это важно для `disabled`, `checked`, `required`, `readOnly` и других состояний интерфейса.',
  },
  {
    id: 'selfClosing',
    label: 'Self-closing tags',
    tone: 'success',
    htmlExample: '<img src="/cover.png">',
    jsxExample: '<img src="/cover.png" alt="Обложка" />',
    reason:
      'JSX требует явно закрывать элементы без детей, потому что это формальное выражение с однозначной структурой.',
    impact:
      'Без `/>` JSX не скомпилируется, а с явным закрытием дерево читается однозначно.',
  },
] as const;

export const defaultHtmlVsJsxRuleId: HtmlVsJsxRuleId = 'className';

export function getHtmlVsJsxRule(id: HtmlVsJsxRuleId) {
  return htmlVsJsxRules.find((rule) => rule.id === id) ?? htmlVsJsxRules[0];
}
