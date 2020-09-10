/**
 * Class responsable for making the flatten processo on the One Table per Kind mapping.
 *
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Node } from '@libs/ontouml2db/graph/Node';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { Increment } from '@libs/ontouml2db/graph/util/Increment';

export class Flatten {
  static doFlattening(graph: Graph): void {
    let node: Node;

    // flattens all top-level non-sortals
    node = graph.getToplevelNonSortal();

    while (node != null) {
      Flatten.flattenNode(node, graph);
      graph.removeNode(node);
      node = graph.getToplevelNonSortal();
    }
  }

  static flattenNode(node: Node, graph: Graph): void {
    for (let generalization of node.getGeneralizations()) {
      Flatten.flattenGeneralization(generalization);
    }

    for (let relation of node.getRelations()) {
      Flatten.flattenAssociation(node, relation, graph);
    }
  }

  static flattenGeneralization(generalization: GraphGeneralization): void {
    //The generalization is not removed from the node here because when removing the
    //node, its associations are also removed.
    generalization
      .getSpecific()
      .addPropertiesAt(0, generalization.getGeneral().getProperties());

    //for tracking between graphs
    generalization
      .getGeneral()
      .addSourceTrackedNode(generalization.getSpecific());
    generalization
      .getSpecific()
      .addTracking(generalization.getGeneral().getTrackers());
    generalization.getGeneral().removeSourceTracking();
  }

  static flattenAssociation(
    flattenNode: Node,
    relation: GraphRelation,
    graph: Graph,
  ): void {
    for (let generalization of flattenNode.getGeneralizations()) {
      Flatten.flattenAssociationWith(
        flattenNode,
        generalization.getSpecific(),
        relation,
        graph,
      );
    }
  }

  static flattenAssociationWith(
    flattenNode: Node,
    toNode: Node,
    relation: GraphRelation,
    graph: Graph,
  ): void {
    let newRelation = relation.clone(Increment.getNext().toString());

    newRelation.setName(flattenNode.getName());

    if (relation.getSourceNode() == flattenNode) {
      newRelation.setSourceNode(toNode);
      newRelation.setSourceCardinality(
        Flatten.getNewCardinality(relation.getSourceCardinality()),
      );
      newRelation.getTargetNode().addRelation(newRelation);
      newRelation.getTargetNode().deleteAssociation(relation);
    } else {
      newRelation.setTargetNode(toNode);
      newRelation.setTargetCardinality(
        Flatten.getNewCardinality(relation.getTargetCardinality()),
      );
      newRelation.getSourceNode().addRelation(newRelation);
      newRelation.getSourceNode().deleteAssociation(relation);
    }
    //remove the association from the node so that it is not removed from the graph when deleting the node.
    toNode.addRelation(newRelation);
    graph.addRelation(newRelation);
  }

  static getNewCardinality(oldCardinality: Cardinality): Cardinality {
    if (oldCardinality == Cardinality.C1) {
      return Cardinality.C0_1;
    } else if (oldCardinality == Cardinality.C1_N) {
      return Cardinality.C0_N;
    } else return oldCardinality;
  }
}
