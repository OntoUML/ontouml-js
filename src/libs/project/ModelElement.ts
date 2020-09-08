import { OntoUMLType } from '@constants/.';
import { Project } from './Project';

export class ModelElement {
  type: OntoUMLType;
  id: string;
  name: null | string | object; // TODO: add support to multilingual textual fields
  description: null | string | object;
  propertyAssignments: null | object;

  project: Project = null; // TODO: look for circular dependency issues
  container: ModelElement = null; // TODO: should we detail the parent's type as Package or Class, for instance?

  constructor() {
    throw new Error('Class unimplemented');
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

  toJSON(): object {
    throw new Error('Method unimplemented!');
  }

  getName(language?: string): string {
    throw new Error('Method unimplemented!');
  }

  getDescription(language?: string): string {
    throw new Error('Method unimplemented!');
  }
}
