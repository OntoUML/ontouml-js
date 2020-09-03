/**
 * Class responsible for handling a generalization.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphAssociation } from './GraphAssociation';
import { IGraphGeneralization } from '../IGraphGeneralization';
import { INode } from '../INode';
import { AssociationType } from '../util/enumerations';
import { IGraphGeneralizationSet } from '../IGraphGeneralizationSet';
import { Util } from '../util/Util';

export class GraphGeneralization extends GraphAssociation
  implements IGraphGeneralization {
  private generalizationNode: INode;
  private specializationNode: INode;
  private belongToGS: IGraphGeneralizationSet;

  constructor(
    id: string,
    generalizationNode: INode,
    specializationNode: INode,
  ) {
    super(id, 'unamed', AssociationType.GENERALIZATION_TYPE);
    this.generalizationNode = generalizationNode;
    this.specializationNode = specializationNode;
    this.belongToGS = null;
  }

  getGeneralizationNode(): INode {
    return this.generalizationNode;
  }

  setBelongGeneralizationSet(gs: IGraphGeneralizationSet): void {
    this.belongToGS = gs;
  }

  getBelongGeneralizationSet(): IGraphGeneralizationSet {
    return this.belongToGS;
  }

  isBelongGeneralizationSet(): boolean {
    if (this.belongToGS == null) return false;
    else return true;
  }

  getSpecializationNode(): INode {
    return this.specializationNode;
  }

  cloneChangingReferencesTo(nodes: INode[]): IGraphGeneralization {
    let newGeneralizationNode: INode = Util.findNodeById(
      this.generalizationNode.getId(),
      nodes,
    );
    let newSpecializationNode: INode = Util.findNodeById(
      this.specializationNode.getId(),
      nodes,
    );

    let newGeneralization: IGraphGeneralization = new GraphGeneralization(
      this.getAssociationID(),
      newGeneralizationNode,
      newSpecializationNode,
    );

    newGeneralizationNode.addGeneralization(newGeneralization);
    newSpecializationNode.addGeneralization(newGeneralization);

    return newGeneralization;
  }

  deleteAssociation(): void {
    this.generalizationNode.deleteAssociation(this);
    this.specializationNode.deleteAssociation(this);
  }

  toString(): string {
    if (this.belongToGS == null) {
      return (
        '\n\t : ' +
        this.generalizationNode.getName() +
        ' <- ' +
        this.specializationNode.getName()
      ); // +  gs;
    } else {
      return this.belongToGS.toString();
    }
  }
}
