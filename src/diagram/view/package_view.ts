import {
  OntoumlType,
  Package,
  View,
  Rectangle,
  OntoumlElement,
  Shape
} from '../..';

/**
 * The view of a {@link Package} in a {@link Diagram}, rendered as a
 * {@link Rectangle} (60 × 30 by default).
 */
export class PackageView extends View<Package> {
  /** The rectangle that renders the package on the diagram canvas. */
  readonly rectangle: Rectangle;

  constructor(pkg: Package) {
    super(pkg);

    this.rectangle = new Rectangle();
    this.rectangle.width = 60;
    this.rectangle.height = 30;
  }

  /** The shapes that render this view: its {@link rectangle}. */
  override get shapes(): Shape[] {
    return [this.rectangle];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.PACKAGE_VIEW,
      ...super.toJSON(),
      rectangle: this.rectangle.id
    };
  }
}
