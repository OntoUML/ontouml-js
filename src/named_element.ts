import { MultilingualText, OntoumlElement, Resource, utils } from '.';

export abstract class NamedElement extends OntoumlElement {
  name: MultilingualText;
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

  get alternativeNames(): MultilingualText[] {
    return [...this._alternativeNames];
  }

  set alternativeNames(array: MultilingualText[]) {
    utils.assertArray(array);
    this._alternativeNames = new Set(array);
  }

  addAlternativeName(value: MultilingualText): void {
    utils.assertValue(value);
    this._alternativeNames.add(value);
  }

  removeAlternativeName(value: MultilingualText): boolean {
    return this._alternativeNames.delete(value);
  }

  get editorialNotes(): MultilingualText[] {
    return [...this._editorialNotes];
  }

  set editorialNotes(array: MultilingualText[]) {
    utils.assertArray(array);
    this._editorialNotes = new Set(array);
  }

  addEditorialNote(value: MultilingualText): void {
    utils.assertValue(value);
    this._editorialNotes.add(value);
  }

  removeEditorialNote(value: MultilingualText): boolean {
    return this._editorialNotes.delete(value);
  }

  get creators(): Resource[] {
    return [...this._creators];
  }

  set creators(array: Resource[]) {
    utils.assertArray(array);
    this._creators = new Set(array);
  }

  addCreator(value: Resource): void {
    utils.assertValue(value);
    this._creators.add(value);
  }

  removeCreator(value: Resource): boolean {
    return this._creators.delete(value);
  }

  get contributors(): Resource[] {
    return [...this._contributors];
  }

  set contributors(array: Resource[]) {
    utils.assertArray(array);
    this._contributors = new Set(array);
  }

  addContributor(value: Resource): void {
    utils.assertValue(value);
    this._contributors.add(value);
  }

  removeContributor(value: Resource): boolean {
    return this._contributors.delete(value);
  }

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
