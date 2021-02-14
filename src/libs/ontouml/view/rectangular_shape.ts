import { Shape } from './shape';

export abstract class RectangularShape extends Shape {
  constructor(type: string, base?: Partial<RectangularShape>) {
    super(type, base);
  }
}
