/**
 *
 * Author: Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';

import { ClassStereotype } from '@libs/ontouml';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Increment } from '@libs/ontouml2db/util/Increment';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { Tracer } from '@libs/ontouml2db/tracker/Tracer';
import { TracedNode } from '@libs/ontouml2db/tracker/TracedNode';

export class Util {

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
        newRelation.setDerivedFromGeneralization(true);

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

  static updateSubjectForRootClass(graph: Graph, tracker: Tracker): void{
    let rootNode: Node;
    tracker.getTraceMap().forEach( (trace: Tracer) => {
      trace.getTargetNodes().forEach((tracedNode: TracedNode) => {
        tracedNode.getNodes().forEach( (node: Node) => {
          if(node.isSpecialization()){
            rootNode = node;
            while( rootNode.isSpecialization()){
              rootNode = rootNode.getGeneralizationNodes()[0];
            }
            tracedNode.setSubject(rootNode);
          }
        });
      });
    } );
  }
}
