import { OntoumlType, Point, Shape } from '../..';

/**
 * A polyline on the diagram canvas, defined by an ordered sequence of
 * {@link Point} instances. Paths render connector views, such as
 * {@link BinaryRelationView}, {@link GeneralizationView}, and the legs of a
 * {@link NaryRelationView}.
 */
export class Path extends Shape {
  private _points: Point[];

  constructor(points?: Point[]) {
    super();
    this._points = points || [];
  }

  /** The points of the path, in drawing order. */
  public get points(): Point[] {
    return [...this._points];
  }

  /**
   * Replaces the points of the path. Throws an error if the value is not an
   * array; `null` entries are skipped.
   */
  public set points(points: Point[]) {
    if (!Array.isArray(points)) {
      throw new Error(
        'Illegal parameter. Cannot add a null or undefined array of points.'
      );
    }

    this._points = [];
    this.addPoints(points);
  }

  /** Appends a new {@link Point} with the given coordinates to the path. */
  moveTo(x: number, y: number): void {
    this.addPoint(new Point(x, y));
  }

  /** Appends each of the given points to the path, skipping `null` entries. */
  addPoints(points: Point[]): void {
    if (points != null) points.forEach(p => this.addPoint(p));
  }

  /** Appends a point to the path; `null` values are ignored. */
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
