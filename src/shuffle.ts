/**
 * Fisher-Yates shuffle algorithm
 * Shuffles an array in place and returns it
 */
export const shuffle = <T>(array: T[]): T[] => {
  return array
    .map((value: T) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};
