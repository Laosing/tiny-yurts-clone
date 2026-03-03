import { Vector } from './vector';
import { Animal } from './animal';
import { animalLayer, animalShadowLayer } from './layers';
import { colors } from './colors';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';

export const oxen: Ox[] = [];

export class Ox extends Animal {
  target: { x: number; y: number } | null;
  scale: number;
  svgHorns: SVGPathElement;

  constructor(properties: { parent: { x: number; y: number; children: unknown[] }; isBaby?: boolean }) {
    super({
      ...properties,
      parent: properties.parent,
      width: 1.5,
      height: 2.5,
      roundness: 0.6,
      color: colors.ox,
      isBaby: properties.isBaby ? 0.5 : false,
    });

    oxen.push(this);
  }

  angleToTarget(target: { x: number; y: number }): number {
    return Math.atan2(target.y - this.y, target.x - this.x);
  }

  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  addToSvg(): void {
    this.scale = 0;

    const ox = createSvgElement('g');
    ox.style.transformOrigin = 'center';
    ox.style.transformBox = 'fill-box';
    ox.style.transition = 'all 1s';
    ox.style.willChange = 'transform';
    this.svgElement = ox;
    animalLayer.prepend(ox);

    const body = createSvgElement('rect');
    body.setAttribute('fill', colors.ox);
    body.setAttribute('width', this.width.toString());
    body.setAttribute('height', this.height.toString());
    body.setAttribute('rx', this.roundness.toString());
    ox.append(body);

    const horns = createSvgElement('path');
    horns.setAttribute('fill', 'none');
    horns.setAttribute('stroke', colors.oxHorn);
    horns.setAttribute('width', this.width.toString());
    horns.setAttribute('height', this.height.toString());
    horns.setAttribute('d', 'M0 2Q0 1 1 1Q2 1 2 2');
    horns.setAttribute('transform', 'translate(-0.2 0.6)');
    horns.setAttribute('stroke-width', '0.4');
    if (this.isBaby) {
      horns.style.transition = 'all 1s';
      horns.style.willChange = 'opacity';
      horns.style.opacity = '0';
    }
    this.svgHorns = horns;
    ox.append(horns);

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
      ox.style.transition = '';
      ox.style.willChange = '';
      shadow.style.willChange = '';
      shadow.style.transition = '';
    }, 1500);
  }

  update(gameStarted: boolean): void {
    this.advance();

    if (gameStarted) {
      if (this.isBaby) {
        this.svgHorns.style.opacity = '1';
      }

      if (this.isBaby) {
        this.isBaby = false; // eslint-disable-line @typescript-eslint/no-dynamic-delete
      }
    }

    // Maybe pick a new target location
    if (Math.random() > 0.99) {
      this.target = this.getRandomTarget();
    }

    if (this.target) {
      const angle = this.angleToTarget(this.target);
      const targetVector = new Vector(this.target.x, this.target.y);
      const dist = targetVector.distance(new Vector(this.x, this.y));

      if (Math.abs(angle % (Math.PI * 2)) > 0.1) {
        this.rotation += angle > 0 ? 0.04 : -0.04;
      } else if (dist > 0.1) {
        const normalized = targetVector.subtract(new Vector(this.x, this.y)).normalize();
        const newPosX = this.x + normalized.x * 0.05;
        const newPosY = this.y + normalized.y * 0.05;
        // Check if new pos is not too close to other oxen
        const tooCloseToOtherOxes = this.parent!.children.some((o) => {
          if (this === o) return false;
          const otherOxVector = new Vector(o.x, o.y);
          const oldDistToOtherOx = otherOxVector.distance(new Vector(this.x, this.y));
          const newDistToOtherOx = otherOxVector.distance(new Vector(newPosX, newPosY));
          return newDistToOtherOx < 4 && newDistToOtherOx < oldDistToOtherOx;
        });
        if (!tooCloseToOtherOxes) {
          this.x = newPosX;
          this.y = newPosY;
        }
      }
    }
  }

  render(): void {
    // super.render() also re-renders children in their new locations.
    // For example little warning speech bubble things
    super.render();

    const x = this.parent!.x * gridCellSize + this.x - this.width / 2;
    const y = this.parent!.y * gridCellSize + this.y - this.height / 2;

    this.svgElement!.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${this.radToDeg(this.rotation) - 90}deg)
      scale(${this.scale * (this.isBaby ? 0.5 : 1)})
    `;

    this.shadowElement!.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${this.radToDeg(this.rotation) - 90}deg)
      scale(${(this.scale + 0.04) * (this.isBaby ? 0.5 : 1)})
    `;
  }
}
