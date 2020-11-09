import uniqid from 'uniqid';
import { Class, getText, MultilingualText, Package, Project, Relation } from './';

export enum OntoumlType {
  PROJECT_TYPE = 'Project',
  PACKAGE_TYPE = 'Package',
  CLASS_TYPE = 'Class',
  RELATION_TYPE = 'Relation',
  GENERALIZATION_TYPE = 'Generalization',
  GENERALIZATION_SET_TYPE = 'GeneralizationSet',
  PROPERTY_TYPE = 'Property',
  LITERAL_TYPE = 'Literal'
}

export abstract class OntoumlElement {
  type: OntoumlType;
  id: string;
  name: MultilingualText;
  description: MultilingualText;

  constructor(base?: Partial<OntoumlElement>) {
    this.id = uniqid();

    // if base has an id, the generated one is overwritten
    if (base) {
      Object.assign(this, base);
    }
  }

  getName(orderedLanguagePreferences: string[] = ['en']): string {
    return getText(this.name, orderedLanguagePreferences);
  }

  getDescription(orderedLanguagePreferences: string[] = ['en']): string {
    return getText(this.description, orderedLanguagePreferences);
  }

  getReference(): { type: OntoumlType; id: string } {
    return {
      type: this.type,
      id: this.id
    };
  }

  toJSON(): any {
    const ontoumlElementSerialization = {
      type: null,
      id: null,
      name: null,
      description: null
    };

    Object.assign(ontoumlElementSerialization, this);

    return ontoumlElementSerialization;
  }

  // TODO: add Diagram when supported
  isContainer(): boolean {
    return this instanceof Project || this instanceof Package || this instanceof Class || this instanceof Relation;
  }
}
