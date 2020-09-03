/**
 * Class responsible for storing relation data between the class.
 *
 * Author: Gustavo L. Guidoni
 */

import { IGraphRelation } from '../IGraphRelation';
import { INode } from '../INode';
import { Cardinality, AssociationType } from '../util/enumerations';
import { GraphAssociation } from './GraphAssociation';
import { IGraphAssociation } from '../IGraphAssociation';
import { Util } from '../util/Util';

export class GraphRelation extends GraphAssociation implements IGraphRelation {
  private sourceNode: INode;
  private targetNode: INode;
  private sourceCardinality: Cardinality;
  private targetCardinality: Cardinality;

  constructor(
    ID: string,
    sourceNdde: INode,
    sourceCardinality: Cardinality,
    targetNode: INode,
    targetCardinality: Cardinality,
  ) {
    super(ID, 'unamed', AssociationType.RELATION_TYPE);
    this.sourceNode = sourceNdde;
    this.targetNode = targetNode;
    this.sourceCardinality = sourceCardinality;
    this.targetCardinality = targetCardinality;
  }

  setSourceNode(sourceNode: INode): void {
    this.sourceNode = sourceNode;
  }

  getSourceNode(): INode {
    return this.sourceNode;
  }

  setTargetNode(targetNode: INode): void {
    this.targetNode = targetNode;
  }

  getTargetNode(): INode {
    return this.targetNode;
  }

  setSourceCardinality(sourceCardinality: Cardinality): void {
    this.sourceCardinality = sourceCardinality;
  }

  getSourceCardinality(): Cardinality {
    return this.sourceCardinality;
  }

  setTargetCardinality(targetCardinality: Cardinality): void {
    this.targetCardinality = targetCardinality;
  }

  getTargetCardinality(): Cardinality {
    return this.targetCardinality;
  }

  clone(newID?: string): IGraphRelation {
    if (newID != null) {
      return new GraphRelation(
        newID,
        this.sourceNode,
        this.sourceCardinality,
        this.targetNode,
        this.targetCardinality,
      );
    } else {
      return new GraphRelation(
        this.getAssociationID(),
        this.sourceNode,
        this.sourceCardinality,
        this.targetNode,
        this.targetCardinality,
      );
    }
  }

  cloneChangingReferencesTo(nodes: INode[]): IGraphAssociation {
    let source: INode = Util.findNodeById(this.sourceNode.getId(), nodes);
    let target: INode = Util.findNodeById(this.targetNode.getId(), nodes);

    let relation = new GraphRelation(
      this.getAssociationID(),
      source,
      this.sourceCardinality,
      target,
      this.targetCardinality,
    );

    source.addRelation(relation);
    target.addRelation(relation);

    return relation;
  }

  deleteAssociation(): void {
    this.sourceNode.deleteAssociation(this);
    this.targetNode.deleteAssociation(this);
  }

  isLowCardinalityOfNode(node: INode): boolean {
    if (
      this.sourceNode == node &&
      (this.sourceCardinality == Cardinality.C0_1 ||
        this.sourceCardinality == Cardinality.C1)
    ) {
      return true;
    }

    if (
      this.targetNode == node &&
      (this.targetCardinality == Cardinality.C0_1 ||
        this.targetCardinality == Cardinality.C1)
    ) {
      return true;
    }
    return false;
  }

  isHighCardinalityOfNode(node: INode): boolean {
    if (
      this.sourceNode == node &&
      (this.sourceCardinality == Cardinality.C0_N ||
        this.sourceCardinality == Cardinality.C1_N)
    ) {
      return true;
    }

    if (
      this.targetNode == node &&
      (this.targetCardinality == Cardinality.C0_N ||
        this.targetCardinality == Cardinality.C1_N)
    ) {
      return true;
    }
    return false;
  }

  toString(): string {
    return (
      this.sourceNode.getName() +
      '(' +
      this.sourceCardinality +
      ') - (' +
      this.targetCardinality +
      ')' +
      this.targetNode.getName()
    );
  }
}
