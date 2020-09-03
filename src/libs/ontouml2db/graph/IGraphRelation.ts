/**
 * This interface provides the necessary methods to manipulate the relations of the graph.
 *
 * Author: Gustavo L. Guidoni
 */
import { IGraphAssociation } from './IGraphAssociation';
import { INode } from './INode';
import { Cardinality } from './util/enumerations';

export interface IGraphRelation extends IGraphAssociation {
  /**
   * Indicates the source node.
   *
   * @param sourceNode. Relation source node.
   */
  setSourceNode(sourceNode: INode): void;

  /**
   * Returns the source node.
   *
   * @return Relation source node.
   */
  getSourceNode(): INode;

  /**
   * Indicates the target node.
   *
   * @param targetNode. Relation target node.
   */
  setTargetNode(targetNode: INode): void;

  /**
   * Returns the target node.
   *
   * @return Relation target node.
   */
  getTargetNode(): INode;

  /**
   * Returns the source cardinality.
   *
   * @return A Cardinality type with the source cardinality.
   */
  getSourceCardinality(): Cardinality;

  /**
   * Indicates the source cardinality.
   *
   * @param sourceCardinality. The source cardinality of the relation.
   */
  setSourceCardinality(sourceCardinality: Cardinality): void;

  /**
   * Returns the target cardinality.
   *
   * @return A Cardinality type with the target cardinality.
   */
  getTargetCardinality(): Cardinality;

  /**
   * Indicates the target cardinality.
   *
   * @param targetCardinality. The target cardinality of the relation.
   */
  setTargetCardinality(targetCardinality: Cardinality): void;

  /**
   * Clone the relation by referencing the current nodes.
   */
  clone(newID?: string): IGraphRelation;

  /**
   * Checks whether the relation refers to the node passed as a parameter.
   *
   * @param node. Node to be analyzed.
   * @return True if the node is referenced by the relation, otherwise not.
   */
  //hasRelationWithNode(node: INode): boolean;

  /**
   * Returns the relation formated as string;
   */
  toString(): string;

  /**
   * Checks if the cardinality with node is low (1; 0..1).
   *
   * @param node. Side of the relationship with the node to be evaluated.
   */
  isLowCardinalityOfNode(node: INode): boolean;

  /**
   * Checks if the cardinality with node is high (1..N; 0..N).
   *
   * @param node. Side of the relationship with the node to be evaluated.
   */
  isHighCardinalityOfNode(node: INode): boolean;
}
