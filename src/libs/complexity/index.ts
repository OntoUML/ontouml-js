import { ModelManager } from '@libs/model';
import { IPackage, IClass, IRelation, IGeneralizationSet, IGeneralization, IClassifier, IElement } from '@types';
import { OntoUMLType, ClassStereotype, RelationStereotype } from '@constants/.';
import { Cluster } from './cluster';
import { flatMap } from 'lodash';

/**
 * Class that implements clustering algorithms for OntoUML model
 *
 * @author Tiago Sales
 */
export class ClusterFinder {
  model: IPackage;

  constructor(model: ModelManager) {
    this.model = model.rootPackage;
  }

  find() {
    const elements = this.model.getAllContentsByType([OntoUMLType.CLASS_TYPE]) as IClass[];

    const relators = elements.filter(_class => {
      return hasClassStereotype(_class, ClassStereotype.RELATOR);
    });

    return relators.map((relator, index) => {
      let cluster = new Cluster(String(index), relator);

      const outgoingRelations = getOutgoingRelations(relator, RelationStereotype.MEDIATION);
      cluster.addRelations(outgoingRelations);

      const directlyConnectedClasses = outgoingRelations.map(relation => {
        return relation.properties[1].propertyType as IClass;
      });
      cluster.addClasses(directlyConnectedClasses);

      let ancestors: IClass[] = [];
      let descendants: IClass[] = [];
      directlyConnectedClasses.forEach(_class => {
        if (isBaseSortal(_class)) {
          ancestors = ancestors.concat(getSortalAnscestors(_class));
        }
        if (_class.isNonSortal()) {
          descendants = descendants.concat(getDescendantsNonSortalLine(_class));
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

      return cluster.createDiagram(this.model);
    });
  }
}

export function getDescendantsNonSortalLine(nonSortal: IClass): IClass[] {
  return traverseChildren(nonSortal, []);
}

function traverseChildren(nonSortal: IClass, path: IClass[]): IClass[] {
  nonSortal.getChildren().forEach(_class => {
    if (_class.type !== OntoUMLType.CLASS_TYPE) return;

    const child = _class as IClass;

    if (!child.stereotypes || child.stereotypes.length !== 1) return;

    if (!contains(path, child)) path.push(child as IClass);

    if (child.isNonSortal()) path = traverseChildren(child, path);
  });

  return path;
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
    return (
      genSet.generalizations.findIndex(gen => {
        const isReference =
          referenceGens.findIndex(refGen => {
            return refGen.id === gen.id;
          }) >= 0;
        return isReference;
      }) >= 0
    );
  });
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
  return hasAnyOfClassStereotype(_class, [ClassStereotype.SUBKIND, ClassStereotype.ROLE, ClassStereotype.PHASE]);
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

function getOutgoingRelations(_class: IClass, stereotype: RelationStereotype): IRelation[] {
  if (!_class.getRelations()) {
    return [];
  }

  return _class.getRelations().filter(relation => {
    return (
      hasRelationStereotype(relation, stereotype) &&
      isBinaryRelation(relation) &&
      relation.properties[0].propertyType.id === _class.id
    );
  });
}
