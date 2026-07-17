import { View, Path, Link, NoteView, OntoumlElement, Shape } from '../..';

export abstract class LinkView extends View<Link> {
  noteView: NoteView;
  elementView: View<any>;
  path: Path;

  constructor(element: Link, noteView: NoteView, elementView: View<any>) {
    super(element);

    this.path = new Path();
    this.noteView = noteView;
    this.elementView = elementView;
  }

  override get shapes(): Shape[] {
    return [this.path];
  }

  override toJSON(): any {
    return {
      ...super.toJSON(),
      source: this.noteView.id,
      target: this.elementView.id,
      path: this.path.id
    };
  }
}
