import { OntoumlType, Point, RectangularShape } from '../..';

/**
 * A rectangle on the diagram canvas. Rectangles render node views such as
 * {@link ClassView} and {@link PackageView}.
 */
export class Rectangle extends RectangularShape {
  constructor(topLeft?: Point, width?: number, height?: number) {
    super(topLeft, width, height);
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.RECTANGLE
    };

    return { ...object, ...super.toJSON() };
  }
}
