/**
 * Core game entity interfaces for TypeScript type safety
 */

export interface GameEntity {
  x: number;
  y: number;
  type: string;
  width?: number;
  height?: number;
  children?: GameEntity[];
  parent?: GameEntity;
  isAlive?: boolean;
  showWarn?(): void;
  hideWarn?(): void;
}

export interface PathPoint {
  x: number;
  y: number;
  fixed?: boolean;
  stone?: boolean;
}

export interface GridCell {
  x: number;
  y: number;
  neighbors: GridCell[];
}

export interface PathRoute {
  x: number;
  y: number;
  distance?: number;
}

export type FarmType = 'ox' | 'goat' | 'fish';

export type AudioNote = [
  number,  // frequencyIndex
  number,  // noteLength
  number,  // playbackRate
  number,  // pingyness
  number,  // volume
  number,  // lowpassFrequency
  number,  // highpassFrequency
];

export interface AudioSettings {
  on: boolean;
}

export interface GameState {
  gameStarted: boolean;
  gamePaused: boolean;
  totalUpdateCount: number;
}

export interface FarmProperties {
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: string;
  fenceColor: string;
  needyness: number;
  delay?: number;
  relativePathPoints?: PathPoint[];
}

export interface AnimalProperties {
  x: number;
  y: number;
  type: string;
  color: string;
  isBaby?: boolean;
  rotation?: number;
  roundness?: number;
  parent: GameEntity;
}

export interface PersonProperties {
  x: number;
  y: number;
  parent: GameEntity;
}

export interface YurtProperties {
  x: number;
  y: number;
  type: string;
  facing: { x: number; y: number };
}
