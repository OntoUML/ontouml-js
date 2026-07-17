import { OntoumlElement } from '../..';

export abstract class Shape extends OntoumlElement {
  constructor() {
    super();
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}
}
