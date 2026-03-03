import { Vector } from './vector';
import { Animal } from './animal';
import { animalLayer } from './layers';
import { colors } from './colors';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';

// Yes plural of fish is fishes, not fishs, if it's only one kind of fish
export const fishes: Fish[] = [];

export class Fish extends Animal {
  svgBody: SVGRectElement;

  constructor(properties: { parent: { x: number; y: number; children: unknown[] } }) {
    super({
      ...properties,
      parent: properties.parent,
      width: 0.7,
      height: 1,
      roundness: 1,
      color: colors.fish,
    });

    fishes.push(this);
  }

  angleToTarget(target: { x: number; y: number }): number {
    return Math.atan2(target.y - this.y, target.x - this.x);
  }

  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  addToSvg(): void {
    this.scale = 0;

    this.svgElement = createSvgElement('g');
    this.svgElement.style.transformOrigin = 'center';
    this.svgElement.style.transformBox = 'fill-box';
    this.svgElement.style.transition = 'all 1s';
    this.svgElement.style.willChange = 'transform';
    this.svgElement.style.transform = `translate(${this.x}px,${this.y}px) rotate(${this.radToDeg(this.rotation)}deg) scale(${this.scale * (this.isBaby ? 0.6 : 1)})`;
    animalLayer.append(this.svgElement);

    this.svgBody = createSvgElement('rect');
    this.svgBody.setAttribute('fill', colors.fish);
    this.svgBody.setAttribute('width', this.width.toString());
    this.svgBody.setAttribute('height', this.height.toString());
    this.svgBody.setAttribute('rx', this.roundness.toString());
    this.svgBody.style.transition = 'fill 0.2s';
    this.svgElement.append(this.svgBody);

    this.render();

    setTimeout(() => {
      this.scale = 1;
      this.svgBody.setAttribute('fill', colors.shade2);
    }, 4000);
  }

  render(): void {
    super.render();

    const x = this.parent!.x * gridCellSize + this.x - this.width / 2;
    const y = this.parent!.y * gridCellSize + this.y - this.height / 2;

    this.svgElement!.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${this.radToDeg(this.rotation)}deg)
      scale(${this.scale * (this.isBaby ? 0.6 : 1)})
    `;
  }

  update(gameStarted: boolean): void {
    this.advance();

    if (gameStarted) {
      if (this.isBaby) {
        this.isBaby = false; // eslint-disable-line @typescript-eslint/no-dynamic-delete
      }
    }

    // Maybe pick a new target location
    if (Math.random() > 0.96) {
      this.target = this.getRandomTarget();
    }

    if (this.target) {
      const angle = this.angleToTarget(this.target);
      const targetVector = new Vector(this.target.x, this.target.y);
      const dist = targetVector.distance(new Vector(this.x, this.y));

      if (Math.abs(angle % (Math.PI * 2)) > 0.1) {
        this.rotation += angle > 0 ? 0.1 : -0.1;
      } else if (dist > 0.1) {
        const normalized = targetVector.subtract(new Vector(this.x, this.y)).normalize();
        const newPosX = this.x + normalized.x * 0.1;
        const newPosY = this.y + normalized.y * 0.1;
        // Check if new pos is not too close to other fishes
        const tooCloseToOtherFishes = this.parent!.children.some((f) => {
          if (this === f) return false;
          const otherFishVector = new Vector(f.x, f.y);
          const oldDistToOtherFish = otherFishVector.distance(new Vector(this.x, this.y));
          const newDistToOtherFish = otherFishVector.distance(new Vector(newPosX, newPosY));
          return newDistToOtherFish < 4 && newDistToOtherFish < oldDistToOtherFish;
        });
        if (!tooCloseToOtherFishes) {
          this.x = newPosX;
          this.y = newPosY;
        }
      }
    }
  }
}
