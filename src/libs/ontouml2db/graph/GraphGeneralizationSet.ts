/**
 * Class responsible for storing the generalization set data.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { Node } from '@libs/ontouml2db/graph/Node';
import { AssociationType } from '@libs/ontouml2db/constants/enumerations';
import { Util } from '@libs/ontouml2db/util/Util';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';

export class GraphGeneralizationSet extends GraphAssociation {
  private generalizationNode: Node;
  private specializationNodes: Node[];
  private disjoint: boolean;
  private complete: boolean;

  constructor(id: string, name: string, disjoint: boolean, complete: boolean) {
    super(id, name, AssociationType.GENERALIZATION_SET_TYPE);
    this.specializationNodes = [];
    this.disjoint = disjoint;
    this.complete = complete;
  }

  /**
   * Informs the generalist node of the generalization set.
   *
   * @param generalizationNode Generalist node.
   */
  setGeneral(generalizationNode: Node): void {
    this.generalizationNode = generalizationNode;
  }

  /**
   * Returns the generalization set supernode.
   *
   * @return Node with the supernode.
   */
  getGeneral(): Node {
    return this.generalizationNode;
  }

  /**
   * Adds a new specialization node to the generalization set.,
   *
   * @param specialization Specialization node to be add in the generalization set
   */
  addSpecific(specialization: Node): void {
    if (this.specializationNodes.includes(specialization)) return;

    this.specializationNodes.push(specialization);
  }

  /**
   * Returns the specialization nodes linked to the generalization set.
   *
   * @return An ArrayList with all the specialization nodes.
   */
  getSpecific(): Node[] {
    return this.specializationNodes;
  }

  /**
   * Checks whether the generalization set is disjoint.
   *
   * @return True if the generalization set is disjoint and false if it
   * is overlapping.
   */
  isDisjoint(): boolean {
    return this.disjoint;
  }

  /**
   * Checks whether the generalization set is classified as incomplete.
   *
   * @return True if the generalization set is classified as complete
   * and false if it is incomplete.
   */
  isComplete(): boolean {
    return this.complete;
  }

  /**
   * Clone the association changing the associated nodes to the nodes in
   * the array. This method generally used to clone the node.
   *
   * @param nodes. New nodes to be linked.
   * @return IGraphAssociation
   */
  cloneChangingReferencesTo(nodes: Node[]): GraphGeneralizationSet {
    let gs: GraphGeneralizationSet;
    let superNode: Node;
    let subNode: Node;
    let generalization: GraphGeneralization;

    gs = new GraphGeneralizationSet(this.getAssociationID(), this.getName(), this.disjoint, this.complete);

    superNode = Util.findNodeById(this.generalizationNode.getId(), nodes);
    gs.setGeneral(superNode);

    this.specializationNodes.forEach((node: Node) => {
      subNode = Util.findNodeById(node.getId(), nodes);
      gs.addSpecific(subNode);

      generalization = this.getGeneralization(superNode, subNode);
      generalization.setBelongGeneralizationSet(gs);
    });

    return gs;
  }

  private getGeneralization(superNode: Node, subNode: Node): GraphGeneralization {
    let i: number = 0;
    let generalizations = superNode.getGeneralizations();

    while (i < generalizations.length) {
      if (
        generalizations[i].getGeneral().getId() === superNode.getId() &&
        generalizations[i].getSpecific().getId() === subNode.getId()
      )
        return generalizations[i];
      i++;
    }
    return null;
  }

  /**
   * Returns the generalization set formatted as string;
   */
  toString(): string {
    let msg: string = '\n\t : ';

    msg += this.generalizationNode.getName() + ' <-GS- ';

    this.specializationNodes.forEach((node: Node) => {
      msg += node.getName() + '| ';
    });

    return msg;
  }
}
