import {
  ModelElementBuilder,
  MultilingualText,
  Note,
  Package,
  Project
} from '../..';

export class NoteBuilder extends ModelElementBuilder<NoteBuilder> {
  protected declare element?: Note;
  protected declare _container?: Package;
  private _text: MultilingualText = new MultilingualText();

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

  override container(pkg?: Package): NoteBuilder {
    this._container = pkg;
    return this;
  }

  text(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): NoteBuilder {
    this._text.add(value, language);
    return this;
  }
}
