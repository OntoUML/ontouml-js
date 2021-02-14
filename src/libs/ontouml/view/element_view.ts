import { ModelElement } from '../model/model_element';
import { OntoumlElement } from '../ontouml_element';
import { DiagramElement } from './diagram_element';
import { Shape } from './shape';

export abstract class ElementView<T extends ModelElement, S extends Shape> extends DiagramElement {
  modelElement: T;
  shape: S;

  constructor(type: string, base?: Partial<ElementView<T, S>>) {
    super(type, base);

    if (!this.shape) this.shape = this.createShape();
  }

  getContents(): OntoumlElement[] {
    let contents = [];
    if (this.modelElement) {
      contents = [this.modelElement];
    }
    if (this.shape) contents.push(this.shape);

    return contents;
  }

  getModelElement(): T {
    return this.modelElement;
  }

  setModelElement(modelElement: T): void {
    this.modelElement = modelElement;
  }

  getShape(): S {
    return this.shape;
  }

  setShape(shape: S): void {
    if (shape != null) this.shape = shape;
  }

  abstract createShape(): S;
}
