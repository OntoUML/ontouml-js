export class Point {
  x: number;
  y: number;

  public Point(x: number, y: number) {
    this.setX(x);
    this.setY(y);
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): void {
    this.x = x != null ? x : 0;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): void {
    this.y = y != null ? y : 0;
  }

  public toString(): string {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
