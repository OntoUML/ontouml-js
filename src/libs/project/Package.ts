import { ModelElement } from './ModelElement';
import { OntoUMLType } from '@constants/.';

export class Package extends ModelElement {
  type: OntoUMLType.PACKAGE_TYPE;
  contents: null | ModelElement[];

  constructor() {
    super();
    throw new Error('Class unimplemented');
  }

  getAllContents(match: object): ModelElement[] {
    throw new Error('Method unimplemented');
  }

  // TODO: do we need some getContent(match) method?
}
