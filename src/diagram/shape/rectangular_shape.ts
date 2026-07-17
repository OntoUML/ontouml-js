import { Point, Shape } from '../..';

/**
 * The abstract base of shapes bounded by a rectangular area, such as
 * {@link Rectangle}, {@link Text}, and {@link Diamond}. A rectangular shape
 * is positioned by the {@link Point} at its top-left corner and sized by a
 * strictly positive width and height.
 */
export abstract class RectangularShape extends Shape {
  private topLeft: Point;
  private _width!: number;
  private _height!: number;

  constructor(topLeft?: Point, width?: number, height?: number) {
    super();

    this.topLeft = topLeft || new Point(0, 0);
    this.width = width ?? 20;
    this.height = height ?? 10;
  }

  /** Returns the horizontal coordinate of the shape's top-left corner. */
  getX(): number {
    return this.topLeft.x;
  }

  /** Sets the horizontal coordinate of the shape's top-left corner. */
  setX(x: number): void {
    this.topLeft.x = x;
  }

  /** Returns the vertical coordinate of the shape's top-left corner. */
  getY(): number {
    return this.topLeft.y;
  }

  /** Sets the vertical coordinate of the shape's top-left corner. */
  setY(y: number): void {
    this.topLeft.y = y;
  }

  /** The width of the shape's bounding rectangle. */
  public get width(): number {
    return this._width;
  }

  /**
   * Sets the width of the shape's bounding rectangle. Throws an error if the
   * value is zero or negative.
   */
  public set width(value: number) {
    if (value <= 0) {
      throw new Error('Cannot set a negative or zero width.');
    }

    this._width = value;
  }

  /** The height of the shape's bounding rectangle. */
  public get height(): number {
    return this._height;
  }

  /**
   * Sets the height of the shape's bounding rectangle. Throws an error if
   * the value is zero or negative.
   */
  public set height(value: number) {
    if (value <= 0) {
      throw new Error('Cannot set a negative or zero height.');
    }

    this._height = value;
  }

  override toJSON(): any {
    const object = {
      topLeft: { x: this.topLeft.x, y: this.topLeft.y },
      width: this.width,
      height: this.height
    };

    return { ...object, ...super.toJSON() };
  }
}
