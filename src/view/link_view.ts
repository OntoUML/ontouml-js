import { View, Path, OntoumlElement, Link, NoteView } from '..';

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

  override getContents(): OntoumlElement[] {
    return [this.path];
  }

  override toJSON(): any {
    const object: any = {
      source: this.noteView.id,
      target: this.elementView.id,
      path: this.path.id
    };

    return { ...object, ...super.toJSON() };
  }
}
