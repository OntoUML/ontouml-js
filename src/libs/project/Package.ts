import { ModelElement } from './ModelElement';
import { OntoUMLType } from '@constants/.';
import { Project } from './Project';

export class Package extends ModelElement {
  contents?: ModelElement[];

  constructor(project: Project) {
    super(project);
    this.type = OntoUMLType.PACKAGE_TYPE;
  }

  getAllContents(match: object): ModelElement[] {
    throw new Error('Method unimplemented');
  }

  // TODO: do we need some getContent(match) method?
}
