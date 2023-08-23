export class Point {
  private _x!: number;
  private _y!: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value ?? 0;
  }

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this._y = value ?? 0;
  }

  toString(): string {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
