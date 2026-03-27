export type RoomId = 'release' | 'preview' | 'ops';
export type PulseTheme = 'calm' | 'contrast' | 'night';

export type PulseDetail = {
  roomId: RoomId;
  sequence: number;
};

export const roomOptions: readonly { value: RoomId; label: string }[] = [
  { value: 'release', label: 'Release room' },
  { value: 'preview', label: 'Preview room' },
  { value: 'ops', label: 'Ops room' },
] as const;

export const pulseThemeOptions: readonly { value: PulseTheme; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'contrast', label: 'Contrast' },
  { value: 'night', label: 'Night' },
] as const;

export function buildPulseMessage(detail: PulseDetail, theme: PulseTheme) {
  return `${detail.roomId} #${detail.sequence} rendered with ${theme} theme`;
}

export function describeResubscribeRisk(usesEffectEvent: boolean) {
  return usesEffectEvent
    ? 'Тема и форматирование меняются без пересоздания подписки.'
    : 'Любое изменение темы заставляет effect пересоздать подписку.';
}
