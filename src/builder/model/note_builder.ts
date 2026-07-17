import {
  ModelElementBuilder,
  MultilingualText,
  Note,
  Package,
  Project
} from '../..';

/**
 * A fluent builder for {@link Note} instances.
 *
 * This builder configures the multilingual text of the note and the
 * {@link Package} that contains it. Notes can be connected to the elements
 * they annotate through {@link Anchor} instances.
 *
 * @example
 * ```typescript
 * const note = project
 *   .noteBuilder()
 *   .text('This class requires further discussion.')
 *   .build();
 * ```
 */
export class NoteBuilder extends ModelElementBuilder<NoteBuilder> {
  protected declare element?: Note;
  protected declare _container?: Package;
  private _text: MultilingualText = new MultilingualText();

  /**
   * Creates a builder whose built note will be contained in `project`.
   */
  constructor(project: Project) {
    super(project);
  }

  /**
   * Builds an instance of {@link Note} with the parameters passed to the
   * builder. When no methods are evoked, the created note has the following
   * defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `text: empty`
   */
  override build(): Note {
    this.element = new Note(this.project);
    this.element.text = this._text;

    this._container?.addContent(this.element);

    super.build();
    return this.element;
  }

  /**
   * Sets the {@link Package} that will contain the built note.
   *
   * @returns this builder, for method chaining.
   */
  override container(pkg?: Package): NoteBuilder {
    this._container = pkg;
    return this;
  }

  /**
   * Adds the text of the note in the given language.
   *
   * @param value - the note text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  text(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): NoteBuilder {
    this._text.add(value, language);
    return this;
  }
}
