/**
 * Class responsible for storing all associations (Relatins, Generalizations, Generalization Sets) of the class.
 *
 * Author: Gustavo L. Guidoni
 */

import { IAssociationContainer } from '../IAssociationContainer';
import { IGraphRelation } from '../IGraphRelation';
import { IGraphGeneralization } from '../IGraphGeneralization';
import { INode } from '../INode';
import { IGraphAssociation } from '../IGraphAssociation';
import { GraphRelation } from './GraphRelation';
import { GraphGeneralization } from './GraphGeneralization';
import { IGraphGeneralizationSet } from '../IGraphGeneralizationSet';

export class AssociationContainer implements IAssociationContainer {
  private parentNode: INode;
  private relations: IGraphRelation[];
  private generalizations: IGraphGeneralization[];

  constructor(parentNode: INode) {
    this.parentNode = parentNode;
    this.relations = [];
    this.generalizations = [];
  }

  addRelation(relation: IGraphRelation): void {
    this.relations.push(relation);
  }

  getRelations(): IGraphRelation[] {
    return this.relations;
  }

  addGeneralization(generalization: IGraphGeneralization) {
    this.generalizations.push(generalization);
  }

  getGeneralizations(): IGraphGeneralization[] {
    return this.generalizations;
  }

  getGeneralizationSets(): IGraphGeneralizationSet[] {
    let gSets: IGraphGeneralizationSet[] = [];

    for (let generalization of this.generalizations) {
      if (generalization.isBelongGeneralizationSet()) {
        if (!gSets.includes(generalization.getBelongGeneralizationSet()))
          gSets.push(generalization.getBelongGeneralizationSet());
      }
    }
    return gSets;
  }

  deleteAssociation(association: IGraphAssociation): void {
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

  isSpecialization(): boolean {
    for (let generalization of this.generalizations) {
      if (
        generalization.getSpecializationNode().getId() ==
        this.parentNode.getId()
      )
        return true;
    }
    return false;
  }

  hasSpecialization(): boolean {
    for (let generalization of this.generalizations) {
      if (
        generalization.getGeneralizationNode().getId() ==
        this.parentNode.getId()
      )
        return true;
    }
    return false;
  }

  toString(): string {
    let msg = '';

    if (this.generalizations.length > 0) {
      this.generalizations.forEach((genearlization: IGraphGeneralization) => {
        msg += genearlization.toString();
      });
    }

    if (this.relations.length > 0) {
      msg += '\n\t : ';
      this.relations.forEach((relation: IGraphRelation) => {
        msg += relation.toString() + '| ';
      });
    }

    return msg;
  }
}
