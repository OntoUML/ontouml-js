import { OntoumlElement } from '../ontouml_element';

export abstract class DiagramElement extends OntoumlElement {
  constructor(type: string, base?: Partial<DiagramElement>) {
    super(type, base);
  }
}
