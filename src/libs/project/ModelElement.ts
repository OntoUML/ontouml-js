import uniqid from 'uniqid';
import Project from './Project';
import { OntoumlType } from '@constants/.';

export default class ModelElement {
  type: OntoumlType;
  id: string;
  name?: string | object; // TODO: add support to multilingual textual fields
  description?: string | object;
  propertyAssignments?: object;

  project?: Project; // TODO: look for circular dependency issues
  container?: ModelElement; // TODO: should we detail the parent's type as Package or Class, for instance?

  constructor(project?: Project) {
    this.id = uniqid();
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
