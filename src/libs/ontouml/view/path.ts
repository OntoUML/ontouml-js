import { OntoumlType, OntoumlElement, Shape, Point } from '..';

export class Path extends Shape {
  points: Point[];

  constructor(base?: Partial<Path>) {
    super(OntoumlType.PATH, base);

    this.points = base?.points || null;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  moveTo(x: number, y: number): void {
    this.points.push(new Point(x, y));
  }

  setPoints(points: Point[]): void {
    this.points = [];
    if (points != null) this.addPoints(points);
  }

  addPoints(points: Point[]): void {
    if (points != null) points.forEach(p => this.addPoint(p));
  }

  addPoint(point: Point): void {
    if (point != null) this.points.push(point);
  }
}
