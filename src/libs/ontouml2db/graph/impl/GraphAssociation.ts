/**
 * Class responsible for storing the basic functionality of any connection between two classes.
 *
 * Author: Gustavo L. Guidoni
 */

import { AssociationType } from '../util/enumerations';
import { IGraphAssociation } from '../IGraphAssociation';
import { INode } from '../INode';

export class GraphAssociation implements IGraphAssociation {
  private id: string;
  private name: string;
  private associationType: AssociationType;
  private resolved: boolean;

  constructor(id: string, name: string, associationType: AssociationType) {
    this.id = id;
    this.name = name;
    this.associationType = associationType;
    this.resolved = false;
  }

  getAssociationID(): string {
    return this.id;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  isAssociationType(associationType: AssociationType): boolean {
    return this.associationType === associationType;
  }

  setResolved(flag: boolean): void {
    this.resolved = flag;
  }

  isResolved(): boolean {
    return this.resolved;
  }

  cloneChangingReferencesTo(nodes: INode[]): IGraphAssociation {
    throw new Error('This method must be called by the inheriting classes.');
  }

  deleteAssociation(): void {
    throw new Error('This method must be called by the inheriting classes.');
  }
}
