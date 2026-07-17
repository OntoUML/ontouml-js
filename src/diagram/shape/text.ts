import { OntoumlType, Point, RectangularShape } from '../..';

/**
 * A rectangular area holding textual content on the diagram canvas. Texts
 * render views whose depiction is a label or annotation, such as
 * {@link NoteView} and {@link GeneralizationSetView}.
 */
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
