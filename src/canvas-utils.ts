/**
 * Utility functions for Canvas rendering
 */
import { gridCellSize } from './svg';

/**
 * Convert grid cell index to canvas pixel coordinate
 * @param c Grid cell index
 * @returns Canvas pixel coordinate
 */
export const toCanvasCoord = (c: number): number =>
  gridCellSize / 2 + c * gridCellSize;

/**
 * Convert game object coordinates to canvas pixel coordinates
 * @param object Object with x, y in grid coordinates
 * @returns Canvas pixel coordinates
 */
export const toCanvasCoords = (object: { x: number; y: number }): { x: number; y: number } => ({
  x: (object.x + boardOffsetX) * gridCellSize,
  y: (object.y + boardOffsetY) * gridCellSize,
});
