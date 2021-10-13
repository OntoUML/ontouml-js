import { Project, Class, RelationStereotype, Relation } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RepRelOccurrence } from './reprel_occurrence';
import _, { noConflict } from 'lodash';

/**
 * A class designed to find occurrences of the RelOver antipattern in an OntoUML project.
 *
 * RelOver is described in the paper XYZ.
 *
 * @author Tiago Sales
 * @author Mattia Fumagalli
 *
 */

export class RepRelFinder implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  run(): { result: RepRelOccurrence[]; issues?: ServiceIssue[] } {
    const relators = this.project.getClassesWithRelatorStereotype();
    const antiPatternOccurrences: RepRelOccurrence[] = [];

    for (const relator of relators) {
      const FoundOccurrences = this.findOccurrence(relator);
      if (!_.isEmpty(FoundOccurrences)) antiPatternOccurrences.push(FoundOccurrences);
    }
    return { result: antiPatternOccurrences };
  }

  findOccurrence(relator: Class): RepRelOccurrence {
    const mediations = this.project
      .getAllRelationsByStereotype(RelationStereotype.MEDIATION)
      .filter(mediation => mediation.getSourceClass() === relator);

    const mediationProperties = mediations.map(mediation => mediation.getSourceEnd());
    const sourceCardinalities = mediationProperties.map(sourceCardinality => sourceCardinality.cardinality);
    const sourceCardinalitiesUpperBound = sourceCardinalities.map(upperBound => upperBound.getUpperBoundAsNumber());

    if (mediations && mediations.length >= 2) {
      const cardinalitiesCheck = sourceCardinalitiesUpperBound.filter(x => x > 1);
      if (cardinalitiesCheck && cardinalitiesCheck.length >= 2) return new RepRelOccurrence(relator, mediations);
      console.log(`cardinalities check: `, cardinalitiesCheck);
    }
    return null;
  }
}
