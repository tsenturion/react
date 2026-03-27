import type { StatusTone } from './learning-model';

export type ReactNativeReport = {
  tone: StatusTone;
  summary: string;
  differences: readonly string[];
  snippet: string;
};

export function buildReactNativeReport(): ReactNativeReport {
  return {
    tone: 'success',
    summary:
      'React-обработчик получает SyntheticEvent с нормализованным API и доступом к `nativeEvent`, а native listener получает настоящий DOM `MouseEvent` напрямую от браузера.',
    differences: [
      'React handler получает SyntheticEvent, native listener получает DOM Event.',
      'React назначает единый event system поверх дерева приложения, а native listener навешивается точечно через `addEventListener`.',
      'Оба мира видят один и тот же пользовательский клик, но источник события и lifecycle подписки отличаются.',
    ],
    snippet: [
      'useEffect(() => {',
      '  const node = buttonRef.current;',
      '  node?.addEventListener("click", handleNativeClick);',
      '  return () => node?.removeEventListener("click", handleNativeClick);',
      '}, []);',
    ].join('\n'),
  };
}
