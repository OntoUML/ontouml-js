import { ModelManager } from '@libs/model';
import {
  IPackage,
  IClass,
  IRelation,
  IGeneralizationSet,
  IGeneralization,
  IClassifier,
  IElement,
  IReference,
  IDiagram,
} from '@types';
import { OntoUMLType, ClassStereotype, RelationStereotype } from '@constants/.';
import { Cluster } from './cluster';
import { flatMap, every, some } from 'lodash';

/**
 * Class that implements clustering algorithms for OntoUML model
 *
 * @author Tiago Sales
 */

// TODO: implement getAllClasses, getAllRelations, getAllGeneralizations, getAllGeneralizationSets to increase code readability
// So that this:
//   const classes: IClass[] = model.getAllContentsByType([OntoUMLType.CLASS_TYPE]) as IClass[];
// Becomes this:
//   const classes: IClass[] = model.getAllClasses();

function getClassesByNature(model: IPackage, nature: string): IClass[] {
  const classes: IClass[] = model.getAllContentsByType([OntoUMLType.CLASS_TYPE]) as IClass[];
  return classes.filter(_class => {
    return hasNature(_class, nature);
  });
}

function hasNature(_class: IClass, nature: string): boolean {
  return _class.allowed && _class.allowed.length === 1 && _class.allowed[0] === nature;
}

export class ClusterFinder {
  model: IPackage;

  constructor(model: ModelManager) {
    this.model = model.rootPackage;
  }

  buildAll(): IDiagram[] {
    const relators = getClassesByNature(this.model, 'relator');

    return relators.map((relator, index) =>
      this.buildCluster(String(index), relator).createDiagram(this.model)
    );
  }

  buildCluster(id: string, relator: IClass): Cluster {
    let cluster = new Cluster(id, 'Cluster of ' + relator.name);

    let relatorChain: Cluster = ClusterFinder.getRelatorChain(relator);
    const outgoingMediations = relatorChain.relations;

    cluster.addAll(relatorChain);

    const directlyConnectedClasses = outgoingMediations.map(
      relation => relation.properties[1].propertyType as IClass
    );
    cluster.addClasses(directlyConnectedClasses);

    let ancestors: IClass[] = [];
    let descendants: IClass[] = [];
    directlyConnectedClasses.forEach(_class => {
      if (isBaseSortal(_class)) {
        ancestors = ancestors.concat(getSortalAnscestors(_class));
      }
      if (_class.isNonSortal()) {
        descendants = descendants.concat(ClusterFinder.getNonSortalLine(_class));
      }
    });

    let descendantAncestors: IClass[] = flatMap(descendants, descendant => descendant.getAncestors()).filter(
      ancestor => (ancestor as IClass).isSortal()
    ) as IClass[];

    cluster.addClasses(ancestors);
    cluster.addClasses(descendants);
    cluster.addClasses(descendantAncestors);
    cluster.removeDuplicates();

    cluster.addGeneralizations(getGeneralizationsBetween(this.model, cluster.classes));

    const genSets = getGeneralizationSetsFrom(this.model, cluster.generalizations);
    cluster.addGeneralizationSets(genSets);
    const complementGens = getGeneralizationsFrom(cluster.generalizationSets);
    cluster.addGeneralizations(complementGens);
    const complementClasses = getSpecificsFrom(complementGens);
    cluster.addClasses(complementClasses);

    cluster.removeDuplicates();

    cluster.generalizations.forEach(g => {
      const specific = g.specific as IClassifier;
      const general = g.general as IClassifier;
      g.name = specific.name.toLowerCase() + '-|>' + general.name.toLowerCase();
    });

    return cluster;
  }

  static getRelatorChain(relator: IClass): Cluster {
    let cluster = new Cluster('0', null);
    return this.traverseRelatorChain(relator, cluster);
  }

  static traverseRelatorChain(relator: IClass, cluster: Cluster): Cluster {
    cluster.addClass(relator);

    getOutgoingRelations(relator, RelationStereotype.MEDIATION, false).forEach(mediation => {
      cluster.addRelation(mediation);
      const target = mediation.properties[1].propertyType;

      if (cluster.containsClass(target)) return;
      if (this.isRelator(target)) {
        cluster = this.traverseRelatorChain(target as IClass, cluster);
      }
    });

    relator.getParents().forEach(parent => {
      if (cluster.containsClass(parent)) return;
      if (this.isRelator(parent)) {
        cluster = this.traverseRelatorChain(parent as IClass, cluster);
      }
    });

    return cluster;
  }

  static isRelator(element: IElement | IReference): boolean {
    if (element.type !== OntoUMLType.CLASS_TYPE) return false;

    const _class: IClass = element as IClass;
    return hasNature(_class, 'relator');
  }

