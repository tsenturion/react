export type ProgressivePattern = 'spinner' | 'skeleton' | 'shell-first';

export function describeProgressiveLoading(input: { pattern: ProgressivePattern }) {
  switch (input.pattern) {
    case 'spinner':
      return {
        headline: 'Spinner сообщает о загрузке, но легко обнуляет контекст',
        detail:
          'Подходит как минимальный fallback, если слот маленький. На широком блоке быстро начинает ощущаться как пустое ожидание.',
        contextRetention: 'низкое',
        layoutShiftRisk: 'средний',
      };
    case 'skeleton':
      return {
        headline: 'Skeleton удерживает форму будущего интерфейса',
        detail:
          'Он показывает, что именно появится дальше, и уменьшает визуальный скачок, если размеры будущего блока понятны заранее.',
        contextRetention: 'среднее',
        layoutShiftRisk: 'низкий',
      };
    case 'shell-first':
      return {
        headline: 'Shell-first делает интерфейс живым ещё до прихода тяжёлого кода',
        detail:
          'Статичный каркас, summary и действия появляются сразу, а тяжёлый модуль приходит постепенно внутри уже понятного экрана.',
        contextRetention: 'высокое',
        layoutShiftRisk: 'низкий',
      };
  }
}
