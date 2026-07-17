import { Class, Rectangle, OntoumlType, View, Shape } from '../..';

/**
 * The view of a {@link Class} in a {@link Diagram}, rendered as a
 * {@link Rectangle} (100 × 50 by default).
 */
export class ClassView extends View<Class> {
  /** The rectangle that renders the class on the diagram canvas. */
  readonly rectangle: Rectangle;

  constructor(clazz: Class) {
    super(clazz);

    this.rectangle = new Rectangle();
    this.rectangle.width = 100;
    this.rectangle.height = 50;
  }

  /** The shapes that render this view: its {@link rectangle}. */
  override get shapes(): Shape[] {
    return [this.rectangle];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.CLASS_VIEW,
      ...super.toJSON(),
      rectangle: this.rectangle.id
    };
  }
}