  static getNonSortalLine(nonSortal: IClass): IClass[] {
    return this.traverseNonSortalLine(nonSortal, []);
  }

  static traverseNonSortalLine(nonSortal: IClass, path: IClass[]): IClass[] {
    nonSortal.getChildren().forEach(_class => {
      if (_class.type !== OntoUMLType.CLASS_TYPE) return;

      const child = _class as IClass;

      if (!child.stereotypes || child.stereotypes.length !== 1) return;

      if (!contains(path, child)) path.push(child as IClass);

      if (child.isNonSortal()) path = this.traverseNonSortalLine(child, path);
    });

    return path;
  }
}

function contains<T extends IElement>(array: T[], element: T): boolean {
  if (!array) return false;
  return array.findIndex(e => e.id === element.id) >= 0;
}

function getSpecificsFrom(generalizations: IGeneralization[]): IClass[] {
  return generalizations.map(g => g.specific as IClass);
}

function getGeneralizationsFrom(genSets: IGeneralizationSet[]): IGeneralization[] {
  return flatMap(genSets, genSet => genSet.generalizations as IGeneralization[]);
}

function getGeneralizationSetsFrom(model: IPackage, referenceGens: IGeneralization[]): IGeneralizationSet[] {
  const genSets = model.getAllContentsByType([OntoUMLType.GENERALIZATION_SET_TYPE]) as IGeneralizationSet[];

  return genSets.filter(genSet => {
    const containsSome = some(genSet.generalizations, gen =>
      referenceGens.find(refGen => refGen.id === gen.id)
    );

    const containsAll = every(genSet.generalizations, gen =>
      referenceGens.find(refGen => refGen.id === gen.id)
    );

    return (containsSome && isPhasePartition(genSet)) || containsAll;
  });
}

function isPhasePartition(genSet: IGeneralizationSet) {
  const phasesOnly =
    genSet.generalizations.findIndex(gen => {
      const specific = gen.specific as IClass;
      const isPhase = hasClassStereotype(specific, ClassStereotype.PHASE);
      const isPhaseMixin = hasClassStereotype(specific, ClassStereotype.PHASE_MIXIN);

      return !isPhase && !isPhaseMixin;
    }) === -1;

  return genSet.isComplete && genSet.isDisjoint && phasesOnly;
}

function getGeneralizationsBetween(model: IPackage, classes: IClass[]): IGeneralization[] {
  const generalizations = model.getAllContentsByType([OntoUMLType.GENERALIZATION_TYPE]) as IGeneralization[];

  return generalizations.filter(gen => {
    const childSelected = classes.findIndex(_class => _class.id === gen.specific.id) >= 0;
    const parentSelected = classes.findIndex(_class => _class.id === gen.general.id) >= 0;

    return childSelected && parentSelected;
  });
}

function getSortalAnscestors(_class: IClass): IClass[] {
  return _class.getAncestors().filter(ancestor => {
    if (ancestor.type !== OntoUMLType.CLASS_TYPE) {
      return false;
    }

    return (ancestor as IClass).isSortal();
  }) as IClass[];
}

function isBaseSortal(_class: IClass): boolean {
  return hasAnyOfClassStereotype(_class, [
    ClassStereotype.SUBKIND,
    ClassStereotype.ROLE,
    ClassStereotype.PHASE,
  ]);
}

function isBinaryRelation(relation: IRelation): boolean {
  return relation.properties && relation.properties.length === 2;
}

function hasRelationStereotype(relation: IRelation, stereotype: RelationStereotype) {
  return relation.stereotypes && relation.stereotypes.length === 1 && relation.stereotypes[0] === stereotype;
}

function hasClassStereotype(_class: IClass, stereotype: ClassStereotype) {
  return _class.stereotypes && _class.stereotypes.length === 1 && _class.stereotypes[0] === stereotype;
}

function hasAnyOfClassStereotype(_class: IClass, stereotypes: ClassStereotype[]) {
  return stereotypes.reduce((result, stereotype) => {
    return result || hasClassStereotype(_class, stereotype);
  }, true);
}

function getOutgoingRelations(
  _class: IClass,
  stereotype: RelationStereotype,
  addInherited: boolean
): IRelation[] {
  let sources: IClass[] = addInherited ? [_class, ...(_class.getAncestors() as IClass[])] : [_class];
  let relations: IRelation[] = flatMap(sources, source => source.getRelations());

  if (!relations) {
    return [];
  }

  let sourceIds: string[] = sources.map(source => source.id);

  return relations.filter(relation => {
    return (
      hasRelationStereotype(relation, stereotype) &&
      isBinaryRelation(relation) &&
      sourceIds.includes(relation.properties[0].propertyType.id)
    );
  });
}
