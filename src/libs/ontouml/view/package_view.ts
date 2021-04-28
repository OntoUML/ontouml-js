import { OntoumlElement, OntoumlType, NodeView, Rectangle, Package } from '..';

export class PackageView extends NodeView<Package, Rectangle> {
  constructor(base?: Partial<PackageView>) {
    super(OntoumlType.PACKAGE_VIEW, base);
  }

  createShape(): Rectangle {
    const rectangle = new Rectangle();
    rectangle.width = 60;
    rectangle.height = 30;
    return rectangle;
  }

  getContents(): OntoumlElement[] {
    return super.getContents();
  }
}
