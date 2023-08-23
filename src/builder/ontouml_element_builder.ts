import uniqid from 'uniqid';
import { OntoumlElement } from "../ontouml_element";
import { Project } from "../project";

export abstract class OntoumlElementBuilder<B extends OntoumlElementBuilder<B>> {
  protected element?: OntoumlElement;
  protected project: Project;
  protected _id: string;

  constructor(project: Project) {
    this._id = uniqid();
    this.project = project;
  }

  abstract build(): OntoumlElement;

  // TODO: confirm whether this is adequate
  id(id: string): B {
    this._id = id;
    return this as unknown as B;
  }

  assertElement(): void {
    if(!this.element){
      throw new Error('The element is undefined or null.');
    }

  }
}

