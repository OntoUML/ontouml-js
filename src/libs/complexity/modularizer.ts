import {
  Package,
  Class,
  Relation,
  GeneralizationSet,
  Generalization,
  Classifier,
  ModelElement,
  Diagram,
  OntoumlType,
  Project,
  ClassStereotype,
  RelationStereotype
} from '@libs/ontouml';
import { Module } from './module';
import { flatMap, every, some } from 'lodash';

/**
 * Class that implements clustering algorithms for OntoUML model
 *
 * @author Tiago Sales
 */

// TODO: implement getAllClasses, getAllRelations, getAllGeneralizations, getAllGeneralizationSets to increase code readability
// So that this:
//   const classes: Class[] = model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as Class[];
// Becomes this:
//   const classes: Class[] = model.getAllClasses();

function getClassesByNature(model: Package, nature: string): Class[] {
  const classes: Class[] = model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as Class[];
  return classes.filter(_class => {
    return hasNature(_class, nature);
  });
}

function hasNature(_class: Class, nature: string): boolean {
  return _class.restrictedTo && _class.restrictedTo.length === 1 && _class.restrictedTo[0] === nature;
}

export class Modularizer {
  model: Package;

  constructor(model: Project) {
    this.model = model.rootPackage;
  }

  buildAll(): Diagram[] {
    const relators = getClassesByNature(this.model, 'relator');

    return relators.map((relator, index) => this.buildCluster(String(index), relator).createDiagram(this.model));
  }

  buildCluster(id: string, relator: Class): Module {
    let cluster = new Module(id, 'Cluster of ' + relator.name);

    let relatorChain: Module = Modularizer.getRelatorChain(relator);
    const outgoingMediations = relatorChain.relations;

    cluster.addAll(relatorChain);

    const directlyConnectedClasses = outgoingMediations.map(relation => relation.properties[1].propertyType as Class);
    cluster.addClasses(directlyConnectedClasses);

    let ancestors: Class[] = [];
    let descendants: Class[] = [];
    directlyConnectedClasses.forEach(_class => {
      if (isBaseSortal(_class)) {
        ancestors = ancestors.concat(getSortalAnscestors(_class));
      }
      if (_class.isNonSortal()) {
        descendants = descendants.concat(Modularizer.getNonSortalLine(_class));
      }
    });

    let descendantAncestors: Class[] = flatMap(descendants, descendant => descendant.getAncestors()).filter(ancestor =>
      (ancestor as Class).isSortal()
    ) as Class[];

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
      const specific = g.specific as Classifier;
      const general = g.general as Classifier;
      g.name = specific.name.toLowerCase() + '-|>' + general.name.toLowerCase();
    });

    return cluster;
  }

  static getRelatorChain(relator: Class): Module {
    let cluster = new Module('0', null);
    return this.traverseRelatorChain(relator, cluster);
  }

  static traverseRelatorChain(relator: Class, cluster: Module): Module {
    cluster.addClass(relator);

    getOutgoingRelations(relator, RelationStereotype.MEDIATION, false).forEach(mediation => {
      cluster.addRelation(mediation);
      const target = mediation.properties[1].propertyType;

      if (cluster.containsClass(target)) return;
      if (this.isRelator(target)) {
        cluster = this.traverseRelatorChain(target as Class, cluster);
      }
    });

    relator.getParents().forEach(parent => {
      if (cluster.containsClass(parent)) return;
      if (this.isRelator(parent)) {
        cluster = this.traverseRelatorChain(parent as Class, cluster);
      }
    });

    return cluster;
  }

  static isRelator(element: ModelElement): boolean {
    if (element.type !== OntoumlType.CLASS_TYPE) return false;

    const _class: Class = element as Class;
    return hasNature(_class, 'relator');
  }

  static getNonSortalLine(nonSortal: Class): Class[] {
    return this.traverseNonSortalLine(nonSortal, []);
  }

  static traverseNonSortalLine(nonSortal: Class, path: Class[]): Class[] {
    nonSortal.getChildren().forEach(_class => {
      if (_class.type !== OntoumlType.CLASS_TYPE) return;

      const child = _class as Class;

      if (!child.stereotypes || child.stereotypes.length !== 1) return;

      if (!contains(path, child)) path.push(child as Class);

      if (child.isNonSortal()) path = this.traverseNonSortalLine(child, path);
    });

    return path;
  }
}

