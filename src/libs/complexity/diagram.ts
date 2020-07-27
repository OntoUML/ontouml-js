import {
  IElement,
  IClass,
  IDiagram,
  IDiagramElement,
  IReference,
  IRelation,
  IGeneralizationSet,
  IGeneralization,
} from '@types';
import { Shape, Line, Label } from './diagram_element';

export class Diagram implements IDiagram {
  type: string;
  id: string;
  name: string;
  description: string;
  owner: IReference;
  contents: IDiagramElement[];

  constructor(id: string, name: string, description: string, owner: IElement) {
    this.id = id;
    this.type = 'Diagram';
    this.name = name;
    this.description = description;
    this.owner = {
      type: owner.type,
      id: owner.id,
    };
    this.contents = [];
  }

  public addElement(element: IDiagramElement) {
    this.contents.push(element);
  }

  public addShape(_class: IClass) {
    this.addElement(new Shape(_class));
  }

  public addShapes(classes: IClass[]) {
    classes.forEach(_class => this.addShape(_class));
  }

  public addLine(relation: IRelation | IGeneralization) {
    this.addElement(new Line(relation));
  }

  public addLines(relations: IRelation[] | IGeneralization[]) {
    relations.forEach(relation => this.addLine(relation));
  }

  public addLabel(genSet: IGeneralizationSet) {
    this.addElement(new Label(genSet));
  }

  public addLabels(genSets: IGeneralizationSet[]) {
    genSets.forEach(genSet => this.addLabel(genSet));
  }
}
