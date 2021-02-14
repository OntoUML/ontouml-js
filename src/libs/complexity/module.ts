import { Package, Class, GeneralizationSet, Generalization, Relation, ModelElement } from '@libs/ontouml';
import { Diagram } from '@libs/ontouml';
import { uniqBy } from 'lodash';

export class Module {
  id: string;
  name: string;
  classes: Class[];
  relations: Relation[];
  generalizations: Generalization[];
  generalizationSets: GeneralizationSet[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.classes = [];
    this.relations = [];
    this.generalizations = [];
    this.generalizationSets = [];
  }

  createDiagram(owner: Package): Diagram {
    let diagram = new Diagram(this.id, this.name, null, owner);
    diagram.addShapes(this.classes);
    diagram.addLines(this.relations);
    diagram.addLines(this.generalizations);
    diagram.addLabels(this.generalizationSets);

    return diagram;
  }

  addClass(_class: Class): boolean {
    if (!_class) return false;

    this.classes.push(_class);
    return true;
  }

  containsClass(_class: ModelElement): boolean {
    return this.classes.findIndex(c => c.id === _class.id) >= 0;
  }

  addClasses(classes: Class[]) {
    this.classes = this.classes.concat(classes);
  }

  addRelation(relation: Relation): boolean {
    if (!relation) return false;

    this.relations.push(relation);
    return true;
  }

  containsRelation(relation: ModelElement): boolean {
    return this.relations.findIndex(r => r.id === relation.id) >= 0;
  }

  addRelations(relations: Relation[]) {
    this.relations = this.relations.concat(relations);
  }

  addGeneralization(generalization: Generalization): boolean {
    if (!generalization) return false;

    this.generalizations.push(generalization);
    return true;
  }

  addGeneralizations(generalizations: Generalization[]) {
    this.generalizations = this.generalizations.concat(generalizations);
  }

  addGeneralizationSet(generalizationSet: GeneralizationSet): boolean {
    if (!generalizationSet) return false;

    this.generalizationSets.push(generalizationSet);
    return true;
  }

  addGeneralizationSets(generalizationSets: GeneralizationSet[]) {
    this.generalizationSets = this.generalizationSets.concat(generalizationSets);
  }

  removeDuplicates() {
    this.classes = Module.removeDuplicatesArray(this.classes);
    this.relations = Module.removeDuplicatesArray(this.relations);
    this.generalizations = Module.removeDuplicatesArray(this.generalizations);
    this.generalizationSets = Module.removeDuplicatesArray(this.generalizationSets);
  }

  static removeDuplicatesArray<T extends ModelElement>(elements: T[]): T[] {
    return uniqBy(elements, 'id');
  }

  addAll(cluster: Module): boolean {
    if (!cluster) return false;

    this.addClasses(cluster.classes);
    this.addRelations(cluster.relations);
    this.addGeneralizations(cluster.generalizations);
    this.addGeneralizationSets(cluster.generalizationSets);

    this.removeDuplicates();
    return true;
  }
}
