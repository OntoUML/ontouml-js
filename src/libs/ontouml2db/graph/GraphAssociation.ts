/**
 * Class responsible for storing the basic functionality of any connection between two classes.
 *
 * Author: Gustavo L. Guidoni
 */

import { AssociationType } from '@libs/ontouml2db/constants/enumerations';
import { Node } from '@libs/ontouml2db/graph/Node';

export class GraphAssociation {
  private id: string;
  private name: string;
  private associationType: AssociationType;
  private resolved: boolean;
  private nodeNameRemoved: string; //this is important when there is a name collision in the FK name propagation process.
  private derivedFromGeneralization: boolean;

  constructor(id: string, name: string, associationType: AssociationType) {
    this.id = id;
    this.name = name;
    this.associationType = associationType;
    this.resolved = false;
    this.nodeNameRemoved = null;
    this.derivedFromGeneralization = false;
  }

  /**
   * Returns the association ID (Relation, Generalization, Generalization Set,
   * or any other association). The ID is the same as found in the source model.
   */
  getAssociationID(): string {
    return this.id;
  }

  /**
   * Returns the association name.
   *
   * @return A string with the association name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Marks the association as visited or not.
   *
   * @param flag. True indicates that the association was visited and false
   * as not visited.
   */
  setResolved(flag: boolean): void {
    this.resolved = flag;
  }

  /**
   * Indicates whether the association has already been visited.
   *
   * @return True if the association was visited, otherwise false.
   */
  isResolved(): boolean {
    return this.resolved;
  }

  /**
   * Informs the name of the Node that was removed.
   * @param nodeName
   */
  setNodeNameRemoved(nodeName: string) {
    this.nodeNameRemoved = nodeName;
  }

  /**
   * Return the name of the Node removed.
   */
  getNodeNameRemoved(): string {
    return this.nodeNameRemoved;
  }

  /**
   * Informs if the association was created from a generalization.
   * @param falg 
   */
  setDerivedFromGeneralization(falg: boolean):void{
    this.derivedFromGeneralization = falg;
  }

  /**
   * Returns if the association was created from a generalization.
   * @returns 
   */
  isDerivedFromGeneralization():boolean{
    return this.derivedFromGeneralization;
  }
}
