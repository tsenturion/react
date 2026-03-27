import type { StatusTone } from './common';
import type { RuntimeMode } from './strict-mode-model';

export type RuntimeModeConfig = {
  mode: RuntimeMode;
  strictMode: boolean;
  hmrEnabled: boolean;
  optimizedBundle: boolean;
};

export function compareRuntimeModes(config: RuntimeModeConfig) {
  const tone: StatusTone =
    config.mode === 'production'
      ? config.optimizedBundle
        ? 'success'
        : 'warn'
      : config.hmrEnabled
        ? 'success'
        : 'warn';

  return {
    tone,
    visibleOutcome:
      config.mode === 'development'
        ? 'Главный акцент на скорость обратной связи: HMR, error overlay, StrictMode checks и удобная отладка.'
        : 'Главный акцент на готовый результат для пользователя: оптимизированный bundle и отсутствие dev-only проверок.',
    togglesMeaning: [
      ...(config.mode === 'development'
        ? ['HMR помогает обновлять UI без полной перезагрузки страницы.']
        : ['В production HMR не нужен: здесь уже важен финальный артефакт сборки.']),
      ...(config.strictMode
        ? [
            'StrictMode-проверки полезны в development, но не меняют production-контракт приложения.',
          ]
        : [
            'Отключённый StrictMode убирает часть dev-сигналов и может скрыть проблемы нечистого кода.',
          ]),
      ...(config.optimizedBundle
        ? ['Production build включает оптимизацию и отдаёт браузеру статические assets.']
        : [
            'Без production-оптимизации сборка ближе к отладочному режиму и менее показательна для финальной доставки.',
          ]),
    ],
    differences: [
      'Development нужен для быстрой итерации и диагностики.',
      'Production нужен для финального runtime-поведения без dev-checks.',
      'Нельзя переносить ожидания StrictMode-дублирования из development в production.',
    ],
    mistakes: [
      'Сравнивать performance production с dev-server напрямую.',
      'Писать код, который зависит от dev-only поведения StrictMode.',
      'Считать HMR частью итоговой логики приложения.',
    ],
  };
}
