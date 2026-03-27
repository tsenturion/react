import type { StatusTone } from './learning-model';

export type ConditionalControls = {
  isLoading: boolean;
  showReviewBadge: boolean;
  seatsLeft: number;
  showMentor: boolean;
  isArchived: boolean;
};

export type ConditionalViewModel = {
  title: string;
  loadingMessage: string;
  seatLabel: string;
  seatTone: StatusTone;
  mentorLabel?: string;
  archiveLabel?: string;
  reviewLabel?: string;
  visibleBlocks: string[];
  branchCount: number;
  snippet: string;
};

export const defaultConditionalControls: ConditionalControls = {
  isLoading: false,
  showReviewBadge: true,
  seatsLeft: 8,
  showMentor: true,
  isArchived: false,
};

export function buildConditionalViewModel(
  controls: ConditionalControls,
): ConditionalViewModel {
  if (controls.isLoading) {
    return {
      title: 'Идёт загрузка урока',
      loadingMessage: 'Сначала React рендерит только skeleton, а не весь контент.',
      seatLabel: '',
      seatTone: 'warn',
      visibleBlocks: ['skeleton'],
      branchCount: 1,
      snippet: ['if (isLoading) {', '  return <LoadingCard />;', '}'].join('\n'),
    };
  }

  const seatLabel =
    controls.seatsLeft > 0
      ? `Осталось мест: ${controls.seatsLeft}.`
      : 'Мест нет, открыт только лист ожидания.';

  const visibleBlocks = [
    'header',
    controls.showReviewBadge ? 'review-badge' : null,
    'seat-status',
    controls.showMentor ? 'mentor' : null,
    controls.isArchived ? 'archive-note' : null,
  ].filter((item): item is string => item !== null);

  return {
    title: 'Карточка урока',
    loadingMessage: '',
    seatLabel,
    seatTone: controls.seatsLeft > 0 ? 'success' : 'error',
    mentorLabel: controls.showMentor ? 'Ментор: Ирина' : undefined,
    archiveLabel: controls.isArchived
      ? 'Урок архивирован и больше не обновляется.'
      : undefined,
    reviewLabel: controls.showReviewBadge ? 'Есть live review' : undefined,
    visibleBlocks,
    branchCount: visibleBlocks.length,
    snippet: [
      'return (',
      '  <article>',
      '    {showReviewBadge ? <Badge /> : null}',
      '    <p>{seatsLeft > 0 ? `Осталось мест: ${seatsLeft}.` : "Мест нет."}</p>',
      '    {showMentor && <p>Ментор: Ирина</p>}',
      '    {isArchived ? <ArchiveNote /> : null}',
      '  </article>',
      ');',
    ].join('\n'),
  };
}
