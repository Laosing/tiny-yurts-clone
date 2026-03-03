import { Vector } from './vector';
import { GameObjectClass } from './modified-kontra/game-object';
import { createSvgElement } from './svg-utils';
import { gridCellSize } from './svg';
import { treeShadowLayer, treeLayer } from './layers';
import { colors } from './colors';
import { playTreeDeleteNote } from './audio';

export const trees: Tree[] = [];

export class Tree extends GameObjectClass {
  dots: { position: Vector; size: number }[];
  svgGroup?: SVGGElement;
  shadowGroup?: SVGGElement;

  constructor(properties: { x: number; y: number }) {
    super({ ...properties });

    this.dots = [];
    trees.push(this);
    this.addToSvg();
  }

  addToSvg(): void {
    const minDotGap = 0.5;
    const numTrees = Math.floor(Math.random() * 4);
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    this.svgGroup = createSvgElement('g');
    this.svgGroup.style.transform = `translate(${x}px,${y}px)`;
    treeLayer.append(this.svgGroup);

    this.shadowGroup = createSvgElement('g');
    this.shadowGroup.style.transform = `translate(${x}px,${y}px)`;
    treeShadowLayer.append(this.shadowGroup);

    for (let i = 0; i < numTrees; i++) {
      const size = Math.random() / 2 + 1;
      const position = new Vector(Math.random() * 8 - 4, Math.random() * 8 - 4);

      // If this new tree (...branch) is too close to another tree in this cell, just skip it.
      // This means that on average, larger trees are less likely to have many siblings
      if (this.dots.some((d) => d.position.distance(position) < d.size + size + minDotGap)) {
        continue;
      }

      this.dots.push({ position, size });
    }
  }

  remove(): void {
    // Remove from SVG
    this.svgGroup?.remove();
    this.shadowGroup?.remove();

    for (let i = 0; i < this.dots.length; i++) {
      setTimeout(() => playTreeDeleteNote(), i * 100);
    }

    // Remove from trees array
    trees.splice(trees.findIndex((p) => p === this), 1);
  }
}
