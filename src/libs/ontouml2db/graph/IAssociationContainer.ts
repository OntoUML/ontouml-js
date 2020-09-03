/**
 * An AssociationConteiner is intended to group all the properties of a node.
 * A node is composed of a relationships set with other nodes. This interface contains the
 * necessary methods for handling node's associations.
 *
 * Author: Gustavo L. Guidoni
 */

import { IGraphAssociation } from './IGraphAssociation';
import { IGraphRelation } from './IGraphRelation';
import { IGraphGeneralization } from './IGraphGeneralization';
import { IGraphGeneralizationSet } from './IGraphGeneralizationSet';

export interface IAssociationContainer {
  /**
   * Adds a new association to the node. Each node has a list of its associations. In
   * this way, a association is referenced by the origin and destination node, forming
   * a bidirectional graph.
   *
   * @param relation Relatin to be added.
   */
  addRelation(relation: IGraphRelation): void;

  /**
   * Returns the associations with the node.
   *
   * @return An list with all the associations that arrive and depart from the
   * respective node.
   */
  getRelations(): IGraphRelation[];

  /**
   * Adds a new generalization to the node's association set.
   *
   * @param generalization Generalizatin to be added
   */
  addGeneralization(generalization: IGraphGeneralization);

  /**
   * Returns generalizations belonging to the node.
   */
  getGeneralizations(): IGraphGeneralization[];

  /**
   * Returns generalization sets belonging to the node, when the node is a
   * generalization of some node.
   */
  getGeneralizationSets(): IGraphGeneralizationSet[];

  /**
   * Removes the association form the node. The association still exists in the graph.
   * @param association
   */
  deleteAssociation(association: IGraphAssociation): void;

  /**
   * Checks whether the current node is a specialist node of some generalization.
   *
   * @return True if the node is a specialization of another node, otherwise false.
   */
  isSpecialization(): boolean;

  /**
   * Checks whether the current node has any specialization.
   *
   * @return True if the node has at last one specialization node, otherwise false.
   */
  hasSpecialization(): boolean;

  /**
   * Returns all associations formatted as a string.
   */
  toString(): string;
}
