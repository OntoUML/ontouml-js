import _ from 'lodash';
import { MultilingualText, Project, OntoumlElement } from '.';

export abstract class NamedElement extends OntoumlElement {
  private name: MultilingualText;
  private description: MultilingualText;

  constructor(project?: Project) {
    super(project);

    this.name = new MultilingualText();
    this.description = new MultilingualText();
  }

  getName(language?: string): string {
    return this.name.getText(language);
  }

  addName(value: string, language?: string): void {
    if (!this.name) this.name = new MultilingualText();
    this.name.addText(value, language);
  }

  setName(value: string | MultilingualText, language?: string): void {
    if(value instanceof MultilingualText) {
      this.name = value;
    } else {
      this.name = new MultilingualText(value, language);
    }
  }

  getDescription(language?: string): string {
    return this.description.getText(language);
  }

  addDescription(value: string, language?: string): void {
    if (!this.description) this.description = new MultilingualText();
    this.description.addText(value, language);
  }

  setDescription(description:MultilingualText): void;
  setDescription(value: string, language?: string): void;
  setDescription(value: string|MultilingualText, language?: string): void {
    if(value instanceof MultilingualText) {
      this.description = value;
    }
    else {
      this.description = new MultilingualText(value, language);
    }
  }

  getNameOrId(language?: string): string {
    return this.getName(language) || this.id;
  }

  override toJSON(): any {
    const object = {
      name: this.name.toJSON(),
      description: this.description.toJSON(),
      alternativeNames: [],
      editorialNotes: [],
      creators: [],
      contributors: [],
    };

    return { ...object, ...super.toJSON()};
  }

}
