import { OntoumlType } from '@constants/.';
import ModelElement from './model_element';

export default class Literal extends ModelElement {
  constructor(base?: Partial<Literal>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.LITERAL_TYPE, enumerable: true });
  }
}
