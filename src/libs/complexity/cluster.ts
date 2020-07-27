import { IPackage, IClass, IGeneralizationSet, IGeneralization, IRelation, IElement, IReference } from '@types';
import { Diagram } from './diagram';
import { uniqBy } from 'lodash';

export class Cluster {
  id: string;
  name: string;
  classes: IClass[];
  relations: IRelation[];
  generalizations: IGeneralization[];
  generalizationSets: IGeneralizationSet[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.classes = [];
    this.relations = [];
    this.generalizations = [];
    this.generalizationSets = [];
  }

  createDiagram(owner: IPackage): Diagram {
    let diagram = new Diagram(this.id, this.name, null, owner);
    diagram.addShapes(this.classes);
    diagram.addLines(this.relations);
    diagram.addLines(this.generalizations);
    diagram.addLabels(this.generalizationSets);

    return diagram;
  }

  addClass(_class: IClass): boolean {
    if (!_class) return false;

    this.classes.push(_class);
    return true;
  }

  containsClass(_class: IElement | IReference): boolean {
    return this.classes.findIndex(c => c.id === _class.id) >= 0;
  }

  addClasses(classes: IClass[]) {
    this.classes = this.classes.concat(classes);
  }

  addRelation(relation: IRelation): boolean {
    if (!relation) return false;

    this.relations.push(relation);
    return true;
  }

  containsRelation(relation: IElement): boolean {
    return this.relations.findIndex(r => r.id === relation.id) >= 0;
  }

  addRelations(relations: IRelation[]) {
    this.relations = this.relations.concat(relations);
  }

  addGeneralization(generalization: IGeneralization): boolean {
    if (!generalization) return false;

    this.generalizations.push(generalization);
    return true;
  }

  addGeneralizations(generalizations: IGeneralization[]) {
    this.generalizations = this.generalizations.concat(generalizations);
  }

  addGeneralizationSet(generalizationSet: IGeneralizationSet): boolean {
    if (!generalizationSet) return false;

    this.generalizationSets.push(generalizationSet);
    return true;
  }

  addGeneralizationSets(generalizationSets: IGeneralizationSet[]) {
    this.generalizationSets = this.generalizationSets.concat(generalizationSets);
  }

  removeDuplicates() {
    this.classes = Cluster.removeDuplicatesArray(this.classes);
    this.relations = Cluster.removeDuplicatesArray(this.relations);
    this.generalizations = Cluster.removeDuplicatesArray(this.generalizations);
    this.generalizationSets = Cluster.removeDuplicatesArray(this.generalizationSets);
  }

  static removeDuplicatesArray<T extends IElement>(elements: T[]): T[] {
    return uniqBy(elements, 'id');
  }

  addAll(cluster: Cluster): boolean {
    if (!cluster) return false;

    this.addClasses(cluster.classes);
    this.addRelations(cluster.relations);
    this.addGeneralizations(cluster.generalizations);
    this.addGeneralizationSets(cluster.generalizationSets);

    this.removeDuplicates();
    return true;
  }
}
