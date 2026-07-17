import { OntoumlType, View, Path, Anchor, NoteView, Shape } from '../..';

/**
 * The view of an {@link Anchor} in a {@link Diagram}, rendered as a
 * {@link Path} connecting a {@link NoteView} to the view of the element the
 * note is attached to.
 */
export class AnchorView extends View<Anchor> {
  /** The view of the note at the source end of the anchor. */
  noteView: NoteView;

  /** The view of the element to which the note is attached. */
  elementView: View<any>;

  /** The polyline that renders the anchor on the diagram canvas. */
  path: Path;

  constructor(element: Anchor, noteView: NoteView, elementView: View<any>) {
    super(element);

    this.path = new Path();
    this.noteView = noteView;
    this.elementView = elementView;
  }

  /** The shapes that render this view: its {@link path}. */
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
