export type InvocationStrategyId = 'manual-api' | 'server-function' | 'client-only';

export function compareInvocationStrategies(input: {
  networkMs: number;
  validationComplexity: number;
}) {
  const validationCost = input.validationComplexity * 35;

  return [
    {
      id: 'manual-api' as const,
      label: 'Manual API',
      handwrittenGlue: 5,
      schemaDuplicationRisk: 'high' as const,
      steps: [
        'Client form собирает payload',
        'onSubmit вызывает fetch к route handler',
        'Handler валидирует payload на сервере',
        'Ответ парсится обратно в клиенте',
        'UI вручную раскладывает pending, error и success',
      ],
      roundTripMs: input.networkMs + validationCost + 120,
      why: 'Гибко, но дорого по ручному glue-коду и по дублированию контракта между клиентом и сервером.',
    },
    {
      id: 'server-function' as const,
      label: 'Server Function',
      handwrittenGlue: 2,
      schemaDuplicationRisk: 'low' as const,
      steps: [
        'Форма пересекает server boundary через submit',
        'Server Function получает сериализуемый payload',
        'Валидация и мутация происходят рядом с серверной логикой',
        'Результат возвращается в форму без отдельного ручного API-слоя',
      ],
      roundTripMs: input.networkMs + validationCost + 60,
      why: 'Сокращает путь от формы до серверной мутации и убирает часть промежуточного full-stack glue.',
    },
    {
      id: 'client-only' as const,
      label: 'Client-only mock',
      handwrittenGlue: 1,
      schemaDuplicationRisk: 'none' as const,
      steps: [
        'Локальная форма меняет только client state',
        'Серверная мутация отсутствует',
        'Данные не синхронизируются с реальной серверной логикой',
      ],
      roundTripMs: 0,
      why: 'Подходит только для purely local UI. Для настоящих данных и прав доступа этот путь не заменяет серверную границу.',
    },
  ] as const;
}
