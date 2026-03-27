export type FetchArchitectureInputs = {
  autoOnDependencyChange: boolean;
  needsRetry: boolean;
  needsAbort: boolean;
  sharedAcrossWidgets: boolean;
  crossScreenCaching: boolean;
};

export function recommendFetchArchitecture(inputs: FetchArchitectureInputs) {
  if (inputs.crossScreenCaching || (inputs.sharedAcrossWidgets && inputs.needsRetry)) {
    return {
      approach: 'Server-state layer',
      rationale: [
        'Запросы начинают жить дольше одного компонента.',
        'Нужны shared cache, deduplication и повторное использование данных между экранами.',
        'На этом уровне inline fetch и локальный hook уже становятся тесными.',
      ],
      antiPattern:
        'Не пытайтесь вручную воспроизвести cache, dedupe и stale management в каждом компоненте.',
      score: 92,
    };
  }

  if (inputs.autoOnDependencyChange || inputs.needsAbort || inputs.needsRetry) {
    return {
      approach: 'Dedicated request hook',
      rationale: [
        'Логика запроса уже не помещается в один обработчик клика.',
        'Нужно держать рядом lifecycle, abort, retry и защиту от stale responses.',
        'Хук позволяет сохранить компонент читаемым и свести сетевую модель к одному контракту.',
      ],
      antiPattern:
        'Не размазывайте loading/error/data/abort-логику по нескольким useEffect и случайным флагам.',
      score: 78,
    };
  }

  return {
    approach: 'Inline fetch handler',
    rationale: [
      'Запрос стартует по явному действию пользователя.',
      'Нет сложного lifecycle и повторного использования между несколькими частями интерфейса.',
      'Простой обработчик клика остаётся самым прозрачным решением.',
    ],
    antiPattern:
      'Не выносите такой запрос в отдельную абстракцию только ради самого факта абстракции.',
    score: 58,
  };
}
