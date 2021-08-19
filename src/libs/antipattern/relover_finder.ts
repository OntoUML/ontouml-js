import { Project, Class, RelationStereotype, Relation } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RelOverOccurrence } from './relover_occurrence';
import { OverlappingSet } from './overlapping_set';
import _ from 'lodash';

/**
 * A class designed to find occurrences of the RelOver antipattern in an OntoUML project.
 *
 * RelOver is described in the paper XYZ.
 *
 * @author Tiago Sales
 * @author Claudenir Morais Fonseca
 * @author Mattia Fumagalli
 */

export class RelOverFinder implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  run(): { result: RelOverOccurrence[]; issues?: ServiceIssue[] } {
    const relators = this.project.getClassesWithRelatorStereotype();
    const occurrences0: RelOverOccurrence[] = [];

    for (const relator of relators) {
      const occurrencesOfOne = this.findOverlappingSet0(relator);
      if (!_.isEmpty(occurrencesOfOne)) occurrences0.push(occurrencesOfOne);
    }
    return { result: occurrences0 };
  }

  findOverlappingSet0(relator: Class): RelOverOccurrence {
    const mediations = this.project
      .getAllRelationsByStereotype(RelationStereotype.MEDIATION)
      .filter((mediation: Relation) => mediation.getSourceClass() === relator);
    const targets = mediations.map((mediation: Relation) => mediation.getTargetClass());
    const targetsAncestors = targets.map((target: Class) => target.getAncestors());

    const rel = relator;
    const overlappingSets = [];

    for (let i = 0; i < targetsAncestors.length - 1; i++) {
      for (let j = i + 1; j < targetsAncestors.length; j++) {
        //console.log(`checking array positions i=${i} and j=${j}`);
        const inter = _.intersection(targetsAncestors[i], targetsAncestors[j]);

        // console.log(`checking intersection`, inter);

        if (!_.isEmpty(inter)) {
          const involvedMediations = [mediations[i], mediations[j]];
          const involvedTargets = [targets[i], targets[j]];
          // console.log(`checking mediations`, involvedMediations);
          const involvedAncestor = []; //iterate over the ancestors
          for (let index = 0; index < inter.length; index++) {
            const element = inter[index];
            involvedAncestor.push(element);
          }
          //if no involved ancestors?
          const occurrence = new OverlappingSet(involvedMediations, involvedTargets);
          overlappingSets.push(occurrence);
        }
      }
    }
    if (!_.isEmpty(overlappingSets)) {
      const occurrence0 = new RelOverOccurrence(rel, overlappingSets);
      return occurrence0;
    } else {
      return null;
    }
  }
}