import type { StatusTone } from './learning-model';

export type FallbackProfile = {
  explainsImpact: boolean;
  preservesContext: boolean;
  offersRecovery: boolean;
  isolatesFailure: boolean;
  exposesRawError: boolean;
};

export function evaluateFallbackProfile(profile: FallbackProfile) {
  let score = 0;

  if (profile.explainsImpact) {
    score += 25;
  }
  if (profile.preservesContext) {
    score += 25;
  }
  if (profile.offersRecovery) {
    score += 25;
  }
  if (profile.isolatesFailure) {
    score += 25;
  }
  if (profile.exposesRawError) {
    score -= 10;
  }

  return Math.max(0, Math.min(score, 100));
}

export function fallbackTone(score: number): StatusTone {
  if (score >= 80) {
    return 'success';
  }
  if (score >= 50) {
    return 'warn';
  }
  return 'error';
}
