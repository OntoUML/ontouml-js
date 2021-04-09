/**
 *
 * Author: Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';

import { ClassStereotype } from '@libs/ontouml';
import { Graph } from '../graph/Graph';
import { GraphGeneralization } from '../graph/GraphGeneralization';
import { GraphRelation } from '../graph/GraphRelation';
import { Increment } from './Increment';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';

export class Util {
  static findNodeById(id: string, nodes: Node[]): Node {
    let i: number = 0;

    while (i < nodes.length) {
      if (nodes[i].getId() === id) return nodes[i];
      i++;
    }
    return null;
  }

  static isNonSortal(type: ClassStereotype): boolean {
    if (
      type === ClassStereotype.CATEGORY ||
      type === ClassStereotype.ROLE_MIXIN ||
      type === ClassStereotype.PHASE_MIXIN ||
      type === ClassStereotype.MIXIN
    )
      return true;
    else return false;
  }

  static isSortalNonKind(type: ClassStereotype): boolean {
    if (type === ClassStereotype.ROLE || type === ClassStereotype.PHASE || type === ClassStereotype.SUBKIND) return true;
    else return false;
  }

  static getSpaces(name: string, qtd: number): string {
    let tam: number = name.length;
    let spaces: string;

    spaces = ' ';
    tam++;

    while (tam <= qtd) {
      spaces += ' ';
      tam++;
    }
    return spaces;
  }

  static transformGeneralizationToRelation1to1(graph: Graph): void {
    let generalization: GraphGeneralization;
    let newRelation: GraphRelation;
    let id: string;
    let toDestroy: GraphGeneralization[] = [];

    for (let association of graph.getAssociations()) {
      if (association instanceof GraphGeneralization) {
        generalization = association;

        id = Increment.getNext().toString();

        newRelation = new GraphRelation(
          id, //ID
          id, //association name
          generalization.getGeneral(), //sourceNode
          Cardinality.C1, //sourceCardinality
          generalization.getSpecific(), //targetNode
          Cardinality.C1 //targetCardinality
        );

        generalization.getGeneral().addRelation(newRelation);
        generalization.getSpecific().addRelation(newRelation);
        graph.addRelation(newRelation);

        toDestroy.push(generalization);
      }
    }

    for (generalization of toDestroy) {
      graph.removeAssociation(generalization);
    }
  }
}
