import { OntoumlType } from '@constants/.';
import Class from './class';
import ModelElement, { setContainer } from './model_element';

export default class Literal extends ModelElement {
  constructor(base?: Partial<Literal>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.LITERAL_TYPE, enumerable: true });
  }

  setContainer(container: Class): void {
    setContainer(this, container);
  }
}
