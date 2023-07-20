import { Meal } from 'knex/types/tables';

interface ISequence {
  badMealIndex: number;
  sequenceCount: number;
  mealsInSequence: Meal[];
}

export function calculateBestMealSequence(allMeals: Meal[]) {
  const sequences: ISequence[] = [];

  let count = 0;
  let mealsInSequence: Meal[] = [];
  allMeals.forEach((meal, index) => {
    if (meal.in_diet) {
      count++;
      mealsInSequence.push(meal);

      if (allMeals[allMeals.length - 1] === meal) {
        sequences.push({
          badMealIndex: index,
          sequenceCount: count,
          mealsInSequence,
        });

        count = 0;
        mealsInSequence = [];
      }
    } else {
      sequences.push({
        badMealIndex: index,
        sequenceCount: count,
        mealsInSequence,
      });

      count = 0;
      mealsInSequence = [];
    }
  });

  const counts: number[] = sequences.map((sequence) => sequence.sequenceCount);
  const betterSequence = sequences[counts.indexOf(Math.max(...counts))];

  return betterSequence.mealsInSequence;
}
