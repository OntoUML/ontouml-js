import { IPackage, IClass, IGeneralizationSet, IGeneralization, IRelation, IElement } from '@types';
import { Diagram } from './diagram';
import { uniqBy } from 'lodash';

export class Cluster {
  id: string;
  name: string;
  relator: IClass;
  classes: IClass[];
  relations: IRelation[];
  generalizations: IGeneralization[];
  generalizationSets: IGeneralizationSet[];

  constructor(id: string, relator: IClass) {
    this.id = id;
    this.name = 'Cluster of ' + relator.name;
    this.relator = relator;
    this.classes = [relator];
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

  addClasses(classes: IClass[]) {
    this.classes = this.classes.concat(classes);
  }

  addRelations(relations: IRelation[]) {
    this.relations = this.relations.concat(relations);
  }

  addGeneralizations(generalizations: IGeneralization[]) {
    this.generalizations = this.generalizations.concat(generalizations);
  }

  addGeneralizationSets(generalizationSets: IGeneralizationSet[]) {
    this.generalizationSets = this.generalizationSets.concat(generalizationSets);
  }

  removeDuplicates() {
    this.classes = this.removeDuplicatesArray(this.classes);
    this.relations = this.removeDuplicatesArray(this.relations);
    this.generalizations = this.removeDuplicatesArray(this.generalizations);
    this.generalizationSets = this.removeDuplicatesArray(this.generalizationSets);
  }

  private removeDuplicatesArray<T extends IElement>(elements: T[]): T[] {
    return uniqBy(elements, 'id');
  }
}
