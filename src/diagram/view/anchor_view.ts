import { OntoumlType, View, Path, Anchor, NoteView, Shape } from '../..';

export class AnchorView extends View<Anchor> {
  noteView: NoteView;
  elementView: View<any>;
  path: Path;

  constructor(element: Anchor, noteView: NoteView, elementView: View<any>) {
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
      type: OntoumlType.ANCHOR_VIEW,
      ...super.toJSON(),
      sourceView: this.noteView.id,
      targetView: this.elementView.id,
      path: this.path.id
    };
  }
}
