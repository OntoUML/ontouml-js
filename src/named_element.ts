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

  setName(value: string, language?: string): void {
    this.name = new MultilingualText(value, language);
  }

  getDescription(language?: string): string {
    return this.description.getText(language);
  }

  addDescription(value: string, language?: string): void {
    if (!this.description) this.description = new MultilingualText();
    this.description.addText(value, language);
  }

  setDescription(value: string, language?: string): void {
    this.description = new MultilingualText(value, language);
  }

  getNameOrId(language?: string): string {
    return this.getName(language) || this.id;
  }

  override toJSON(): any {
    const object = {
      name: this.name.toJSON(),
      description: this.description.toJSON()
    };

    return { ...object, ...super.toJSON()};
  }

}
