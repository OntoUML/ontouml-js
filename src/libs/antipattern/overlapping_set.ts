import { Class, Relation } from '@libs/ontouml';

export class OverlappingSet {
  mediations: Relation[];
  targets: Class[];

  constructor(mediations: Relation[], targets: Class[]) {
    this.mediations = mediations;
    this.targets = targets;
  }
}
