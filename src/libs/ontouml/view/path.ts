// import { OntoumlElement, OntoumlType, Shape } from '@libs/ontouml';

import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { Shape } from '..';

export class Path extends Shape {
  constructor(base?: Partial<Path>) {
    super(OntoumlType.PATH, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
