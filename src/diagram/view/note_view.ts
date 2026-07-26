import { OntoumlType, View, Note, Text, Shape } from '../..';

/**
 * The view of a {@link Note} in a {@link Diagram}, rendered as a
 * {@link Text} box (100 × 50 by default).
 */
export class NoteView extends View<Note> {
  /** The text box that renders the note on the diagram canvas. */
  readonly text: Text;

  constructor(note: Note) {
    super(note);

    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  /** The shapes that render this view: its {@link text} box. */
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
