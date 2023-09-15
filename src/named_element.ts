import _ from 'lodash';
import { MultilingualText, Project, OntoumlElement, utils } from '.';
import { Resource } from './resource';

export abstract class NamedElement extends OntoumlElement {
  name: MultilingualText;
  description: MultilingualText;
  private alternativeNames: Set<MultilingualText> = new Set();
  private editorialNotes: Set<MultilingualText> = new Set();
  private creators: Set<Resource> = new Set();
  private contributors: Set<Resource> = new Set();

  constructor(project?: Project) {
    super(project);

    this.name = new MultilingualText();
    this.description = new MultilingualText();
  }

  getAlternativeNames(): MultilingualText[] {
    return [...this.alternativeNames];
  }

  addAlternativeName(value: MultilingualText): void {
    this.alternativeNames.add(value);
  }

  removeAlternativeName(value: MultilingualText): boolean {
    return this.alternativeNames.delete(value);
  }

  getEditorialNotes(): MultilingualText[] {
    return [...this.editorialNotes];
  }

  addEditorialNote(value: MultilingualText): void {
    this.editorialNotes.add(value);
  }

  removeEditorialNote(value: MultilingualText): boolean {
    return this.editorialNotes.delete(value);
  }

  getCreators(): Resource[] {
    return [...this.creators];
  }

  addCreator(value: Resource): void {
    this.creators.add(value);
  }

  removeCreator(value: Resource): boolean {
    return this.creators.delete(value);
  }

  getContributors(): Resource[] {
    return [...this.contributors];
  }

  addContributor(value: Resource): void {
    this.contributors.add(value);
  }

  removeContributor(value: Resource): boolean {
    return this.contributors.delete(value);
  }

  getNameOrId(language?: string): string {
    return this.name.get(language) || this.id;
  }

  override toJSON(): any {
    const object = {
      name: this.name.toJSON(),
      description: this.description.toJSON(),
      alternativeNames: [...this.alternativeNames],
      editorialNotes: [...this.editorialNotes],
      creators: [...this.creators],
      contributors: [...this.contributors]
    };

    return { ...super.toJSON(), ...object };
  }
}
