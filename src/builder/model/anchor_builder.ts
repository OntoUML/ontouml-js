import {
  Anchor,
  ModelElement,
  ModelElementBuilder,
  Note,
  Package,
  Project
} from '../..';

export class AnchorBuilder extends ModelElementBuilder<AnchorBuilder> {
  protected declare element?: Anchor;
  protected declare _container?: Package;
  private _note?: Note;
  private _annotatedElement?: ModelElement;

  constructor(project: Project) {
    super(project);
  }

  /**
   * Builds an instance of {@link Anchor} with the parameters passed to the
   * builder. Both the note and the annotated element are required before
   * `build()` is evoked. When no other methods are evoked, the created anchor
   * has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date()`
   */
  override build(): Anchor {
    this.assertNoteSet();
    this.assertElementSet();

    this.element = new Anchor(
      this.project,
      this._note!,
      this._annotatedElement!
    );

    this._container?.addContent(this.element);

    super.build();
    return this.element;
  }

  override container(pkg?: Package): AnchorBuilder {
    this._container = pkg;
    return this;
  }

  note(note: Note): AnchorBuilder {
    this._note = note;
    return this;
  }

  annotates(element: ModelElement): AnchorBuilder {
    this._annotatedElement = element;
    return this;
  }

  assertNoteSet(): void {
    if (!this._note) throw new Error('Missing note.');
  }

  assertElementSet(): void {
    if (!this._annotatedElement) throw new Error('Missing annotated element.');
  }
}
