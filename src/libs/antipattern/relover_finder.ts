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
 * @author Claudenir Morais Fonseca
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
      if (!_.isEmpty(occurrencesOfTwo)) occurrences.push(...occurrencesOfTwo);
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

          const involvedAncestor = []; //iterate over the ancestors
          for (let index = 0; index < inter.length; index++) {
            const element = inter[index];
            involvedAncestor.push(element);
          }
          const occurrence = new RelOverOccurrence(relator, involvedMediations, involvedTargets, involvedAncestor[i]);
          occurrences.push(occurrence);

          // const involvedAncestor = inter[0]; // TODO: the targets may share multiple ancestors; deal with that
          // const occurrence = new RelOverOccurrence(relator, involvedMediations, involvedTargets, involvedAncestor);
          // occurrences.push(occurrence);
        }
      }
    }

    return occurrences;
  }

  checkVariantTwo(relator: Class): RelOverOccurrence[] {
    const mediations = this.project
      .getAllRelationsByStereotype(RelationStereotype.MEDIATION)
      .filter((mediation: Relation) => mediation.getSourceClass() === relator);
    const targets = mediations.map((mediation: Relation) => mediation.getTargetClass());
    const targetsDescendants = targets.map((target: Class) => target.getDescendants());

    console.log(
      'targetsDescendants',
      targetsDescendants.map(descendants => descendants.map(descendants => descendants.getName()))
    );

    const occurrences = [];

    for (let i = 0; i < targetsDescendants.length - 1; i++) {
      for (let j = i + 1; j < targetsDescendants.length; j++) {
        console.log(`checking array positions i=${i} and j=${j}`);
        const inter = _.intersection(targetsDescendants[i], targetsDescendants[j]);

        if (!_.isEmpty(inter)) {
          const involvedMediations = [mediations[i], mediations[j]];
          const involvedTargets = [targets[i], targets[j]];

          const involvedDescendant = []; //iterate over the ancestors
          for (let index = 0; index < inter.length; index++) {
            const element = inter[index];
            involvedDescendant.push(element);
          }
          const occurrence = new RelOverOccurrence(relator, involvedMediations, involvedTargets, involvedDescendant[i]);
          occurrences.push(occurrence);
        }
      }
    }

    return occurrences;
  }
}