function contains<T extends Element>(array: T[], element: T): boolean {
  if (!array) return false;
  return array.findIndex(e => e.id === element.id) >= 0;
}

function getSpecificsFrom(generalizations: Generalization[]): Class[] {
  return generalizations.map(g => g.specific as Class);
}

function getGeneralizationsFrom(genSets: GeneralizationSet[]): Generalization[] {
  return flatMap(genSets, genSet => genSet.generalizations as Generalization[]);
}

function getGeneralizationSetsFrom(model: Package, referenceGens: Generalization[]): GeneralizationSet[] {
  const genSets = model.getAllContentsByType([OntoumlType.GENERALIZATION_SET_TYPE]) as GeneralizationSet[];

  return genSets.filter(genSet => {
    const containsSome = some(genSet.generalizations, gen => referenceGens.find(refGen => refGen.id === gen.id));

    const containsAll = every(genSet.generalizations, gen => referenceGens.find(refGen => refGen.id === gen.id));

    return (containsSome && isPhasePartition(genSet)) || containsAll;
  });
}

function isPhasePartition(genSet: GeneralizationSet) {
  const phasesOnly =
    genSet.generalizations.findIndex(gen => {
      const specific = gen.specific as Class;
      const isPhase = hasClassStereotype(specific, ClassStereotype.PHASE);
      const isPhaseMixin = hasClassStereotype(specific, ClassStereotype.PHASE_MIXIN);

      return !isPhase && !isPhaseMixin;
    }) === -1;

  return genSet.isComplete && genSet.isDisjoint && phasesOnly;
}

function getGeneralizationsBetween(model: Package, classes: Class[]): Generalization[] {
  const generalizations = model.getAllContentsByType([OntoumlType.GENERALIZATION_TYPE]) as Generalization[];

  return generalizations.filter(gen => {
    const childSelected = classes.findIndex(_class => _class.id === gen.specific.id) >= 0;
    const parentSelected = classes.findIndex(_class => _class.id === gen.general.id) >= 0;

    return childSelected && parentSelected;
  });
}

function getSortalAnscestors(_class: Class): Class[] {
  return _class.getAncestors().filter(ancestor => {
    if (ancestor.type !== OntoumlType.CLASS_TYPE) {
      return false;
    }

    return (ancestor as Class).isSortal();
  }) as Class[];
}

function isBaseSortal(_class: Class): boolean {
  return hasAnyOfClassStereotype(_class, [ClassStereotype.SUBKIND, ClassStereotype.ROLE, ClassStereotype.PHASE]);
}

function isBinaryRelation(relation: Relation): boolean {
  return relation.properties && relation.properties.length === 2;
}

function hasRelationStereotype(relation: Relation, stereotype: RelationStereotype) {
  return relation.stereotypes && relation.stereotypes.length === 1 && relation.stereotypes[0] === stereotype;
}

function hasClassStereotype(_class: Class, stereotype: ClassStereotype) {
  return _class.stereotypes && _class.stereotypes.length === 1 && _class.stereotypes[0] === stereotype;
}

function hasAnyOfClassStereotype(_class: Class, stereotypes: ClassStereotype[]) {
  return stereotypes.reduce((result, stereotype) => {
    return result || hasClassStereotype(_class, stereotype);
  }, true);
}

function getOutgoingRelations(_class: Class, stereotype: RelationStereotype, addInherited: boolean): Relation[] {
  let sources: Class[] = addInherited ? [_class, ...(_class.getAncestors() as Class[])] : [_class];
  let relations: Relation[] = flatMap(sources, source => source.getRelations());

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
