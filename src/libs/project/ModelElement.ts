import randomId from 'random-id';

import { OntoUMLType } from '@constants/.';
import { Project } from './Project';

export class ModelElement {
  type: OntoUMLType;
  id: string;
  name?: string | object; // TODO: add support to multilingual textual fields
  description?: string | object;
  propertyAssignments?: object;

  project?: Project; // TODO: look for circular dependency issues
  container?: ModelElement; // TODO: should we detail the parent's type as Package or Class, for instance?

  constructor(project?: Project) {
    this.id = randomId();
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
