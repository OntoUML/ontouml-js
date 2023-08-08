import { DiagramElement } from '..';
import { OntoumlElement } from '../ontouml_element';

export abstract class Shape extends DiagramElement {
  constructor(type: string, base?: Partial<Shape>) {
    super(type, base);
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}
}
