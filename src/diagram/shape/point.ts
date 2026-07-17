/**
 * A point in the two-dimensional coordinate space of a {@link Diagram}.
 * Points position {@link Shape} instances on the diagram canvas and define
 * the vertices of {@link Path} polylines.
 */
export class Point {
  private _x!: number;
  private _y!: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** The horizontal coordinate of the point. */
  public get x(): number {
    return this._x;
  }

  /** Sets the horizontal coordinate; `null` and `undefined` are coerced to `0`. */
  public set x(value: number) {
    this._x = value ?? 0;
  }

  /** The vertical coordinate of the point. */
  public get y(): number {
    return this._y;
  }

  /** Sets the vertical coordinate; `null` and `undefined` are coerced to `0`. */
  public set y(value: number) {
    this._y = value ?? 0;
  }

  /** Formats the point as `"(x, y)"`. */
  toString(): string {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
