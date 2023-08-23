import { OntoumlType } from "..";
import { Point } from "./point";
import { RectangularShape } from "./rectangular_shape";

export class Rectangle extends RectangularShape {
  constructor(topLeft?: Point, width?: number, height?: number) {
    super(topLeft, width, height);
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.RECTANGLE,
    };

    return { ...object, ...super.toJSON() };
  }
}
