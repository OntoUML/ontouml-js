import { Class } from '@libs/ontouml';
import { OverlappingSet } from './overlapping_set';

export class RelOverOccurrence {
  relator: Class;
  overlappingSets: OverlappingSet[];

  constructor(relator: Class, overlappingSets: OverlappingSet[]) {
    this.relator = relator;
    this.overlappingSets = overlappingSets;
  }
}
