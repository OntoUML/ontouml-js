import { ModelElement } from '..';
import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { ElementView } from '..';

export class Diagram extends OntoumlElement {
  owner: ModelElement;
  contents: ElementView<any, any>[];

  constructor(base: Partial<Diagram>) {
    super(OntoumlType.DIAGRAM, base);
    this.owner = base.owner || null;
    this.contents = base.contents || [];
  }

  getContents(): OntoumlElement[] {
    return [...this.contents];
  }

  addElement(element: ElementView<any, any>): void {
    if (!element) return;
    this.setContainer(element);
    this.contents.push(element);
  }

  addElements(elements: ElementView<any, any>[]): void {
    if (!elements) return;
    elements.forEach(e => this.addElement(e));
  }

  setElements(elements: ElementView<any, any>[]): void {
    this.contents = [];
    if (!elements) return;
    this.addElements(elements);
  }

  // addShape(_class: Class) {
  //   this.addElement(new Shape(_class));
  // }

  // addShapes(classes: Class[]) {
  //   classes.forEach(_class => this.addShape(_class));
  // }

  // addLine(relation: Relation | Generalization) {
  //   this.addElement(new Line(relation));
  // }

  // addLines(relations: Relation[] | Generalization[]) {
  //   relations.forEach(relation => this.addLine(relation));
  // }

  // addLabel(genSet: GeneralizationSet) {
  //   this.addElement(new Label(genSet));
  // }

  // addLabels(genSets: GeneralizationSet[]) {
  //   genSets.forEach(genSet => this.addLabel(genSet));
  // }
}
