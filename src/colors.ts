/* eslint-disable key-spacing */

/**
 * The colors list is also used as a farm type enum, for example instead of:
 * `if (farm.type === 'goat')`, do `if (farm.type === colors.goat)`
 */
export const colors = {
  grass: '#8a5',
  leaf: '#ac6',
  base: '#794',
  yurt: '#fff',
  path: '#dca', // previously #cb9
  ox: '#b75',
  oxHorn: '#dee',
  goat: '#abb', // previously #abb
  fish: '#f80',
  black: '#000',
  ui: '#443',
  red: '#e31',
  grid: '#0001',
  shade: '#0001',
  shade2: '#0002',
  gridRed: '#f002',
} as const;

export const shadowOpacity = 0.12;

export type ColorKey = keyof typeof colors;

/**
 * Get a color value by key with type safety
 */
export const getColor = (key: ColorKey): string => colors[key];
