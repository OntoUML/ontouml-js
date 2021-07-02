import { every, some } from 'lodash';

import { Class, GeneralizationSet, Generalization, Diagram, Project } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';

import { Module } from './module';

/**
 * Class that implements the relation-based model clustering strategy proposed in:
 *
 * Guizzardi G., Prince Sales T., Almeida J.P.A., Poels G. (2020) Relational Contexts and Conceptual Model Clustering.
 * In: Grabis J., Bork D. (eds) The Practice of Enterprise Modeling. PoEM 2020. Lecture Notes in Business Information
 * Processing, vol 400. Springer, Cham. https://doi.org/10.1007/978-3-030-63479-7_15
 *
 * @author Tiago Sales
 */

export class Modularizer implements Service {
  project: Project;

  constructor(project: Project, _options?: any) {
    this.project = project;

    if (_options) {
      console.log('Options ignored: this service does not support options');
    }
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    let generatedDiagrams = this.buildAll();
    this.project.addDiagrams(generatedDiagrams);

    return {
      result: this.project,
      issues: null
    };
  }

  buildAll(): Diagram[] {
    // console.time('timer');
    // console.log('Retrieving relators...');
    // const relators = this.project.getClassesRestrictedToRelator();
    // // console.log('Relators retrieved! (' + relators.length + ')');
    // // console.timeEnd('timer');

    // // console.log('Building modules...');
    // const modules = relators.map((relator, index) => this.buildModule(String(index), relator));
    // // console.log('Modules built! (' + modules.length + ')');

    // // console.log('Building diagrams...');
    // const diagrams = modules.map(module => module.createDiagram(this.project.model));
    // // console.log('Diagrams built! (' + modules.length + ')');
    // return diagrams;

    return this.project
      .getClassesRestrictedToRelator()
      .map((relator, index) => this.buildModule(String(index), relator))
      .map(module => module.createDiagram(this.project.model));
  }

  buildModule(id: string, relator: Class): Module {
    let cluster = new Module(relator.getName() + ' Cluster');

    // console.time('timer');
    // console.log('Getting relator chain for ' + relator.getName());
    let relatorChain = Modularizer.getRelatorChain(relator);
    cluster.addAll(relatorChain);
    // console.timeEnd('timer');

    const outgoingMediations = relatorChain.relations;

    const directlyConnectedClasses = outgoingMediations
      .filter(r => r.isBinaryClassRelation())
      .map(relation => relation.getTargetClass());
    cluster.addClasses(directlyConnectedClasses);

    let ancestors: Class[] = [];
    let descendants: Class[] = [];
    directlyConnectedClasses.forEach(_class => {
      if (_class.hasBaseSortalStereotype()) {
        ancestors = ancestors.concat(_class.getSortalAncestors());
      }
      if (_class.hasNonSortalStereotype()) {
        descendants = descendants.concat(Modularizer.getNonSortalLine(_class));
      }
    });

    let descendantAncestors: Class[] = descendants
      .flatMap(clazz => clazz.getAncestors())
      .filter(clazz => clazz instanceof Class)
      .filter(clazz => clazz.hasSortalStereotype());

    cluster.addClasses(ancestors);
    cluster.addClasses(descendants);
    cluster.addClasses(descendantAncestors);
    cluster.removeDuplicates();

    cluster.addGeneralizations(this.project.getGeneralizationsBetween(cluster.classes));

    const genSets = this.getGeneralizationSetsFrom(cluster.generalizations);
    cluster.addGeneralizationSets(genSets);
    const complementGens = GeneralizationSet.collectGeneralizations(cluster.generalizationSets);
    cluster.addGeneralizations(complementGens);
    const complementClasses = GeneralizationSet.collectSpecifics(complementGens).filter(s => s instanceof Class) as Class[];
    cluster.addClasses(complementClasses);

    cluster.removeDuplicates();

    return cluster;
  }

  static getRelatorChain(relator: Class): Module {
    let module = new Module('Relator chain: ' + relator.getName());
    return this.traverseRelatorChain(relator, module);
  }

  private static traverseRelatorChain(relator: Class, module: Module): Module {
    module.classes.push(relator);

    relator
      .getOwnOutgoingRelations()
      .filter(r => r.isMediation())
      .forEach(mediation => {
        module.relations.push(mediation);
        const target = mediation.getTarget();
        if (!(target instanceof Class) || module.classes.includes(target)) return;

        if (target.isRestrictedToRelator()) {
          module = this.traverseRelatorChain(target, module);
        }
      });

    relator.getParents().forEach(parent => {
      if (!(parent instanceof Class) || module.classes.includes(parent)) return;
      if (parent.isRestrictedToRelator()) {
        module = this.traverseRelatorChain(parent, module);
      }
    });

    return module;
  }

  static getNonSortalLine(nonSortal: Class): Class[] {
    return this.traverseNonSortalLine(nonSortal, []);
  }

  private static traverseNonSortalLine(nonSortal: Class, path: Class[]): Class[] {
    nonSortal.getChildren().forEach(child => {
      if (!(child instanceof Class) || !child.stereotype) return;

      if (!path.includes(child)) path.push(child);

      if (child.hasNonSortalStereotype()) path = this.traverseNonSortalLine(child, path);
    });

    return path;
  }

  getGeneralizationSetsFrom(referenceGens: Generalization[]): GeneralizationSet[] {
    let gsInvolvesAll = this.getGeneralizationSetsInvolvingAll(referenceGens);
    let partitionInvolvesAny = this.getGeneralizationSetsInvolvingAny(referenceGens).filter(gs => gs.isPhasePartition());

    return [...gsInvolvesAll, ...partitionInvolvesAny];
  }

  /** Returns every generalization set that involves at least of the generalizations in the input array */
  getGeneralizationSetsInvolvingAny(generalizations: Generalization[]): GeneralizationSet[] {
    return generalizations
      .flatMap(gen => gen.getGeneralizationSets())
      .filter(gs => some(gs.generalizations, gen => generalizations.find(refGen => refGen.id === gen.id)));
  }

  /** Returns every generalization set that involves at least of the generalizations in the input array */
  getGeneralizationSetsInvolvingAll(generalizations: Generalization[]): GeneralizationSet[] {
    return generalizations
      .flatMap(gen => gen.getGeneralizationSets())
      .filter(gs => every(gs.generalizations, gen => generalizations.find(refGen => refGen.id === gen.id)));
  }
}
