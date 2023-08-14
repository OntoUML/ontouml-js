import {
  OntoumlType,
  ModelElement,
  Project,
  OntoumlElement,
  Package,
} from '..';
import { Note } from './note';
import { PackageableElement } from './packageable_element';

export class NoteLink extends ModelElement implements PackageableElement {
  note: Note;
  element: ModelElement;
  
  constructor(project: Project, container: Package | undefined, note: Note, element: ModelElement) {
    super(project, container);
    this.note = note;
    this.element = element;
  }

  public override get container(): Package | undefined {
    return this.container as Package
  }

  public override set container(newContainer: Package | undefined) {
    super.container = newContainer;
  }
  
  override toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE_LINK,
      note: this.note.id,
      element: this.element.id
    };

    return {...object, ...super.toJSON()};
  }
  
  getContents(): OntoumlElement[] {
    return [];
  }
  
  clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }
  
  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }

}
