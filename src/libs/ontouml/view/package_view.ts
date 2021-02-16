import { OntoumlElement, OntoumlType, NodeView, Rectangle, Package } from '..';

export class PackageView extends NodeView<Package, Rectangle> {
  constructor(base?: Partial<PackageView>) {
    super(OntoumlType.PACKAGE_VIEW, base);
  }

  createShape(): Rectangle {
    return new Rectangle();
  }

  getContents(): OntoumlElement[] {
    return super.getContents();
  }
}
