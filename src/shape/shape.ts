import { OntoumlElement } from '../ontouml_element';

export abstract class Shape extends OntoumlElement {
  constructor() {
    super();
  }
  
  override getContents(): OntoumlElement[] {
    return [];
  }

  override clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }

  override replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}
}
