import {
  Anchor,
  ModelElement,
  ModelElementBuilder,
  Note,
  Package,
  Project
} from '../..';

/**
 * A fluent builder for {@link Anchor} instances.
 *
 * This builder configures the {@link Note} and the annotated
 * {@link ModelElement} connected by the anchor, as well as the
 * {@link Package} that contains it. Both the note and the annotated element
 * must be set before the anchor is built.
 *
 * @example
 * ```typescript
 * const anchor = project
 *   .anchorBuilder()
 *   .note(note)
 *   .annotates(person)
 *   .build();
 * ```
 */
export class AnchorBuilder extends ModelElementBuilder<AnchorBuilder> {
  protected declare element?: Anchor;
  protected declare _container?: Package;
  private _note?: Note;
  private _annotatedElement?: ModelElement;

  /**
   * Creates a builder whose built anchor will be contained in `project`.
   */
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
    this.assertNotBuilt();
    this.assertNoteSet();
    this.assertElementSet();
    this.assertSameProject(this._container, this._note, this._annotatedElement);

    this.element = new Anchor(
      this.project,
      this._note!,
      this._annotatedElement!
    );

    this._container?.addContent(this.element);

    super.build();
    return this.element;
  }

  /**
   * Sets the {@link Package} that will contain the built anchor.
   *
   * @returns this builder, for method chaining.
   */
  override container(pkg?: Package): AnchorBuilder {
    this._container = pkg;
    return this;
  }

  /**
   * Sets the {@link Note} connected by the anchor.
   *
   * @returns this builder, for method chaining.
   */
  note(note: Note): AnchorBuilder {
    this._note = note;
    return this;
  }

  /**
   * Sets the {@link ModelElement} annotated by the note connected by the
   * anchor.
   *
   * @returns this builder, for method chaining.
   */
  annotates(element: ModelElement): AnchorBuilder {
    this._annotatedElement = element;
    return this;
  }

  /**
   * Asserts that the note of the anchor has been set, throwing an error
   * otherwise.
   */
  assertNoteSet(): void {
    if (!this._note) throw new Error('Missing note.');
  }

  /**
   * Asserts that the annotated element of the anchor has been set, throwing
   * an error otherwise.
   */
  assertElementSet(): void {
    if (!this._annotatedElement) throw new Error('Missing annotated element.');
  }
}
