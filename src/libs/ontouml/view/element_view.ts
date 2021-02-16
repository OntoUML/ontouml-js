import { ModelElement } from '..';
import { OntoumlElement, DiagramElement, Shape } from '..';

export abstract class ElementView<T extends ModelElement, S extends Shape> extends DiagramElement {
  modelElement: T;
  shape: S;

  constructor(type: string, base?: Partial<ElementView<T, S>>) {
    super(type, base);

    this.modelElement = base?.modelElement || null;
    this.shape = base?.shape || this.createShape();

    this.shape.setContainer(this);
  }

  getContents(): OntoumlElement[] {
    return [this.shape];
  }

  abstract createShape(): S;
}
