import { OntoumlType, ModelElement, Project, Package, Note } from '..';

/**
 * A link that attaches a {@link Note} to the {@link ModelElement} it
 * comments on, analogous to the connector between a UML comment and the
 * element it annotates. For example, an anchor may attach a note explaining
 * modeling decisions to the class `Person`.
 */
export class Anchor extends ModelElement {
  /** The note attached by this anchor. */
  note: Note;

  /** The model element annotated by {@link note}. */
  element: ModelElement;

  constructor(project: Project, note: Note, element: ModelElement) {
    super(project);
    this.note = note;
    this.element = element;
  }

  /** The package that contains this anchor, if any. */
  public override get container(): Package | undefined {
    return this._container as Package;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.ANCHOR,
      note: this.note.id,
      element: this.element.id
    };

    return { ...super.toJSON(), ...object };
  }
}
