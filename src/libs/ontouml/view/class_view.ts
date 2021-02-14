import { Class } from '../model/class';
import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { ElementView } from './element_view';
import { Rectangle } from './rectangle';

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
