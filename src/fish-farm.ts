import { Fish } from './fish';
import { Farm } from './farm';
import { colors } from './colors';

export const fishFarms: FishFarm[] = [];

export class FishFarm extends Farm {
  numAnimals: number;
  appearing: boolean;

  constructor(properties: { x: number; y: number; delay?: number }) {
    super({
      ...properties,
      fenceColor: '#eee',
      width: 2,
      height: 2,
    });

    this.needyness = 1300;
    this.type = colors.fish;
    this.numAnimals = 5;
    this.appearing = true;

    fishFarms.push(this);

    setTimeout(() => {
      this.addAnimal(new Fish({
        parent: this,
      }));
    }, 2000 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Fish({
        parent: this,
      }));
    }, 2500 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Fish({
        parent: this,
      }));
    }, 3000 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Fish({
        parent: this,
      }));
    }, 3500 + (properties.delay ?? 0));

    setTimeout(() => {
      this.addAnimal(new Fish({
        parent: this,
      }));
    }, 4000 + (properties.delay ?? 0));

    this.appearing = false;
  }

  upgrade(): boolean {
    // Cannot upgrade if there are 9 or more fish already
    if (this.numAnimals >= 9) {
      return false;
    }

    this.numAnimals += 4;

    // 2 parents
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        this.children[i].showLove();
      }, i * 1000);
      setTimeout(() => {
        this.children[i].hideLove();
      }, 7000);
    }

    return true;
  }

  update(gameStarted: boolean, updateCount: number): void {
    super.update(gameStarted, updateCount);
    // So 3 fish = 2 demand per update, 5 fish = 2 demand per update,
    // so upgrading doubles demand(?)
  }
}
