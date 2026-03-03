/**
 * Vector adapter that wraps Excalibur's Vector
 * Maintains API compatibility with existing custom Vector implementation
 */
import { Vector as ExVector } from 'excalibur';

/**
 * Simple Vector class for 2D math operations
 * Replaces Excalibur's ex.Vector
 */
export class Vector {
  private exVector: ExVector;

  constructor(x: number, y: number) {
    this.exVector = new ExVector(x, y);
  }

  get x(): number {
    return this.exVector.x;
  }

  set x(value: number): void {
    this.exVector.x = value;
  }

  get y(): number {
    return this.exVector.y;
  }

  set y(value: number): void {
    this.exVector.y = value;
  }

  get size(): number {
    return this.exVector.size;
  }

  distance(other: Vector): number {
    return this.exVector.distance(other.exVector);
  }

  subtract(other: Vector): Vector {
    return new Vector(
      this.exVector.x - other.exVector.x,
      this.exVector.y - other.exVector.y,
    );
  }

  add(other: Vector): Vector {
    return new Vector(
      this.exVector.x + other.exVector.x,
      this.exVector.y + other.exVector.y,
    );
  }

  normalize(): Vector {
    const magnitude = this.size;
    if (magnitude === 0) return new Vector(0, 0);
    return new Vector(
      this.exVector.x / magnitude,
      this.exVector.y / magnitude,
    );
  }

  scale(scalar: number): Vector {
    return new Vector(
      this.exVector.x * scalar,
      this.exVector.y * scalar,
    );
  }

  set(other: Vector): void {
    this.exVector.x = other.exVector.x;
    this.exVector.y = other.exVector.y;
  }
}

/**
 * Rotate a vector by an angle (in radians)
 * @param vector - The vector to rotate
 * @param angle - The angle in radians
 * @returns A new rotated vector
 */
export const rotateVector = (vector: Vector, angle: number): Vector => {
  return new Vector(
    vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
  );
};

/**
 * Combine two vectors by adding them, then scaling to match the first vector's magnitude
 * @param vectorA - The first vector
 * @param vectorB - The second vector
 * @returns A combined vector with the magnitude of vectorA
 */
export const combineVectors = (vectorA: Vector, vectorB: Vector): Vector => {
  const magnitude = vectorA.size;
  const result = vectorA.add(vectorB);
  const resultMagnitude = result.size;

  if (resultMagnitude === 0) return new Vector(0, 0);

  return result.scale(magnitude / resultMagnitude);
};
