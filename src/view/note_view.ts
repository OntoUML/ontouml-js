import { OntoumlType } from '..';
import { View } from './view';
import { Note } from '../model/note';
import { Text } from '../shape/text';

export class NoteView extends View<Note> {
  readonly text: Text;

  constructor(note: Note) {
    super(note);

    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.NOTE_VIEW,
      text: this.text.id
    };
    
    return { ...object, ...super.toJSON() };
  }
}
