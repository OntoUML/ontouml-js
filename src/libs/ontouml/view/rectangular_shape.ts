import { Shape, Point } from '..';

export abstract class RectangularShape extends Shape {
  topLeft: Point;
  width: number;
  height: number;

  constructor(type: string, base?: Partial<RectangularShape>) {
    super(type, base);

    this.topLeft = base?.topLeft || new Point(0, 0);
    this.width = base?.width || 20;
    this.height = base?.height || 10;
  }

  getX(): number {
    return this.topLeft.getX();
  }

  setX(x: number): void {
    this.topLeft.setX(x);
  }

  getY(): number {
    return this.topLeft.getY();
  }

  setY(y: number): void {
    this.topLeft.setY(y);
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  toJSON(): any {
    const serialization = {
      width: null,
      height: null,
      x: null,
      y: null
    };

    Object.assign(serialization, super.toJSON());

    delete serialization['topLeft'];

    serialization.x = this.topLeft?.x;
    serialization.y = this.topLeft?.y;

    return serialization;
  }
}
