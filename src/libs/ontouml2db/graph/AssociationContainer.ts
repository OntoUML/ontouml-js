/**
 * An AssociationConteiner is intended to group all the properties of a node.
 * A node is composed of a relationships set with other nodes. This interface contains the
 * necessary methods for handling node's associations.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphRelation } from './GraphRelation';
import { GraphGeneralization } from './GraphGeneralization';
import { Node } from './Node';
import { GraphGeneralizationSet } from './GraphGeneralizationSet';
import { IAssociationContainer } from './IAssociationContainer';
import { GraphAssociation } from './GraphAssociation';

export class AssociationContainer implements IAssociationContainer {
  private parentNode: Node;
  private relations: GraphRelation[];
  private generalizations: GraphGeneralization[];

  constructor(parentNode: Node) {
    this.parentNode = parentNode;
    this.relations = [];
    this.generalizations = [];
  }

  /**
   * Adds a new association to the node. Each node has a list of its associations. In
   * this way, a association is referenced by the origin and destination node, forming
   * a bidirectional graph.
   *
   * @param relation Relatin to be added.
   */
  addRelation(relation: GraphRelation): void {
    this.relations.push(relation);
  }

  /**
   * Returns the associations with the node.
   *
   * @return An list with all the associations that arrive and depart from the
   * respective node.
   */
  getRelations(): GraphRelation[] {
    return this.relations;
  }

  /**
   * Adds a new generalization to the node's association set.
   *
   * @param generalization Generalizatin to be added
   */
  addGeneralization(generalization: GraphGeneralization) {
    this.generalizations.push(generalization);
  }

  /**
   * Returns generalizations belonging to the node.
   */
  getGeneralizations(): GraphGeneralization[] {
    return this.generalizations;
  }

  /**
   * Returns generalization sets belonging to the node, when the node is a
   * generalization of some node.
   */
  getGeneralizationSets(): GraphGeneralizationSet[] {
    let gSets: GraphGeneralizationSet[] = [];

    for (let generalization of this.generalizations) {
      if (generalization.isBelongGeneralizationSet()) {
        if (!gSets.includes(generalization.getBelongGeneralizationSet()))
          gSets.push(generalization.getBelongGeneralizationSet());
      }
    }
    return gSets;
  }

  /**
   * Removes the association form the node. The association still exists in the graph.
   * @param association
   */
  deleteAssociation(association: GraphAssociation): void {
    if (association instanceof GraphRelation) {
      let index = this.relations.indexOf(association);
      if (index != -1) this.relations.splice(index, 1);
    } else {
      if (association instanceof GraphGeneralization) {
        let index = this.generalizations.indexOf(association);
        this.generalizations.splice(index, 1);
      }
    }
  }

  /**
   * Checks whether the current node is a specialist node of some generalization.
   *
   * @return True if the node is a specialization of another node, otherwise false.
   */
  isSpecialization(): boolean {
    for (let generalization of this.generalizations) {
      if (generalization.getSpecific().getId() == this.parentNode.getId())
        return true;
    }
    return false;
  }

  /**
   * Checks whether the current node has any specialization.
   *
   * @return True if the node has at last one specialization node, otherwise false.
   */
  hasSpecialization(): boolean {
    for (let generalization of this.generalizations) {
      if (generalization.getGeneral().getId() == this.parentNode.getId())
        return true;
    }
    return false;
  }

  /**
   * Returns all associations formatted as a string.
   */
  toString(): string {
    let msg = '';

    if (this.generalizations.length > 0) {
      this.generalizations.forEach((genearlization: GraphGeneralization) => {
        msg += genearlization.toString();
      });
    }

    if (this.relations.length > 0) {
      msg += '\n\t : ';
      this.relations.forEach((relation: GraphRelation) => {
        msg += relation.toString() + '| ';
      });
    }

    return msg;
  }
}
