import {
  OntoumlType,
  ModelElement,
  MultilingualText,
  Project,
  Package,
  AnchorBuilder
} from '..';

export class Note extends ModelElement {
  text: MultilingualText;

  constructor(project: Project) {
    super(project);
    this.text = new MultilingualText();
  }

  public override get container(): Package | undefined {
    return this._container as Package;
  }

  /** @returns a builder for an {@link Anchor} that connects this note to a
   * model element. */
  anchorBuilder(): AnchorBuilder {
    return new AnchorBuilder(this.project!).note(this);
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE,
      text: this.text.toJSON()
    };

    return { ...super.toJSON(), ...object };
  }
}
