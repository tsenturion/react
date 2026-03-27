import type { StatusTone } from './learning-model';

export type MutableRefCase = 'ref-write' | 'state-write' | 'external-handle';

type MutableRefReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<MutableRefCase, MutableRefReport> = {
  'ref-write': {
    title: 'Mutable value in ref',
    tone: 'success',
    summary:
      'Ref сохраняет значение между render-ами, но его изменение само по себе не создаёт новый render.',
    snippet: [
      'const clicksRef = useRef(0);',
      '',
      'function handleRefWrite() {',
      '  clicksRef.current += 1;',
      '}',
    ].join('\n'),
  },
  'state-write': {
    title: 'State drives UI',
    tone: 'warn',
    summary:
      'State используется там, где изменение должно немедленно перестроить интерфейс и создать новый snapshot render-а.',
    snippet: [
      'const [count, setCount] = useState(0);',
      '',
      'function handleStateWrite() {',
      '  setCount((current) => current + 1);',
      '}',
    ].join('\n'),
  },
  'external-handle': {
    title: 'Timer or external object in ref',
    tone: 'success',
    summary:
      'Идентификатор таймера или объект внешней библиотеки обычно не нужен в JSX, поэтому его удобно держать в ref.',
    snippet: [
      'const timerRef = useRef<number | null>(null);',
      'const playerRef = useRef<Player | null>(null);',
    ].join('\n'),
  },
};

export function buildMutableRefReport(id: MutableRefCase) {
  return reports[id];
}

export function simulateMutableRefFlow(refWrites: number, renderWrites: number) {
  return {
    actualRef: refWrites,
    visibleSnapshot: renderWrites > 0 ? refWrites : 0,
  };
}
