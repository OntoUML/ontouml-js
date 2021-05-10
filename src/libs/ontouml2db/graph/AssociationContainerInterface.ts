/**
 * An AssociationContainer is intended to group all the properties of a node.
 * A node is composed of a relationships set with other nodes. This interface contains the
 * necessary methods for handling node's associations.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { GraphGeneralizationSet } from '@libs/ontouml2db/graph/GraphGeneralizationSet';

export interface AssociationContainerInterface {
  /**
   * Adds a new association to the node. Each node has a list of its associations. In
   * this way, a association is referenced by the origin and destination node, forming
   * a bidirectional graph.
   *
   * @param relation Relatin to be added.
   */
  addRelation(relation: GraphRelation): void;

  /**
   * Returns the associations with the node.
   *
   * @return An list with all the associations that arrive and depart from the
   * respective node.
   */
  getRelations(): GraphRelation[];

  /**
   * Returns the association that references the node.
   *
   * @param nodeID Node identifier to be searched.
   */
  getAssociationWithNode(nodeID: string): GraphAssociation;

  /**
   * Adds a new generalization to the node's association set.
   *
   * @param generalization Generalization to be added
   */
  addGeneralization(generalization: GraphGeneralization);

  /**
   * Returns generalizations belonging to the node.
   */
  getGeneralizations(): GraphGeneralization[];

  /**
   * Returns generalization sets belonging to the node, when the node is a
   * generalization of some node.
   */
  getGeneralizationSets(): GraphGeneralizationSet[];

  /**
   * Removes the association form the node. The association still exists in the graph.
   * @param association
   */
  deleteAssociation(association: GraphAssociation): void;

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
