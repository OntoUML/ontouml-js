/**
 * This interface provides the necessary methods to manipulate the generalizations of the graph.
 *
 * Author: Gustavo L. Guidoni
 */
import { INode } from './INode';
import { IGraphAssociation } from './IGraphAssociation';
import { IGraphGeneralizationSet } from './IGraphGeneralizationSet';

export interface IGraphGeneralization extends IGraphAssociation {
  /**
   * Returns the generalization node.
   *
   * @return Generalization.
   */
  getGeneralizationNode(): INode;

  /**
   * Returns the specialization node.
   *
   * @return Specialization node.
   */
  getSpecializationNode(): INode;

  /**
   * Tells which set of generalizations the generalization belongs to.
   *
   * @param gs Generalization set to be associated with generalization.
   */
  setBelongGeneralizationSet(gs: IGraphGeneralizationSet): void;

  /**
   * Tells whether the generalization belongs to a generalization set.
   */
  isBelongGeneralizationSet(): boolean;

  /**
   * Returns which set of generalizations the generalization belongs to.
   */
  getBelongGeneralizationSet(): IGraphGeneralizationSet;

  /**
   * Returns the generalization formated as string;
   */
  toString(): string;
}
