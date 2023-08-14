import { ModelElement, OntoumlElement } from '..';

export abstract class View<T extends ModelElement> extends OntoumlElement {
  readonly element: T;

  constructor(element: T) {
    super();

    if(!element){
      throw new Error("Illegal parameter. Cannot create a view without a defined element.")
    }

    this.element = element;
  }

  override clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }
  
  override replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }

  override resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    throw new Error('Method not implemented.');
  }

  override toJSON(): any {
    const object = {
      element: this.element.id,
    };
    
    return { ...object, ...super.toJSON() };
  }

}
