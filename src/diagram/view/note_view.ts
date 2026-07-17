import { OntoumlType, View, Note, Text, OntoumlElement, Shape } from '../..';

export class NoteView extends View<Note> {
  readonly text: Text;

  constructor(note: Note) {
    super(note);

    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  override get shapes(): Shape[] {
    return [this.text];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.NOTE_VIEW,
      ...super.toJSON(),
      text: this.text.id
    };
  }
}
