import type { StatusTone } from './learning-model';

export type PlanId = 'starter' | 'team' | 'intensive';

export type EnrollmentState = {
  plan: PlanId;
  seats: number;
  acceptedRules: boolean;
  submitted: boolean;
};

export type EnrollmentViewModel = {
  tone: StatusTone;
  availability: string;
  actionLabel: string;
  summary: string;
  snippet: string;
};

export function buildEnrollmentViewModel(state: EnrollmentState): EnrollmentViewModel {
  const capacityLabel =
    state.seats <= 1 ? 'осталось последнее место' : `доступно ${state.seats} мест`;

  return {
    tone: state.submitted ? 'success' : state.acceptedRules ? 'warn' : 'error',
    availability: capacityLabel,
    actionLabel: state.submitted
      ? 'Заявка сохранена'
      : state.acceptedRules
        ? 'Можно отправлять заявку'
        : 'Нужно принять правила',
    summary:
      'Пользовательское действие сначала меняет state, а уже потом новый рендер переводит интерфейс в другое состояние: блокирует кнопку, меняет подпись, обновляет доступность и подтверждение.',
    snippet: [
      'const [plan, setPlan] = useState("starter");',
      'const [seats, setSeats] = useState(3);',
      'const [acceptedRules, setAcceptedRules] = useState(false);',
      'const [submitted, setSubmitted] = useState(false);',
    ].join('\n'),
  };
}
