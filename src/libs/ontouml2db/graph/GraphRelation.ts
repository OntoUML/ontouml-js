/**
 * Class responsible for storing relation data between the class.
 *
 * Author: Gustavo L. Guidoni
 */

import { Cardinality, AssociationType } from '@libs/ontouml2db/constants/enumerations';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { Util } from '@libs/ontouml2db/util/Util';
import { Node } from '@libs/ontouml2db/graph/Node';

export class GraphRelation extends GraphAssociation {
  private sourceNode: Node;
  private targetNode: Node;
  private sourceCardinality: Cardinality;
  private targetCardinality: Cardinality;

  constructor(
    ID: string,
    name: string,
    sourceNode: Node,
    sourceCardinality: Cardinality,
    targetNode: Node,
    targetCardinality: Cardinality
  ) {
    super(ID, name, AssociationType.RELATION_TYPE);
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.sourceCardinality = sourceCardinality;
    this.targetCardinality = targetCardinality;
  }

  /**
   * Returns the source node.
   *
   * @return Relation source node.
   */
  getSourceNode(): Node {
    return this.sourceNode;
  }

  /**
   * Indicates the source node.
   *
   * @param sourceNode. Relation source node.
   */
  setSourceNode(sourceNode: Node): void {
    this.sourceNode = sourceNode;
  }

  /**
   * Returns the target node.
   *
   * @return Relation target node.
   */
  getTargetNode(): Node {
    return this.targetNode;
  }

  /**
   * Indicates the target node.
   *
   * @param targetNode. Relation target node.
   */
  setTargetNode(targetNode: Node): void {
    this.targetNode = targetNode;
  }

  /**
   * Returns the source cardinality.
   *
   * @return A Cardinality type with the source cardinality.
   */
  getSourceCardinality(): Cardinality {
    return this.sourceCardinality;
  }

  /**
   * Indicates the source cardinality.
   *
   * @param sourceCardinality. The source cardinality of the relation.
   */
  setSourceCardinality(sourceCardinality: Cardinality): void {
    this.sourceCardinality = sourceCardinality;
  }

  /**
   * Returns the target cardinality.
   *
   * @return A Cardinality type with the target cardinality.
   */
  getTargetCardinality(): Cardinality {
    return this.targetCardinality;
  }

  /**
   * Indicates the target cardinality.
   *
   * @param targetCardinality. The target cardinality of the relation.
   */
  setTargetCardinality(targetCardinality: Cardinality): void {
    this.targetCardinality = targetCardinality;
  }

  /**
   * Clone the relation by referencing the current nodes.
   */
  clone(newID?: string): GraphRelation {
    let newRelation: GraphRelation;
    newRelation = new GraphRelation(
      newID !== null ? newID : this.getAssociationID(),
      this.getName(),
      this.sourceNode,
      this.sourceCardinality,
      this.targetNode,
      this.targetCardinality
    );
    newRelation.setNodeNameRemoved(this.getNodeNameRemoved());
    return newRelation;
  }

  /**
   * Clone the association changing the associated nodes to the nodes in
   * the array. This method generally used to clone the node.
   *
   * @param nodes. New nodes to be linked.
   * @return IGraphAssociation
   */
  cloneChangingReferencesTo(nodes: Node[]): GraphAssociation {
    let source: Node = Util.findNodeById(this.sourceNode.getId(), nodes);
    let target: Node = Util.findNodeById(this.targetNode.getId(), nodes);

    let relation = new GraphRelation(
      this.getAssociationID(),
      this.getName(),
      source,
      this.sourceCardinality,
      target,
      this.targetCardinality
    );

    relation.setNodeNameRemoved(this.getNodeNameRemoved());

    source.addRelation(relation);
    target.addRelation(relation);

    return relation;
  }

  /**
   * Delete the association from the nodes.
   *
   * @param node Node to be checked for its existence in the association.
   */
  deleteAssociation(): void {
    this.sourceNode.deleteAssociation(this);
    this.targetNode.deleteAssociation(this);
  }

  /**
   * Checks if the cardinality with node is low (1; 0..1).
   *
   * @param node. Side of the relationship with the node to be evaluated.
   */
  isLowCardinalityOfNode(node: Node): boolean {
    if (this.sourceNode === node && (this.sourceCardinality === Cardinality.C0_1 || this.sourceCardinality === Cardinality.C1)) {
      return true;
    }

    if (this.targetNode === node && (this.targetCardinality === Cardinality.C0_1 || this.targetCardinality === Cardinality.C1)) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the cardinality with node is high (1..N; 0..N).
   *
   * @param node. Side of the relationship with the node to be evaluated.
   */
  isHighCardinalityOfNode(node: Node): boolean {
    if (
      this.sourceNode === node &&
      (this.sourceCardinality === Cardinality.C0_N || this.sourceCardinality === Cardinality.C1_N)
    ) {
      return true;
    }

    if (
      this.targetNode === node &&
      (this.targetCardinality === Cardinality.C0_N || this.targetCardinality === Cardinality.C1_N)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Returns the relation formatted as string;
   */
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
