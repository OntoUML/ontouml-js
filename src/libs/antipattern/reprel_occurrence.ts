import { Class, Relation } from '@libs/ontouml';

export class RepRelOccurrence {
  relator: Class;
  mediations: Relation[];

  constructor(relator: Class, mediations: Relation[]) {
    this.relator = relator;
    this.mediations = mediations;
  }
}