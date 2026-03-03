import { Goat } from './goat';
import { Farm } from './farm';
import { colors } from './colors';

export const goatFarms: GoatFarm[] = [];

export class GoatFarm extends Farm {
  numAnimals: number;
  appearing: boolean;

  constructor(properties: { x: number; y: number; delay?: number }) {
    super({
      ...properties,
      fenceColor: colors.goat,
    });

    this.needyness = 240;
    this.type = colors.goat;
    this.numAnimals = 3;
    this.appearing = true;

    goatFarms.push(this);

    setTimeout(() => {
      this.addAnimal(new Goat({
        parent: this,
        isBaby: false,
      }));
    }, 2000 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Goat({
        parent: this,
        isBaby: false,
      }));
    }, 3000 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Goat({
        parent: this,
        isBaby: false,
      }));
    }, 4000 + (properties.delay ?? 0));

    this.appearing = false;
  }

  upgrade(): boolean {
    this.numAnimals += 1;

    // Cannot upgrade if there are 7 or more goats already
    if (this.numAnimals >= 7) {
      return false;
    }

    // 2 parents and 1 baby each upgrade
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        this.children.filter((c) => !(c as Goat).isBaby)[i].showLove();
      }, i * 1000);
      setTimeout(() => {
        this.children.filter((c) => !(c as Goat).isBaby)[i].hideLove();
      }, 7000);
      if (i) {
        setTimeout(() => {
          this.addAnimal(new Goat({
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
  }
}
