export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'flow'
  | 'optimistic'
  | 'rollback'
  | 'confirmation'
  | 'list'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'flow',
    label: '1. Mutation flow',
    blurb:
      'Путь от действия пользователя до optimistic patch, server confirm и финального UI.',
  },
  {
    id: 'optimistic',
    label: '2. Optimistic vs wait',
    blurb: 'Сравнение мгновенного optimistic UX и ожидания server confirmation.',
  },
  {
    id: 'rollback',
    label: '3. Rollback',
    blurb: 'Как optimistic change откатывается при неуспешной мутации.',
  },
  {
    id: 'confirmation',
    label: '4. Pending vs confirmed',
    blurb: 'Где локально показанное значение ещё не равно подтверждённым данным сервера.',
  },
  {
    id: 'list',
    label: '5. List consistency',
    blurb: 'Optimistic add/delete, временные id и согласованность списка при rollback.',
  },
  {
    id: 'architecture',
    label: '6. Architecture',
    blurb: 'Когда optimistic UX оправдан, а когда нужен hybrid или conservative flow.',
  },
] as const;
