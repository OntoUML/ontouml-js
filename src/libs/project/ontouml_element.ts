import { OntoumlType } from '@constants/.';
import uniqid from 'uniqid';
import Class from './class';
import { getText, MultilingualText } from './multilingual_text';
import Package from './package';
import Project from './project';
import Property from './property';
import Relation from './relation';

const ontoumlElementTemplate = {
  type: null,
  id: null,
  name: null,
  description: null
};

export default abstract class OntoumlElement {
  type: OntoumlType;
  id: string;
  name: MultilingualText;
  description: MultilingualText;

  constructor(base?: Partial<OntoumlElement>) {
    this.id = uniqid();

    // if base has an id, the generated own is overwritten
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
    const ontoumlElementSerialization = {};

    Object.assign(ontoumlElementSerialization, ontoumlElementTemplate, this);

    return ontoumlElementSerialization;
  }

  // TODO: add Diagram when supported
  isContainer(): boolean {
    return (
      this instanceof Project ||
      this instanceof Package ||
      this instanceof Class ||
      this instanceof Relation ||
      this instanceof Property
    );
  }
}
