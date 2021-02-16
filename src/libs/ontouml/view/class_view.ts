import { Class, OntoumlElement, OntoumlType, NodeView, Rectangle } from '..';

export class ClassView extends NodeView<Class, Rectangle> {
  constructor(base?: Partial<ClassView>) {
    super(OntoumlType.CLASS_VIEW, base);
  }

  createShape(): Rectangle {
    return new Rectangle();
  }

  getContents(): OntoumlElement[] {
    return super.getContents();
  }
}
