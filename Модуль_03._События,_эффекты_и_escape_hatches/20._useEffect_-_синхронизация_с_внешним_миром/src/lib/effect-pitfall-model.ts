import type { EffectPitfallMode } from './effect-domain';
import type { StatusTone } from './learning-model';

export type PitfallReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  badSnippet: string;
  goodSnippet: string;
};

export function buildPitfallReport(mode: EffectPitfallMode): PitfallReport {
  if (mode === 'derived-in-effect') {
    return {
      tone: 'warn',
      title: 'Эффект не должен дублировать обычное вычисление',
      summary:
        'Если значение полностью выводится из current props/state, переносить его в effect не нужно. Это создаёт лишний state и риск рассинхрона.',
      badSnippet: [
        'const [fullName, setFullName] = useState("");',
        'useEffect(() => {',
        '  setFullName(`${firstName} ${lastName}`);',
        '}, [firstName]);',
      ].join('\n'),
      goodSnippet: 'const fullName = `${firstName} ${lastName}`.trim();',
    };
  }

  if (mode === 'unstable-dependency') {
    return {
      tone: 'warn',
      title: 'Нестабильные зависимости заставляют effect срабатывать лишний раз',
      summary:
        'Если в dependencies попадает новый object или function на каждом render, effect повторится даже без реального изменения данных синхронизации.',
      badSnippet: [
        'const options = { roomId };',
        'useEffect(() => {',
        '  connect(options);',
        '}, [options]);',
      ].join('\n'),
      goodSnippet: ['useEffect(() => {', '  connect({ roomId });', '}, [roomId]);'].join(
        '\n',
      ),
    };
  }

  return {
    tone: 'error',
    title: 'Effect, который меняет свою же зависимость, создаёт loop risk',
    summary:
      'Если effect зависит от значения и тут же без условия меняет это же значение, компонент попадает в цепочку render → effect → setState → render.',
    badSnippet: ['useEffect(() => {', '  setCount(count + 1);', '}, [count]);'].join(
      '\n',
    ),
    goodSnippet: [
      'function handleIncrement() {',
      '  setCount((current) => current + 1);',
      '}',
    ].join('\n'),
  };
}

export function getExpectedEffectRuns(
  renders: number,
  dependencyStyle: 'stable' | 'unstable',
) {
  if (renders <= 0) {
    return 0;
  }

  return dependencyStyle === 'stable' ? 1 : renders;
}

export function simulateLoopTrace(steps: number) {
  return Array.from({ length: steps }, (_, index) => {
    const current = index + 1;
    return `render #${current} -> effect читает count=${index} -> setCount(${current})`;
  });
}
