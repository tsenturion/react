export type RetryScenario = 'flaky' | 'server-error' | 'empty';

export function buildRetryPlan(maxRetries: number, baseDelayMs: number) {
  return Array.from({ length: maxRetries }, (_, index) => baseDelayMs * (index + 1));
}

export function retryScenarioLabel(scenario: RetryScenario) {
  if (scenario === 'flaky') {
    return 'Временный сбой: первый запрос падает, следующий проходит.';
  }
  if (scenario === 'server-error') {
    return 'Стабильная ошибка сервера: retry не исправляет корень проблемы.';
  }
  return 'Успешный, но пустой ответ: retry здесь не нужен.';
}
