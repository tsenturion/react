export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'useid' | 'debug' | 'sync-store' | 'rules' | 'purity' | 'lint';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'useid',
    label: '1. useId',
    blurb: 'Стабильные DOM-id для форм, labels и доступности.',
  },
  {
    id: 'debug',
    label: '2. useDebugValue',
    blurb: 'Как custom hook показывает своё состояние в DevTools.',
  },
  {
    id: 'sync-store',
    label: '3. useSyncExternalStore',
    blurb: 'Подключение React к внешнему store без рассинхрона snapshot-ов.',
  },
  {
    id: 'rules',
    label: '4. Rules of Hooks',
    blurb: 'Почему порядок вызова hooks должен оставаться неизменным.',
  },
  {
    id: 'purity',
    label: '5. Purity и refs',
    blurb: 'Как нарушения чистоты ломают предсказуемость компонента.',
  },
  {
    id: 'lint',
    label: '6. Lint-first',
    blurb: 'eslint-plugin-react-hooks как реальный guardrail, а не формальность.',
  },
] as const;
