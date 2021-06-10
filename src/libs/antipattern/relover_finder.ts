import { Project, Class, RelationStereotype, Relation } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RelOverOccurrence } from './relover_occurrence';
import _ from 'lodash';

/**
 * A class designed to find occurrences of the RelOver antipattern in an OntoUML project.
 *
 * RelOver is described in the paper XYZ.
 *
 * @author Tiago Sales
 * @author Mattia Fumagalli
 */

export class RelOverFinder implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  // here is where we define how to identify

  run(): { result: RelOverOccurrence[]; issues?: ServiceIssue[] } {
    const relators = this.project.getClassesWithRelatorStereotype();
    const occurrences: RelOverOccurrence[] = [];
    // const allMediations = this.project.getAllRelationsByStereotype(RelationStereotype.MEDIATION);

    // console.log('relators: ', relators);

    for (const relator of relators) {
      const occurrencesOfOne = this.checkVariantOne(relator);
      const occurrencesOfTwo = this.checkVariantTwo(relator);

      if (!_.isEmpty(occurrencesOfOne)) occurrences.push(...occurrencesOfOne);
      // if(!_.isEmpty(occurrencesOfTwo))  occurrences.push(...occurrencesOfTwo);
    }

    // get the mediations
    // get the mediations' targets
    // get the ancestors/descendants of the targets
    // look for some overlap

    // let occurrences = relators
    //   .filter(relator => true /** replace with condition that*/)

    //   .map(relator => new RelOverOccurrence(relator));

    return { result: occurrences };
  }

  checkVariantOne(relator: Class): RelOverOccurrence[] {
    // console.log('Running occurrence one check');

    const mediations = this.project
      .getAllRelationsByStereotype(RelationStereotype.MEDIATION)
      .filter((mediation: Relation) => mediation.getSourceClass() === relator);
    const targets = mediations.map((mediation: Relation) => mediation.getTargetClass());
    const targetsAncestors = targets.map((target: Class) => target.getAncestors());
    const overlap = _.intersection(...targetsAncestors); // start from here...

    // console.log('target: ', targets);
    console.log('ancestor: ', targetsAncestors);
    console.log('overlap: ', overlap);

    return overlap.map((ancestor: Class) => new RelOverOccurrence(relator, mediations, targets, ancestor));
  }

  checkVariantTwo(relator: Class): RelOverOccurrence[] {
    return null;
  }
}
