/**
 * Class responsible for making the flatten process on the One Table per Kind mapping.
 *
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Node } from '@libs/ontouml2db/graph/Node';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Increment } from '@libs/ontouml2db/util/Increment';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

export class Flatten {
  static doFlattening(graph: Graph, tracker: Tracker): void {
    let node: Node;

    // flattens all top-level non-sortals
    node = graph.getTopLevelNonSortal();

    while (node !== null) {
      Flatten.flattenNode(node, graph, tracker);
      graph.removeNode(node);
      node = graph.getTopLevelNonSortal();
    }
  }

  static flattenNode(node: Node, graph: Graph, tracker: Tracker): void {
    for (let generalization of node.getGeneralizations()) {
      Flatten.flattenGeneralization(generalization, tracker);
    }

    //for tracking
    tracker.removeNodeFromTraces(node);

    for (let relation of node.getRelations()) {
      Flatten.flattenAssociation(node, relation, graph);
    }
  }

  static flattenGeneralization(generalization: GraphGeneralization, tracker: Tracker): void {
    //The generalization is not removed from the node here because when removing the
    //node, its associations are also removed.
    generalization.getSpecific().addPropertiesAt(0, generalization.getGeneral().getProperties());

    //for tracking between graphs
    tracker.copyTracesFromTo(generalization.getGeneral(), generalization.getSpecific());
  }

  static flattenAssociation(flattenNode: Node, relation: GraphRelation, graph: Graph): void {
    for (let generalization of flattenNode.getGeneralizations()) {
      Flatten.flattenAssociationWith(flattenNode, generalization.getSpecific(), relation, graph);
    }
  }

  static flattenAssociationWith(flattenNode: Node, toNode: Node, relation: GraphRelation, graph: Graph): void {
    let newRelation = relation.clone(Increment.getNext().toString());

    newRelation.setNodeNameRemoved(flattenNode.getName()); //this is important when there is a name collision in the FK name propagation process.

    if (relation.getSourceNode() === flattenNode) {
      newRelation.setSourceNode(toNode);
      newRelation.setSourceCardinality(Flatten.getNewCardinality(relation.getSourceCardinality()));
      newRelation.getTargetNode().addRelation(newRelation);
      newRelation.getTargetNode().deleteAssociation(relation);
    } else {
      newRelation.setTargetNode(toNode);
      newRelation.setTargetCardinality(Flatten.getNewCardinality(relation.getTargetCardinality()));
      newRelation.getSourceNode().addRelation(newRelation);
      newRelation.getSourceNode().deleteAssociation(relation);
    }
    //remove the association from the node so that it is not removed from the graph when deleting the node.
    toNode.addRelation(newRelation);
    graph.addRelation(newRelation);
  }

  static getNewCardinality(oldCardinality: Cardinality): Cardinality {
    if (oldCardinality === Cardinality.C1) {
      return Cardinality.C0_1;
    } else if (oldCardinality === Cardinality.C1_N) {
      return Cardinality.C0_N;
    } else return oldCardinality;
  }
}
