export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.setX(x);
    this.setY(y);
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): void {
    this.x = x ?? 0;
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): void {
    this.y = y ?? 0;
  }

  toString(): string {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
