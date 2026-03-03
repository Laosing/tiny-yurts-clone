/**
 * Game inventory state
 * Tracks resources available to the player
 */

export const inventory = {
  paths: 18,
} as const;

/**
 * Add paths to the inventory
 * @param amount Number of paths to add
 */
export const addPaths = (amount: number): void => {
  inventory.paths += amount;
};

/**
 * Remove paths from the inventory
 * @param amount Number of paths to remove
 */
export const removePaths = (amount: number): void => {
  inventory.paths -= amount;
};

/**
 * Check if there are enough paths available
 * @param amount Number of paths needed
 * @returns Whether enough paths are available
 */
export const hasEnoughPaths = (amount: number): boolean => {
  return inventory.paths >= amount;
};
