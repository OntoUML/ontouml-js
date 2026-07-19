import {
  OntoumlType,
  ModelElement,
  MultilingualText,
  Project,
  Package,
  AnchorBuilder
} from '..';

/**
 * A free-text annotation that documents some aspect of a model, analogous to
 * a UML comment. A note can be attached to the {@link ModelElement} it
 * comments on by means of an {@link Anchor}.
 */
export class Note extends ModelElement {
  /** The textual content of the note, possibly in multiple languages. */
  text: MultilingualText;

  constructor(project: Project) {
    super(project);
    this.text = new MultilingualText();
  }

  /** The package that contains this note, if any. */
  public override get container(): Package | undefined {
    return this._container as Package;
  }

  /**
   * Creates a builder for an {@link Anchor} that attaches this note to a
   * model element.
   */
  anchorBuilder(): AnchorBuilder {
    return new AnchorBuilder(this.project!).note(this);
  }

  /**
   * Deletes the anchors that attach this note to model elements, in
   * addition to the dependents deleted for every model element.
   */
  protected override deleteDependents(): void {
    this.project.anchors.filter(a => a.note === this).forEach(a => a.delete());

    super.deleteDependents();
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE,
      text: this.text.toJSON()
    };

    return { ...super.toJSON(), ...object };
  }
}
