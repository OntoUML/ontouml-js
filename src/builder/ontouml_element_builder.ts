import uniqid from 'uniqid';
import { OntoumlElement, Project } from '..';

export abstract class OntoumlElementBuilder<
  B extends OntoumlElementBuilder<B>
> {
  protected element?: OntoumlElement;
  protected project: Project;
  private _id: string = uniqid();

  constructor(project: Project) {
    this.project = project;
  }

  build(): OntoumlElement {
    this.assertElement();

    this.element!.id = this._id;
    this.project.add(this.element!);
    return this.element!;
  }

  // TODO: confirm whether this is adequate
  id(id: string): B {
    this._id = id;
    return this as unknown as B;
  }

  assertElement(): void {
    if (!this.element) {
      throw new Error('The element is undefined or null.');
    }
  }
}
