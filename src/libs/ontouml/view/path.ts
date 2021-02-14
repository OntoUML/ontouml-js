// import { OntoumlElement, OntoumlType, Shape } from '@libs/ontouml';

import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { Shape } from './shape';

export class Path extends Shape {
  constructor(base?: Partial<Path>) {
    super(OntoumlType.PATH, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
