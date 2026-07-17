import {
  OntoumlType,
  Package,
  View,
  Rectangle,
  OntoumlElement,
  Shape
} from '../..';

export class PackageView extends View<Package> {
  readonly rectangle: Rectangle;

  constructor(pkg: Package) {
    super(pkg);

    this.rectangle = new Rectangle();
    this.rectangle.width = 60;
    this.rectangle.height = 30;
  }

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
