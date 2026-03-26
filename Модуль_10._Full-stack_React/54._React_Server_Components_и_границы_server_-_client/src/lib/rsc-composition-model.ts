import type { StatusTone } from './learning-model';
import type { ComponentLayer } from './rsc-boundary-model';

export type LinkMode = 'import' | 'slot';

export function describeCompositionChoice(input: {
  hostLayer: ComponentLayer;
  childLayer: ComponentLayer;
  linkMode: LinkMode;
}) {
  const { hostLayer, childLayer, linkMode } = input;
  let tone: StatusTone = 'success';
  let headline = 'Граница собрана корректно';
  let explanation =
    'Такое сочетание не нарушает модульную границу между server и client слоями.';

  if (hostLayer === 'client' && childLayer === 'server' && linkMode === 'import') {
    tone = 'error';
    headline = 'Client component не может импортировать server component';
    explanation =
      'Модульная зависимость идёт в неверную сторону. Если server output нужен внутри client wrapper, его должен создать родительский server component и передать через slot.';
  } else if (hostLayer === 'client' && childLayer === 'server' && linkMode === 'slot') {
    tone = 'success';
    headline = 'Это допустимая mixed composition';
    explanation =
      'Server parent может заранее собрать server child и передать его client host как children или slot. Сам client host при этом не импортирует server module напрямую.';
  } else if (hostLayer === 'server' && childLayer === 'client' && linkMode === 'slot') {
    tone = 'warn';
    headline = 'Это работает, но slot здесь не обязателен';
    explanation =
      'Server component может и напрямую импортировать client component. Slot-композиция полезнее, когда нужно переиспользовать один и тот же client wrapper вокруг разных server children.';
  } else if (hostLayer === 'server' && childLayer === 'server' && linkMode === 'slot') {
    tone = 'warn';
    headline = 'Корректно, но избыточно';
    explanation =
      'Оба блока и так живут на сервере. Slot не ломает границу, но не даёт дополнительной architectural пользы.';
  } else if (hostLayer === 'client' && childLayer === 'client') {
    tone = 'success';
    headline = 'Это обычное client composition';
    explanation =
      'Оба блока гидрируются в браузере. Такая композиция допустима, но её bundle-стоимость полностью уезжает в клиент.';
  }

  const treeLines =
    linkMode === 'import'
      ? [
          `${hostLayer.toUpperCase()} host imports ${childLayer.toUpperCase()} child`,
          'Import direction формирует настоящую boundary contract.',
          hostLayer === 'client' && childLayer === 'server'
            ? 'Такой import недопустим: client module не знает, как выполнить server module.'
            : 'Такой import согласован с направлением границы.',
        ]
      : [
          `SERVER parent produces ${childLayer.toUpperCase()} child`,
          `${hostLayer.toUpperCase()} host receives that child as slot/children`,
          'Slot-композиция позволяет client wrapper использовать server output без прямого import.',
        ];

  return {
    tone,
    headline,
    explanation,
    treeLines,
    bundleImpact:
      hostLayer === 'client' || childLayer === 'client'
        ? 'В браузер уедет как минимум один client island.'
        : 'Bundle почти не растёт: оба узла остаются server-only.',
  };
}
