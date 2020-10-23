import ModelElement from './ModelElement';
import Project from './Project';
import { OntoumlType } from '@constants/.';

export default class Package extends ModelElement {
  contents?: ModelElement[];

  constructor(project: Project) {
    super(project);
    this.type = OntoumlType.PACKAGE_TYPE;
  }

  getAllContents(match: object): ModelElement[] {
    throw new Error('Method unimplemented');
  }

  // TODO: do we need some getContent(match) method?
}
