import { OntoumlElement } from '..';

export abstract class DiagramElement extends OntoumlElement {
  constructor(type: string, base?: Partial<DiagramElement>) {
    super(type, base);
  }
}
