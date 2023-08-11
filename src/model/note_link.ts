import {
  OntoumlType,
  ModelElement,
  Project,
  OntoumlElement,
} from '..';
import { Note } from './note';

export class NoteLink extends ModelElement {
  note: Note;
  element: ModelElement;
  
  constructor(project: Project, note: Note, element: ModelElement) {
    super(OntoumlType.NOTE_LINK, project);
    this.note = note;
    this.element = element;
  }
  
  toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE_LINK,
      note: null,
      element: null
    };

    Object.assign(object, super.toJSON());

    return object;
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
