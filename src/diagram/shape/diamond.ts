import { OntoumlType, Point, RectangularShape } from '../..';

/**
 * A diamond on the diagram canvas, positioned and sized by its bounding
 * rectangle. Diamonds render the central hub of a {@link NaryRelationView},
 * where the legs connecting the relation's members meet.
 */
export class Diamond extends RectangularShape {
  constructor(topLeft?: Point, width?: number, height?: number) {
    super(topLeft, width, height);
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.DIAMOND
    };

    return { ...object, ...super.toJSON() };
  }
}
