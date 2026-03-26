export type ServerFunctionPattern =
  | 'server-form-action'
  | 'client-island-calls-server-function'
  | 'manual-api-still-better'
  | 'client-only';

export function chooseServerFunctionStrategy(input: {
  submitDriven: boolean;
  needsBrowserApi: boolean;
  needsProtectedWrite: boolean;
  wantsMinimalGlue: boolean;
  expectsInstantTyping: boolean;
  payloadSerializable: boolean;
}) {
  if (!input.payloadSerializable) {
    return {
      primaryPattern: 'manual-api-still-better' as const,
      title: 'Нужен другой контракт передачи данных',
      why: 'Если payload не сериализуется для server boundary, прямой server function вызов не даст устойчивую архитектуру.',
      antiPattern:
        'Не пытайтесь протащить несериализуемые значения через server function “как-нибудь”.',
      steps: [
        'Сначала упростите payload или выделите другой transport contract.',
        'Потом решайте, нужен ли server function или отдельный API слой.',
        'Не смешивайте browser-only объекты с серверной мутацией.',
      ],
    };
  }

  if (input.submitDriven && input.needsProtectedWrite && input.wantsMinimalGlue) {
    return {
      primaryPattern: 'server-form-action' as const,
      title: 'Форма + server function — лучший старт',
      why: 'Submit-driven поток, защищённая серверная мутация и желание убрать ручной API glue отлично совпадают с формой, пересекающей server boundary.',
      antiPattern:
        'Не оборачивайте такой сценарий обратно в ручной fetch и дублирующий submit state.',
      steps: [
        'Client island держит поля формы и локальный feedback.',
        'Submit пересекает server boundary и запускает мутацию.',
        'Pending, errors и result возвращаются обратно в форму как единый поток.',
      ],
    };
  }

  if (
    (input.needsBrowserApi || input.expectsInstantTyping) &&
    input.needsProtectedWrite
  ) {
    return {
      primaryPattern: 'client-island-calls-server-function' as const,
      title: 'Оставьте UI в client island, а мутацию вынесите в server function',
      why: 'Browser-driven interaction остаётся на клиенте, но сама защищённая запись и бизнес-правила всё равно живут на сервере.',
      antiPattern:
        'Не переносите из-за этого весь surrounding page в client-heavy режим.',
      steps: [
        'Interactive subtree живёт в client.',
        'Серверная мутация вызывается в явной точке click/submit.',
        'Только сервер решает права и итоговую запись данных.',
      ],
    };
  }

  if (input.expectsInstantTyping || input.needsBrowserApi) {
    return {
      primaryPattern: 'client-only' as const,
      title: 'Это client-driven сценарий',
      why: 'Если здесь нет защищённой серверной мутации, а главное — мгновенный локальный цикл, server function не даст архитектурного выигрыша.',
      antiPattern:
        'Не добавляйте серверную границу только потому, что технология доступна.',
      steps: [
        'Оставьте быстрый локальный цикл на клиенте.',
        'Добавляйте серверный вызов только в явной точке сохранения или публикации.',
        'Отделяйте локальный preview от реальной серверной записи.',
      ],
    };
  }

  return {
    primaryPattern: 'manual-api-still-better' as const,
    title: 'Нужен осознанный выбор transport слоя',
    why: 'Не каждый full-stack сценарий автоматически выигрывает от server functions. Иногда отдельный API слой остаётся более прозрачным или интеграционно удобным.',
    antiPattern:
      'Не считайте server functions обязательной заменой любого существующего API.',
    steps: [
      'Проверьте, есть ли реальный submit boundary.',
      'Сравните цену миграции с выигрышем по glue-коду.',
      'Выбирайте transport по архитектуре, а не по моде.',
    ],
  };
}
