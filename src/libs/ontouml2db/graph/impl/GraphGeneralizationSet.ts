/**
 * Class responsible for storing the generalization set data.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphAssociation } from './GraphAssociation';
import { IGraphGeneralizationSet } from '../IGraphGeneralizationSet';
import { INode } from '../INode';
import { AssociationType } from '../util/enumerations';
import { IGraphGeneralization } from '../IGraphGeneralization';
import { IGraphAssociation } from '../IGraphAssociation';
import { Util } from '../util/Util';

export class GraphGeneralizationSet extends GraphAssociation
  implements IGraphGeneralizationSet {
  private generalizationNode: INode;
  private specializationNodes: INode[];
  private disjoint: boolean;
  private complete: boolean;

  constructor(id: string, name: string, disjoint: boolean, complete: boolean) {
    super(id, name, AssociationType.GENERALIZATION_SET_TYPE);
    this.specializationNodes = [];
    this.disjoint = disjoint;
    this.complete = complete;
  }

  setGenealizationNode(generalizationNode: INode): void {
    this.generalizationNode = generalizationNode;
  }

  getGeneralizationNode(): INode {
    return this.generalizationNode;
  }

  addSpecializationNode(specialization: INode): void {
    if (this.specializationNodes.includes(specialization)) return;

    this.specializationNodes.push(specialization);
  }

  getSpecializations(): IGraphGeneralization[] {
    return null;
    //return this.specializations;
  }

  getSpecializationNodes(): INode[] {
    return this.specializationNodes;
  }

  isDisjoint(): boolean {
    return this.disjoint;
  }

  isComplete(): boolean {
    return this.complete;
  }

  cloneChangingReferencesTo(nodes: INode[]): IGraphAssociation {
    let gs: IGraphGeneralizationSet;
    let superNode: INode;
    let subNode: INode;
    let generalization: IGraphGeneralization;

    gs = new GraphGeneralizationSet(
      this.getAssociationID(),
      this.getName(),
      this.disjoint,
      this.complete,
    );

    superNode = Util.findNodeById(this.generalizationNode.getId(), nodes);
    gs.setGenealizationNode(superNode);

    this.specializationNodes.forEach((node: INode) => {
      subNode = Util.findNodeById(node.getId(), nodes);
      gs.addSpecializationNode(subNode);

      generalization = this.getGeneraization(superNode, subNode);
      generalization.setBelongGeneralizationSet(gs);
    });
    return gs;
  }

  private getGeneraization(
    superNode: INode,
    subNode: INode,
  ): IGraphGeneralization {
    let i: number = 0;
    let generalizations = superNode.getGeneralizations();

    while (i < generalizations.length) {
      if (
        generalizations[i].getGeneralizationNode().getId() ==
          superNode.getId() &&
        generalizations[i].getSpecializationNode().getId() == subNode.getId()
      )
        return generalizations[i];
      i++;
    }
    return null;
  }

  toString(): string {
    let msg: string = '\n\t : ';

    msg += this.generalizationNode.getName() + ' <-GS- ';

    this.specializationNodes.forEach((node: INode) => {
      msg += node.getName() + '| ';
    });

    return msg;
  }
}
