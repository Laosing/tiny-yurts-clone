/**
 * Returns a random index based on weighted probabilities
 * @param weights Array of weights (numbers)
 * @returns Random index or undefined if weights is empty
 */
export const weightedRandom = (weights: number[]): number | undefined => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];

    if (randomValue < cumulativeWeight) {
      return i;
    }
  }

  return undefined;
};
