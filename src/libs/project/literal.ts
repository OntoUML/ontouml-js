import { OntoumlType } from '@constants/.';
import { Class, ModelElement, setContainer } from './';

export class Literal extends ModelElement {
  constructor(base?: Partial<Literal>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.LITERAL_TYPE, enumerable: true });
  }

  setContainer(container: Class): void {
    setContainer(this, container);
  }
}
