import { View, Path, OntoumlElement } from "..";
import { NoteLink } from "../model/note_link";
import { NoteView } from "./note_view";

export abstract class NoteLinkView extends View<NoteLink> {
  noteView: NoteView;
  elementView: View<any>;
  path: Path;

  constructor(element: NoteLink, noteView: NoteView, elementView: View<any>) {
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
      path: this.path.id,
    };

    return { ...object, ...super.toJSON() };
  }
}
