import { MultilingualText, OntoumlElement, Resource, utils } from '.';

/**
 * An {@link OntoumlElement} that can be named and annotated with
 * documentation metadata. Names, descriptions, alternative names, and
 * editorial notes are {@link MultilingualText} instances, so each can hold
 * values in multiple languages. Creators and contributors are
 * {@link Resource} references to the agents (e.g., persons, organizations)
 * involved in authoring the element.
 *
 * These metadata fields follow the OntoUML/UFO Catalog Metadata Vocabulary.
 */
export abstract class NamedElement extends OntoumlElement {
  /** The name of this element, possibly in multiple languages. */
  name: MultilingualText;

  /** A free-text account of this element, possibly in multiple languages. */
  description: MultilingualText;

  private _alternativeNames: Set<MultilingualText> = new Set();
  private _editorialNotes: Set<MultilingualText> = new Set();
  private _creators: Set<Resource> = new Set();
  private _contributors: Set<Resource> = new Set();

  constructor() {
    super();

    this.name = new MultilingualText();
    this.description = new MultilingualText();
  }

  /** The alternative names of this element, such as synonyms or aliases. */
  get alternativeNames(): MultilingualText[] {
    return [...this._alternativeNames];
  }

  /**
   * Sets the alternative names of this element, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set alternativeNames(array: MultilingualText[]) {
    utils.assertArray(array);
    this._alternativeNames = new Set(array);
  }

  /**
   * Adds an alternative name to this element, such as a synonym or an alias.
   *
   * @throws an error if the value is null or undefined.
   */
  addAlternativeName(value: MultilingualText): void {
    utils.assertValue(value);
    this._alternativeNames.add(value);
  }

  /**
   * Removes an alternative name from this element.
   *
   * @returns `true` if the value was present and removed.
   */
  removeAlternativeName(value: MultilingualText): boolean {
    return this._alternativeNames.delete(value);
  }

  /** The editorial notes documenting the modeling of this element. */
  get editorialNotes(): MultilingualText[] {
    return [...this._editorialNotes];
  }

  /**
   * Sets the editorial notes of this element, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set editorialNotes(array: MultilingualText[]) {
    utils.assertArray(array);
    this._editorialNotes = new Set(array);
  }

  /**
   * Adds an editorial note to this element, i.e., general information
   * intended for its editors rather than its final users.
   *
   * @throws an error if the value is null or undefined.
   */
  addEditorialNote(value: MultilingualText): void {
    utils.assertValue(value);
    this._editorialNotes.add(value);
  }

  /**
   * Removes an editorial note from this element.
   *
   * @returns `true` if the value was present and removed.
   */
  removeEditorialNote(value: MultilingualText): boolean {
    return this._editorialNotes.delete(value);
  }

  /** The agents responsible for creating this element. */
  get creators(): Resource[] {
    return [...this._creators];
  }

  /**
   * Sets the creators of this element, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set creators(array: Resource[]) {
    utils.assertArray(array);
    this._creators = new Set(array);
  }

  /**
   * Adds an agent responsible for creating this element, such as a person or
   * an organization.
   *
   * @throws an error if the value is null or undefined.
   */
  addCreator(value: Resource): void {
    utils.assertValue(value);
    this._creators.add(value);
  }

  /**
   * Removes a creator from this element.
   *
   * @returns `true` if the value was present and removed.
   */
  removeCreator(value: Resource): boolean {
    return this._creators.delete(value);
  }

  /** The agents that contributed to this element. */
  get contributors(): Resource[] {
    return [...this._contributors];
  }

  /**
   * Sets the contributors of this element, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set contributors(array: Resource[]) {
    utils.assertArray(array);
    this._contributors = new Set(array);
  }

  /**
   * Adds an agent that contributed to this element, such as a person or an
   * organization.
   *
   * @throws an error if the value is null or undefined.
   */
  addContributor(value: Resource): void {
    utils.assertValue(value);
    this._contributors.add(value);
  }

  /**
   * Removes a contributor from this element.
   *
   * @returns `true` if the value was present and removed.
   */
  removeContributor(value: Resource): boolean {
    return this._contributors.delete(value);
  }

  /**
   * Returns the name of this element in the given language, falling back to
   * its {@link id} when no suitable name is available.
   *
   * @param language - language tag of the desired name (e.g., `"en"`); when
   *        omitted, the name is selected according to
   *        {@link MultilingualText.languagePreference}.
   */
  getNameOrId(language?: string): string {
    return this.name.get(language) || this.id;
  }

  override toJSON(): any {
    const object = {
      name: this.name.toJSON(),
      description: this.description.toJSON(),
      alternativeNames: this.alternativeNames.map(text => text.toJSON()),
      editorialNotes: this.editorialNotes.map(text => text.toJSON()),
      creators: this.creators.map(resource => resource.toJSON()),
      contributors: this.contributors.map(resource => resource.toJSON())
    };

    return { ...super.toJSON(), ...object };
  }
}
