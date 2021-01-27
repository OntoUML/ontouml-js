/**
 * Class responsible for handling a generalization.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { Node } from '@libs/ontouml2db/graph/Node';
import { AssociationType } from '@libs/ontouml2db/constants/enumerations';
import { Util } from '@libs/ontouml2db/util/Util';
import { GraphGeneralizationSet } from '@libs/ontouml2db/graph/GraphGeneralizationSet';

export class GraphGeneralization extends GraphAssociation {
  private generalizationNode: Node;
  private specializationNode: Node;
  private belongToGS: GraphGeneralizationSet;

  constructor(id: string, generalizationNode: Node, specializationNode: Node) {
    super(id, 'unnamed', AssociationType.GENERALIZATION_TYPE);
    this.generalizationNode = generalizationNode;
    this.specializationNode = specializationNode;
    this.belongToGS = null;
  }

  /**
   * Returns the generalization node (superclass).
   *
   * @return Generalization.
   */
  getGeneral(): Node {
    return this.generalizationNode;
  }

  /**
   * Returns the specialization node (subclass).
   *
   * @return Specialization node.
   */
  getSpecific(): Node {
    return this.specializationNode;
  }

  /**
   * Tells which set of generalizations the generalization belongs to.
   *
   * @param gs Generalization set to be associated with generalization.
   */
  setBelongGeneralizationSet(gs: GraphGeneralizationSet): void {
    this.belongToGS = gs;
  }

  /**
   * Returns which set of generalizations the generalization belongs to.
   */
  getBelongGeneralizationSet(): GraphGeneralizationSet {
    return this.belongToGS;
  }

  /**
   * Tells whether the generalization belongs to a generalization set.
   */
  isBelongGeneralizationSet(): boolean {
    if (this.belongToGS === null) return false;
    else return true;
  }

  /**
   * Clone the association changing the associated nodes to the nodes in
   * the array. This method generally used to clone the node.
   *
   * @param nodes. New nodes to be linked.
   * @return IGraphAssociation
   */
  cloneChangingReferencesTo(nodes: Node[]): GraphGeneralization {
    let newGeneralizationNode: Node = Util.findNodeById(this.generalizationNode.getId(), nodes);
    let newSpecializationNode: Node = Util.findNodeById(this.specializationNode.getId(), nodes);

    let newGeneralization: GraphGeneralization = new GraphGeneralization(
      this.getAssociationID(),
      newGeneralizationNode,
      newSpecializationNode
    );

    newGeneralizationNode.addGeneralization(newGeneralization);
    newSpecializationNode.addGeneralization(newGeneralization);

    return newGeneralization;
  }

  /**
   * Delete the association from the nodes.
   *
   * @param node Node to be checked for its existence in the association.
   */
  deleteAssociation(): void {
    this.generalizationNode.deleteAssociation(this);
    this.specializationNode.deleteAssociation(this);
  }

  /**
   * Returns the generalization formatted as string;
   */
  toString(): string {
    if (this.belongToGS === null) {
      return '\n\t : ' + this.generalizationNode.getName() + ' <- ' + this.specializationNode.getName(); // +  gs;
    } else {
      return this.belongToGS.toString();
    }
  }
}
