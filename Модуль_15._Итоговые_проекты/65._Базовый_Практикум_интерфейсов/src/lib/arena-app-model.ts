import type { SubmittedRegistration } from './registration-model';
import type { RosterMember, RosterTrack } from './roster-data';

export type MatchSeats = {
  X: string | null;
  O: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function trackFromFocus(focus: SubmittedRegistration['focus']): RosterTrack {
  if (focus === 'game') {
    return 'state';
  }

  if (focus === 'forms') {
    return 'forms';
  }

  return 'architecture';
}

function projectFromFocus(focus: SubmittedRegistration['focus']) {
  if (focus === 'game') {
    return 'Арена Tic-Tac-Toe и матч-лог';
  }

  if (focus === 'forms') {
    return 'Поток регистрации и подтверждения';
  }

  return 'Реестр участников и система фильтров';
}

function mentorFromTrack(track: RosterTrack) {
  if (track === 'state') {
    return 'Антон Воробьёв';
  }

  if (track === 'forms') {
    return 'Мария Тихонова';
  }

  return 'Лев Смирнов';
}

function progressFromExperience(experience: SubmittedRegistration['experience']) {
  if (experience === 'junior') {
    return 72;
  }

  if (experience === 'switcher') {
    return 56;
  }

  return 38;
}

function statusFromExperience(experience: SubmittedRegistration['experience']) {
  return experience === 'junior' ? 'ready' : 'review';
}

export function createRosterMemberFromRegistration(
  payload: SubmittedRegistration,
  existingRows: readonly RosterMember[],
): RosterMember {
  const track = trackFromFocus(payload.focus);
  const baseId = slugify(payload.fullName);
  const id = existingRows.some((row) => row.id === baseId)
    ? `${baseId}-${existingRows.length + 1}`
    : baseId;

  return {
    id,
    name: payload.fullName,
    city: payload.city,
    email: payload.email,
    track,
    status: statusFromExperience(payload.experience),
    progress: progressFromExperience(payload.experience),
    mentor: mentorFromTrack(track),
    project: projectFromFocus(payload.focus),
    accessibilityFocus: payload.focus === 'forms' || payload.focus === 'data',
    bio: payload.bio,
    teamName: payload.teamName,
    wantsDigest: payload.wantsDigest,
  };
}

export function assignSeat(
  currentSeats: MatchSeats,
  seat: keyof MatchSeats,
  participantId: string,
): MatchSeats {
  const otherSeat: keyof MatchSeats = seat === 'X' ? 'O' : 'X';

  return {
    ...currentSeats,
    [seat]: participantId,
    [otherSeat]:
      currentSeats[otherSeat] === participantId ? null : currentSeats[otherSeat],
  };
}
