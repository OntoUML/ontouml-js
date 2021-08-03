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

    // const overlap = _.intersection(...targetsAncestors); // start from here... (when are not exclusive!!!)
    // you must do a pairwise check for intersections on the targetAncestors array

    // console.log('targetsAncestors', targetsAncestors);
    // console.log(
    //   'targetsAncestors',
    //   targetsAncestors.map(ancestors => ancestors.map(ancestor => ancestor.getName()))
    // );

    const occurrences = [];

    for (let i = 0; i < targetsAncestors.length - 1; i++) {
      for (let j = i + 1; j < targetsAncestors.length; j++) {
        console.log(`checking array positions i=${i} and j=${j}`);
        const inter = _.intersection(targetsAncestors[i], targetsAncestors[j]);

        if (!_.isEmpty(inter)) {
          const involvedMediations = [mediations[i], mediations[j]];
          const involvedTargets = [targets[i], targets[j]];
          const involvedAncestor = inter[0]; // TODO: the targets may share multiple ancestors; deal with that
          const occurrence = new RelOverOccurrence(relator, involvedMediations, involvedTargets, involvedAncestor);

          occurrences.push(occurrence);
        }
      }
    }

    return occurrences;

    // var targetsAncestors0 = [];
    // targetsAncestors.forEach(valueX => {
    //   const nest = [valueX];
    //   targetsAncestors0.push(nest);
    // });

    // const pairsOfArray = array =>
    //   array.reduce(
    //     (acc, val, i1) => [...acc, ...new Array(array.length - 1 - i1).fill(0).map((v, i2) => [array[i1], array[i1 + 1 + i2]])],
    //     []
    //   );
    // const pairs = pairsOfArray(targetsAncestors0);

    // //console.log(pairs);

    // const overlap = [];
    // pairs.forEach(([value0, value1]) => {
    //   const overlap0 = _.intersection(value0, value1);
    //   overlap.push(overlap0);
    // });

    // return overlap.map((ancestor: Class) => new RelOverOccurrence(relator, mediations, targets, ancestor));
  }

  checkVariantTwo(relator: Class): RelOverOccurrence[] {
    return null;
  }
}
