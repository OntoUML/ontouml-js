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

  constructor(id: string, name: string, associationType: AssociationType) {
    this.id = id;
    this.name = name;
    this.associationType = associationType;
    this.resolved = false;
    this.nodeNameRemoved = null;
  }

  /**
   * Returns the association ID (Relation, Generalization, Generalization Set,
   * or any other association). The ID is the same as found in the source model.
   */
  getAssociationID(): string {
    return this.id;
  }

  /**
   * Indicates the association name.
   *
   * @param name. Association name.
   */
  setName(name: string): void {
    this.name = name;
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
   * Checks if the current association is the same type as the association
   * passed as a parameter.
   *
   * @param associationType. association to be tested.
   * @return boolean. Returns true if are the same, otherwise false.
   */
  isAssociationType(associationType: AssociationType): boolean {
    return this.associationType === associationType;
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
   * Clone the association changing the associated nodes to the nodes in
   * the array. This method generally used to clone the node.
   *
   * @param nodes. New nodes to be linked.
   * @return IGraphAssociation
   */
  cloneChangingReferencesTo(nodes: Node[]): GraphAssociation {
    throw new Error('This method must be called by the inheriting classes.');
  }

  /**
   * Delete the association from the nodes.
   *
   * @param node Node to be checked for its existence in the association.
   */
  deleteAssociation(): void {
    throw new Error('This method must be called by the inheriting classes.');
  }
}
