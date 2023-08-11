import { OntoumlType } from '..';
import { Point } from './point';
import { RectangularShape } from './rectangular_shape';

export class Text extends RectangularShape {
  constructor(topLeft?: Point, width?: number, height?: number) {
    super(topLeft, width, height);
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.TEXT
    };

    return { ...object, ...super.toJSON() };
  }
}
