import uniqid from 'uniqid';
import Project from './project';
import { OntoumlType } from '@constants/.';
import { MultilingualString } from './multilingual_text';

const modelElementTemplate = {
  type: null,
  id: null,
  name: null,
  description: null,
  propertyAssignments: null
};

export default abstract class ModelElement {
  type: OntoumlType;
  id: string;
  name: MultilingualString;
  description: MultilingualString;
  propertyAssignments: object;
  project: Project;
  container: ModelElement | Project;

  constructor(base?: Partial<ModelElement>) {
    this.id = uniqid();

    // if base has an id, the generated own is overwritten
    if (base) {
      Object.assign(this, base);
    }
  }

  lock(): void {
    throw new Error('Method unimplemented!');
  }

  unlock(): void {
    throw new Error('Method unimplemented!');
  }

  isLocked(): boolean {
    throw new Error('Method unimplemented!');
  }

  toJSON(): any {
    const modelElementSerialization = {};

    Object.assign(modelElementSerialization, modelElementTemplate, this);
    // Object.entries(modelElementSerialization).forEach(([key, value]) => {
    //   if (value instanceof Set) {
    //     modelElementSerialization[key] = [...value];
    //   }
    // });

    delete modelElementSerialization['project'];
    delete modelElementSerialization['container'];

    return modelElementSerialization;
  }

  getReference(): { type: OntoumlType; id: string } {
    return {
      type: this.type,
      id: this.id
    };
  }
}
