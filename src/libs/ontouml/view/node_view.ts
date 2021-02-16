import { ModelElement, ElementView, RectangularShape } from '..';

export abstract class NodeView<T extends ModelElement, S extends RectangularShape> extends ElementView<T, S> {
  constructor(type: string, base?: Partial<NodeView<T, S>>) {
    super(type, base);
  }

  getX(): number {
    return this.shape.getX();
  }

  setX(x: number): void {
    this.shape.setX(x);
  }

  getY(): number {
    return this.shape.getY();
  }

  setY(y: number): void {
    this.shape.setY(y);
  }

  getWidth(): number {
    return this.shape.width;
  }

  setWidth(width: number): void {
    this.shape.setWidth(width);
  }

  getHeight(): number {
    return this.shape.height;
  }

  setHeight(height: number): void {
    this.shape.setHeight(height);
  }
}
