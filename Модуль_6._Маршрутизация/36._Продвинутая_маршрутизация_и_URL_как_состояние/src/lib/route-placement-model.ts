export type RoutePlacementInput = {
  shareable: boolean;
  hierarchical: boolean;
  selectedEntity: boolean;
  needsBackButton: boolean;
  mustSurviveReload: boolean;
  ephemeral: boolean;
  changesWhileTyping: boolean;
};

export function recommendUrlPlacement(input: RoutePlacementInput) {
  if (input.selectedEntity && (input.shareable || input.needsBackButton)) {
    return {
      model: 'Path param',
      rationale: [
        'У выбранной сущности есть собственная identity, поэтому её естественно кодировать в path.',
        'Back/forward и deep link должны возвращать именно к этой сущности.',
        'Так route tree остаётся читаемым: экран и объект живут в одном адресе.',
      ],
      antiPattern:
        'Не прячьте выбранную сущность только в local state, если экраном нужно делиться и к нему нужно возвращаться через history.',
      score: 93,
    };
  }

  if (input.hierarchical && input.needsBackButton) {
    return {
      model: 'Nested route',
      rationale: [
        'Иерархия экранов выражается через route tree лучше, чем через набор условных блоков.',
        'Общий layout route может держать sidebar, toolbar и локальные заметки родителя.',
        'Child route меняется, а parent layout остаётся смонтированным и сохраняет контекст.',
      ],
      antiPattern:
        'Не имитируйте под-экраны десятком локальных toggle, если переход между ними должен ощущаться как навигация.',
      score: 89,
    };
  }

  if (input.changesWhileTyping && (input.shareable || input.mustSurviveReload)) {
    return {
      model: 'Hybrid URL + local state',
      rationale: [
        'Черновой ввод часто меняется слишком быстро, чтобы писать его в URL на каждый символ.',
        'Итоговый committed state можно держать в query string, а draft оставить локальным.',
        'Так адрес остаётся устойчивым, но экран не начинает шуметь при каждом вводе.',
      ],
      antiPattern:
        'Не сериализуйте в URL каждое промежуточное значение ввода, если пользователю нужен только итоговый применённый результат.',
      score: 74,
    };
  }

  if ((input.shareable || input.mustSurviveReload) && !input.ephemeral) {
    return {
      model: 'Search params',
      rationale: [
        'Экран остаётся тем же, но его режим должен переживать refresh и copy link.',
        'Фильтры, сортировка, tab и panel mode естественно живут в query string.',
        'Один screen route может иметь много устойчивых под-состояний без разрастания route tree.',
      ],
      antiPattern:
        'Не создавайте отдельный path segment для каждой сортировки и вкладки, если экран не меняет сущность и структуру.',
      score: 84,
    };
  }

  if (input.ephemeral && !input.shareable && !input.mustSurviveReload) {
    return {
      model: 'Local state',
      rationale: [
        'Это краткоживущий UI mode, которому не нужен отдельный адрес.',
        'Local state проще и честнее отражает hover, temporary draft или маленький toggle.',
        'URL не должен хранить шум, который не несёт навигационного смысла.',
      ],
      antiPattern:
        'Не записывайте в query string каждую мелкую визуальную реакцию только ради ощущения, что «всё должно быть в URL».',
      score: 33,
    };
  }

  return {
    model: 'Hybrid URL + local state',
    rationale: [
      'Смысловой navigation state живёт в path и query string, а эпизодические детали остаются локальными.',
      'Так адрес остаётся устойчивым, но компонент не превращается в сериализатор каждого пикселя.',
      'Граница между URL и local state строится вокруг shareability и navigation expectations.',
    ],
    antiPattern:
      'Не тащите весь экран целиком в URL и не прячьте всё подряд в local state. Сначала отделите screen identity от краткоживущего UI noise.',
    score: 68,
  };
}
