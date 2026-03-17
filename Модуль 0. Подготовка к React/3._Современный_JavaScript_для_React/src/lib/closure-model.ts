import { lessonCards } from './js-module-catalog';

export type ClosureAction = {
  id: string;
  label: string;
  capturedBonus: number;
  run: () => string;
};

export type ClosureScenarioInput = {
  initialBonus: number;
  currentBonus: number;
  baseDuration: number;
};

export const createClosureActionPack = (baseBonus: number): ClosureAction[] =>
  lessonCards.slice(0, 3).map((lesson, index) => {
    const capturedBonus = baseBonus + index * 2;

    return {
      id: lesson.id,
      label: lesson.title,
      capturedBonus,
      run: () => `${lesson.title}: ${lesson.duration + capturedBonus} мин`,
    };
  });

export const evaluateClosureScenario = ({
  initialBonus,
  currentBonus,
  baseDuration,
}: ClosureScenarioInput) => {
  const snapshotCalculator = (
    (capturedBonus: number) => (duration: number) =>
      duration + capturedBonus
  )(initialBonus);
  const mutableBox = { bonus: initialBonus };
  const mutableCalculator = (duration: number) => duration + mutableBox.bonus;

  mutableBox.bonus = currentBonus;

  return {
    snapshotDuration: snapshotCalculator(baseDuration),
    mutableDuration: mutableCalculator(baseDuration),
    note: 'Closure хранит значение из момента создания, а общий mutable object читает уже новое значение.',
  };
};
