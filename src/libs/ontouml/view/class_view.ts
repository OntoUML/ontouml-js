import { Class } from '..';
import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { ElementView } from '..';
import { Rectangle } from '..';

export class ClassView extends ElementView<Class, Rectangle> {
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
