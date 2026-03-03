import { Vector } from '../vector';

/**
 * This is the Kontra.js Updatable object, which GameObject extends.
 * Unfortunately Kontra doesn't export it, so we have it copy-pasted here
 * https://github.com/straker/kontra/blob/main/src/updatable.js
 *
 * Modifications:
 * - Syncing property changes (this._pc) from parent to child has been removed
 */
class Updatable {
  position!: Vector;
  velocity!: Vector;
  acceleration!: Vector;
  isAlive!: boolean;
  _pc!: () => void;

  constructor(properties?: Record<string, unknown>) {
    this.init(properties || {});
  }

  init(properties: Record<string, unknown> = {}): void {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.isAlive = true;
    Object.assign(this, properties);
    this._pc = () => {};
  }

  update(dt: number): void {
    this.advance(dt);
  }

  advance(dt: number): void {
    let acceleration = this.acceleration;

    if (dt) {
      acceleration = acceleration.scale(dt);
    }

    this.velocity = this.velocity.add(acceleration);

    let velocity = this.velocity;

    if (dt) {
      velocity = velocity.scale(dt);
    }

    this.position = this.position.add(velocity);
    this._pc();
  }

  get dx(): number {
    return this.velocity.x;
  }

  get dy(): number {
    return this.velocity.y;
  }

  set dx(value: number) {
    this.velocity.x = value;
  }

  set dy(value: number) {
    this.velocity.y = value;
  }
}

export default Updatable;
