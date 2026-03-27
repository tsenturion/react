export type MutationUxInputs = {
  reversible: boolean;
  destructive: boolean;
  serverCanonicalizes: boolean;
  instantFeedbackMatters: boolean;
  highRisk: boolean;
};

export function recommendMutationUx(inputs: MutationUxInputs) {
  if (inputs.highRisk || (inputs.destructive && !inputs.reversible)) {
    return {
      approach: 'Conservative UX',
      rationale: [
        'Ошибка слишком дорогая, чтобы показывать подтверждение раньше сервера.',
        'Пользователь должен видеть, что операция ещё не завершена.',
        'Лучше заплатить задержкой, чем выдать неподтверждённый факт за реальный итог.',
      ],
      antiPattern:
        'Не показывайте как выполненное действие, которое нельзя безопасно откатить.',
      score: 90,
    };
  }

  if (inputs.serverCanonicalizes || inputs.destructive) {
    return {
      approach: 'Hybrid UX',
      rationale: [
        'Интерфейс может дать быстрый локальный отклик, но обязан явно маркировать pending state.',
        'Сервер может вернуть не ровно то значение, которое вы уже показали локально.',
        'Пользователь должен видеть разницу между ожиданием и подтверждённым результатом.',
      ],
      antiPattern:
        'Не прячьте pending state, если сервер вправе нормализовать, отклонить или изменить итог операции.',
      score: 74,
    };
  }

  if (inputs.reversible && inputs.instantFeedbackMatters) {
    return {
      approach: 'Optimistic UX',
      rationale: [
        'Операция дёшево откатывается и пользователь сильно выигрывает от мгновенного отклика.',
        'Даже если сервер ответит позже, rollback не разрушит доверие к интерфейсу.',
        'Операция не несёт высокой цены ошибки и не зависит от сложной серверной валидации.',
      ],
      antiPattern:
        'Не тяните optimistic UX в сценарии, где rollback болезнен или почти невозможен.',
      score: 86,
    };
  }

  return {
    approach: 'Conservative UX',
    rationale: [
      'Здесь мгновенный optimistic патч не даёт достаточно пользы, чтобы оправдать дополнительную сложность.',
      'Лучше показать progress и дождаться server confirmation.',
      'Простой поток подтверждения делает поведение интерфейса прозрачнее.',
    ],
    antiPattern:
      'Не усложняйте mutation flow optimistic-слоем там, где пользователь почти не выигрывает по времени.',
    score: 56,
  };
}
