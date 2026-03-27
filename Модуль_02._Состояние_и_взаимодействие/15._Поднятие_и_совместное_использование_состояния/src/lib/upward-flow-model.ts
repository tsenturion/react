import type { BookingState } from './shared-state-domain';

export type BookingViewModel = {
  seatPrice: number;
  totalPrice: number;
  actionLabel: string;
  summary: string;
  snippet: string;
};

const tierPricing: Record<BookingState['tier'], number> = {
  starter: 120,
  team: 90,
  intensive: 160,
};

export function buildBookingViewModel(state: BookingState): BookingViewModel {
  const seatPrice = tierPricing[state.tier];
  const totalPrice = seatPrice * state.seats;

  return {
    seatPrice,
    totalPrice,
    actionLabel: state.acceptedRules ? 'Можно подтверждать' : 'Нужно принять правила',
    summary:
      'Дочерние контролы не владеют seats и tier. Они только сообщают изменения вверх через callbacks, а затем родитель раздаёт новое согласованное состояние вниз всем соседним частям экрана.',
    snippet: [
      '<SeatPicker value={seats} onChange={setSeats} />',
      '<TierPicker value={tier} onChange={setTier} />',
      '<Summary seats={seats} tier={tier} />',
    ].join('\n'),
  };
}
