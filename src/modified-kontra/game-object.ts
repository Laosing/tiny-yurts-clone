import Updatable from './updatable';
import type { GameEntity } from '../types';

/**
 * This is the Kontra.js GameObject, with canvas/context and more ripped out
 * https://github.com/straker/kontra/blob/main/src/gameObject.js
 */
class GameObject extends Updatable {
  _w: number;
  _h: number;
  _c: GameEntity[];
  _rf: () => void;
  _uf: (dt?: number) => void;

  init({
    width = 1,
    height = 1,
    render = this.draw,
    update = this.advance,
    children = [],
    ...props
  }: {
    width?: number;
    height?: number;
    render?: () => void;
    update?: (dt?: number) => void;
    children?: GameEntity[];
    isAlive?: boolean;
    [key: string]: unknown;
  } = {}): void {
    this._c = [];

    // Extract isAlive before passing to super to handle it separately
    const { isAlive, ...remainingProps } = props as { isAlive?: boolean; [key: string]: unknown };

    super.init({
      width,
      height,
      ...remainingProps
    });

    // Handle isAlive separately since it's a direct property on Updatable
    if (isAlive !== undefined) {
      this.isAlive = isAlive;
    }

    this.addChild(children);

    // rf = render function
    this._rf = render;

    // uf = update function
    this._uf = update;
  }

  /**
   * Update all children
   */
  update(dt?: number): void {
    this._uf(dt);
    this.children.map(child => {
      const updatableChild = child as unknown as { update?: (dt?: number) => void };
      return updatableChild.update && updatableChild.update(dt);
    });
  }

  render(): void {
    this._rf();

    const children = this.children;
    children.map(child => {
      const renderableChild = child as unknown as { render?: () => void };
      return renderableChild.render && renderableChild.render();
    });
  }

  _pc(): void {
    this.children.map(child => {
      const pcChild = child as unknown as { _pc?: () => void };
      return pcChild._pc && pcChild._pc();
    });
  }

  get x(): number {
    return this.position.x;
  }

  set x(value: number): void {
    this.position.x = value;

    // pc = property changed
    this._pc();
  }

  get y(): number {
    return this.position.y;
  }

  set y(value: number): void {
    this.position.y = value;
    this._pc();
  }

  get width(): number {
    // w = width
    return this._w;
  }

  set width(value: number): void {
    this._w = value;
    this._pc();
  }

  get height(): number {
    // h = height
    return this._h;
  }

  set height(value: number): void {
    this._h = value;
    this._pc();
  }

  set children(value: GameEntity[]): void {
    this.removeChild(this._c);
    this.addChild(value);
  }

  get children(): GameEntity[] {
    return this._c;
  }

  addChild(...objects: GameEntity[]): void {
    objects.flat().map(child => {
      this.children.push(child);
      (child as { parent?: GameEntity }).parent = this;
      (child as { _pc?: () => void })._pc = (child as { _pc?: () => void })._pc || noop;
      (child as { _pc?: () => void })._pc!();
    });
  }

  // We never remove children, so this has been commented out
  // removeChild(...objects) {
  //   objects.flat().map(child => {
  //     if (removeFromArray(this.children, child)) {
  //       child.parent = null;
  //       child._pc();
  //     }
  //   });
  // }
}

const noop = (): void => {};

export default function factory(...args: unknown[]): GameObject {
  // @ts-expect-error - spread arguments handling
  return new GameObject(...args as []);
}

export { GameObject as GameObjectClass };
