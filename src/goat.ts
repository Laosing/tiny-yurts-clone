import { Vector } from './vector';
import { Animal } from './animal';
import { animalLayer, animalShadowLayer } from './layers';
import { colors } from './colors';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';

export const goats: Goat[] = [];

export class Goat extends Animal {
  target: { x: number; y: number } | null;
  scale: number;

  constructor(properties: { parent: { x: number; y: number; children: unknown[] }; isBaby?: boolean }) {
    super({
      ...properties,
      parent: properties.parent,
      width: 1,
      height: 1.5,
      roundness: 0.6,
      color: colors.goat,
      isBaby: properties.isBaby ? 0.4 : false,
    });

    goats.push(this);
  }

  angleToTarget(target: { x: number; y: number }): number {
    return Math.atan2(target.y - this.y, target.x - this.x);
  }

  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  addToSvg(): void {
    this.scale = 0;

    const goat = createSvgElement('g');
    goat.style.transformOrigin = 'center';
    goat.style.transformBox = 'fill-box';
    goat.style.transition = 'all 1s';
    goat.style.willChange = 'transform';
    this.svgElement = goat;
    animalLayer.prepend(goat);

    const body = createSvgElement('rect');
    body.setAttribute('fill', colors.goat);
    body.setAttribute('width', this.width.toString());
    body.setAttribute('height', this.height.toString());
    body.setAttribute('rx', this.roundness.toString());
    goat.append(body);

    const shadow = createSvgElement('rect');
    shadow.setAttribute('width', this.width.toString());
    shadow.setAttribute('height', this.height.toString());
    shadow.setAttribute('rx', this.roundness.toString());
    shadow.style.transformOrigin = 'center';
    shadow.style.transformBox = 'fill-box';
    shadow.style.transition = 'all 1s';
    shadow.style.willChange = 'transform';
    this.shadowElement = shadow;
    animalShadowLayer.prepend(shadow);

    this.render();

    setTimeout(() => {
      this.scale = 1;
    }, 500);

    setTimeout(() => {
      goat.style.transition = '';
      goat.style.willChange = '';
      shadow.style.willChange = '';
      shadow.style.transition = '';
    }, 1500);
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
        // Check if new pos is not too close to other goats
        const tooCloseToOtherGoats = this.parent!.children.some((g) => {
          if (this === g) return false;
          const otherGoatVector = new Vector(g.x, g.y);
          const oldDistToOtherGoat = otherGoatVector.distance(new Vector(this.x, this.y));
          const newDistToOtherGoat = otherGoatVector.distance(new Vector(newPosX, newPosY));
          return newDistToOtherGoat < 4 && newDistToOtherGoat < oldDistToOtherGoat;
        });
        if (!tooCloseToOtherGoats) {
          this.x = newPosX;
          this.y = newPosY;
        }
      }
    }
  }

  render(): void {
    super.render();

    const x = this.parent!.x * gridCellSize + this.x - this.width / 2;
    const y = this.parent!.y * gridCellSize + this.y - this.height / 2;

    this.svgElement!.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${this.radToDeg(this.rotation) - 90}deg)
      scale(${this.scale * (this.isBaby ? 0.6 : 1)})
    `;

    this.shadowElement!.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${this.radToDeg(this.rotation) - 90}deg)
      scale(${(this.scale + 0.04) * (this.isBaby ? 0.6 : 1)})
    `;
  }
}
