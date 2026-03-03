import { GameObjectClass } from './modified-kontra/game-object';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';
import { pinLayer } from './layers';
import type { AnimalProperties, GameEntity } from './types';
import { playWarnNote } from './audio';

export const animals: Animal[] = [];
const padding = 3;

const getRandom = (range: number): number => padding + (Math.random() * (range * gridCellSize - padding * 2));

export interface AnimalPropertiesWithExtras extends AnimalProperties {
  color: string;
  roundness?: number;
}

export class Animal extends GameObjectClass {
  isBaby: boolean;
  roundness?: number;
  hasWarn: boolean;
  hasPerson: Animal | null; // Ref to person on their way to say hi
  hasLove?: boolean;
  color: string;
  pinSvg?: SVGGElement;
  warnSvg?: SVGPathElement;
  loveSvg?: SVGPathElement;
  type: string;
  parent?: GameEntity; // Store parent from properties
  svgElement?: SVGGElement;
  shadowElement?: SVGRectElement;

  constructor(properties: AnimalPropertiesWithExtras) {
    super({
      ...properties,
      anchor: { x: 0.5, y: 0.5 },
      x: getRandom(properties.parent?.width ?? 0),
      y: getRandom(properties.parent?.height ?? 0),
      rotation: properties.rotation ?? (Math.random() * Math.PI * 4) - Math.PI * 2,
    });

    // Store parent from properties
    this.parent = properties.parent;

    const parentX = this.parent?.x ?? 0;
    const parentY = this.parent?.y ?? 0;
    const x = parentX * gridCellSize + this.x;
    const y = parentY * gridCellSize + this.y;

    this.isBaby = properties.isBaby ?? false;
    this.roundness = properties.roundness;
    this.hasWarn = false;
    this.hasPerson = null;
    this.hasLove = false;
    this.color = properties.color;
    this.type = properties.type;

    this.pinSvg = createSvgElement('g');
    this.pinSvg!.style.opacity = '0';
    this.pinSvg!.style.willChange = 'opacity, transform';
    this.pinSvg!.style.transition = `all 0.8s cubic-bezier(0.5, 2, 0.5, 1)`;
    this.pinSvg!.style.transformOrigin = 'bottom';
    this.pinSvg!.style.transformBox = 'fill-box';
    this.pinSvg!.style.transform = `translate(${x}px, ${y - this.height / 2}px)`;
    pinLayer.append(this.pinSvg);

    const pinBubble = createSvgElement('path');
    pinBubble.setAttribute('fill', '#fff');
    pinBubble.setAttribute('d', 'm6 6-2-2a3 3 0 1 1 4 0Z');
    pinBubble.setAttribute('transform', 'scale(0.5) translate(-6 -8)');
    this.pinSvg!.append(pinBubble);

    // !
    this.warnSvg = createSvgElement('path');
    this.warnSvg!.setAttribute('stroke', this.color);
    this.warnSvg!.setAttribute('d', 'M3 6 3 6M3 4.5 3 3');
    this.warnSvg!.setAttribute('transform', 'scale(0.5) translate(-3 -10.4)');
    this.warnSvg!.style.opacity = '0';
    this.pinSvg!.append(this.warnSvg!);

    // ♥
    this.loveSvg = createSvgElement('path');
    this.loveSvg!.setAttribute('fill', this.color);
    this.loveSvg!.setAttribute('d', 'M6 6 4 4A1 1 0 1 1 6 2 1 1 0 1 1 8 4Z');
    this.loveSvg!.setAttribute('transform', 'scale(0.3) translate(-6 -13)');
    this.loveSvg!.style.opacity = '0';
    this.pinSvg!.append(this.loveSvg!);

    animals.push(this);
  }

  render(): void {
    const parentX = this.parent?.x ?? 0;
    const parentY = this.parent?.y ?? 0;
    const x = parentX * gridCellSize + this.x;
    const y = parentY * gridCellSize + this.y;

    this.pinSvg!.style.transform = `
      translate(${x}px, ${y - this.height / 2}px)
      scale(${this.hasWarn || this.hasLove ? 1 : 0})
    `;
  }

  getRandomTarget(): { x: number; y: number } {
    const parent = this.parent;
    if (!parent) return { x: 0, y: 0 };

    const randomTarget = {
      x: getRandom(parent.width),
      y: getRandom(parent.height),
    };

    // const debug = createSvgElement('circle');
    // const x = parent.x * gridCellSize + randomTarget.x;
    // const y = parent.y * gridCellSize + randomTarget.y;
    // debug.setAttribute('transform', `translate(${x},${y})`);
    // debug.setAttribute('r', '0.5');
    // debug.setAttribute('fill', 'red');
    // pointerLayer.append(debug);

    return randomTarget;
  }

  showLove(): void {
    this.hasLove = true;
    this.pinSvg!.style.opacity = '1';
    this.warnSvg!.style.opacity = '0';
    this.loveSvg!.style.opacity = '1';
  }

  hideLove(): void {
    this.hasLove = false;
    this.pinSvg!.style.opacity = this.hasWarn ? '1' : '0';
    this.warnSvg!.style.opacity = this.hasWarn ? '1' : '0';
    this.loveSvg!.style.opacity = '0';
  }

  showWarn(): void {
    playWarnNote(this.color);
    this.hasWarn = true;
    this.warnSvg!.style.opacity = '1';
    this.loveSvg!.style.opacity = '0';
    this.pinSvg!.style.opacity = '1';
  }

  hideWarn(): void {
    this.hasWarn = false;
    this.loveSvg!.style.opacity = this.hasLove ? '1' : '0';
    this.pinSvg!.style.opacity = this.hasLove ? '1' : '0';
    this.warnSvg!.style.opacity = '0';
  }

  toggleWarn(toggle: boolean): void {
    if (toggle) {
      this.showWarn();
    } else {
      this.hideWarn();
    }
  }
}
