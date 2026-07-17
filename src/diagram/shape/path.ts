import { OntoumlType, Point, Shape } from '../..';

export class Path extends Shape {
  private _points: Point[];

  constructor(points?: Point[]) {
    super();
    this._points = points || [];
  }

  public get points(): Point[] {
    return [...this._points];
  }

  public set points(points: Point[]) {
    if (!Array.isArray(points)) {
      throw new Error(
        'Illegal parameter. Cannot add a null or undefined array of points.'
      );
    }

    this._points = [];
    this.addPoints(points);
  }

  moveTo(x: number, y: number): void {
    this.addPoint(new Point(x, y));
  }

  addPoints(points: Point[]): void {
    if (points != null) points.forEach(p => this.addPoint(p));
  }

  addPoint(point: Point): void {
    if (point != null) this._points.push(point);
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.PATH,
      points: this._points.map(p => ({ x: p.x, y: p.y }))
    };

    return { ...object, ...super.toJSON() };
  }
}
