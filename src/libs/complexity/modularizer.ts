import { Class, GeneralizationSet, Generalization, Diagram, Project } from '@libs/ontouml';
import { Module } from './module';

/**
 * Class that implements clustering algorithms for OntoUML model
 *
 * @author Tiago Sales
 */

export class Modularizer {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  buildAll(): Diagram[] {
    return this.project
      .getClassesRestrictedToRelator()
      .map((relator, index) => this.buildModule(String(index), relator))
      .map(module => module.createDiagram(this.project.model));
  }

  buildModule(id: string, relator: Class): Module {
    let cluster = new Module(id, 'Cluster of ' + relator.getName());

    let relatorChain = Modularizer.getRelatorChain(relator);
    cluster.addAll(relatorChain);

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

    cluster.generalizations.forEach(g => {
      let name = g?.specific?.getName()?.toLowerCase() + '-|>' + g?.general?.getName()?.toLowerCase();
      g.setName(name);
    });

    return cluster;
  }

  static getRelatorChain(relator: Class): Module {
    let module = new Module('0', null);
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
    let gsInvolvesAll = this.project.getGeneralizationSetsInvolvingAll(referenceGens);
    let partitionInvolvesAny = this.project.getGeneralizationSetsInvolvingAny(referenceGens).filter(gs => gs.isPhasePartition());

    return [...gsInvolvesAll, ...partitionInvolvesAny];
  }
}
