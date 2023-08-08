import { NodeView, Rectangle, Class, OntoumlElement, OntoumlType } from '..';

export class ClassView extends NodeView<Class, Rectangle> {
  constructor(base?: Partial<ClassView>) {
    super(OntoumlType.CLASS_VIEW, base);
  }

  createShape(): Rectangle {
    const rectangle = new Rectangle();
    rectangle.width = 100;
    rectangle.height = 50;
    return rectangle;
  }

  getContents(): OntoumlElement[] {
    return super.getContents();
  }
}
