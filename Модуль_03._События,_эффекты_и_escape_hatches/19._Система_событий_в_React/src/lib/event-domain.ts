export type HandlerPattern = 'direct' | 'inline' | 'curried';
export type BubbleStop = 'none' | 'button' | 'card';
export type PitfallMode =
  | 'target-vs-currentTarget'
  | 'invoke-during-render'
  | 'arg-wrapper';

export type EventLessonItem = {
  id: string;
  title: string;
  phase: 'capture' | 'bubble' | 'default';
  handled: boolean;
  clicks: number;
};

const eventLessons: readonly EventLessonItem[] = [
  {
    id: 'synthetic-intro',
    title: 'SyntheticEvent intro',
    phase: 'bubble',
    handled: false,
    clicks: 2,
  },
  {
    id: 'propagation-chain',
    title: 'Propagation chain',
    phase: 'bubble',
    handled: true,
    clicks: 5,
  },
  {
    id: 'prevent-default',
    title: 'Prevent default',
    phase: 'default',
    handled: false,
    clicks: 1,
  },
  {
    id: 'native-bridge',
    title: 'React vs DOM bridge',
    phase: 'capture',
    handled: true,
    clicks: 4,
  },
] as const;

export function createEventLessons() {
  return eventLessons.map((item) => ({ ...item }));
}
