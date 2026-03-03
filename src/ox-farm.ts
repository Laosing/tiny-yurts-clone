import { Ox } from './ox';
import { Farm } from './farm';
import { colors } from './colors';

export const oxFarms: OxFarm[] = [];

export class OxFarm extends Farm {
  numAnimals: number;
  appearing: boolean;

  constructor(properties: { x: number; y: number; delay?: number }) {
    super({
      ...properties,
      fenceColor: colors.ox,
    });

    this.needyness = 225;
    this.type = colors.ox;
    this.numAnimals = 3;
    this.appearing = true;

    oxFarms.push(this);

    const isBaby = (oxFarms.length - 1) % 2;

    setTimeout(() => {
      this.addAnimal(new Ox({
        parent: this,
        isBaby,
      }));
    }, 2000 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Ox({
        parent: this,
        isBaby,
      }));
    }, 3000 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Ox({
        parent: this,
        isBaby,
      }));
    }, 4000 + (properties.delay ?? 0));

    this.appearing = false;
  }

  upgrade(): boolean {
    // Cannot upgrade if there are 5 or more oxen already
    if (this.numAnimals >= 5) {
      return false;
    }

    this.numAnimals += 2;

    // 3 parents and 2 babies each upgrade
    for (let i = 0; i < this.children.filter((c) => !(c as Ox).isBaby).length; i++) {
      setTimeout(() => {
        this.children.filter((c) => !(c as Ox).isBaby)[i].showLove();
      }, i * 1000);
      setTimeout(() => {
        this.children.filter((c) => !(c as Ox).isBaby)[i].hideLove();
      }, 7000);
      if (i) {
        setTimeout(() => {
          this.addAnimal(new Ox({
            parent: this,
            isBaby: true,
          }));
        }, i * 10000 + 7000);
      }
    }

    return true;
  }

  update(gameStarted: boolean, updateCount: number): void {
    super.update(gameStarted, updateCount);
    // So 3 ox = 2 demand per update, 5 ox = 2 demand per update,
    // so upgrading doubles demand(?)
  }
}
