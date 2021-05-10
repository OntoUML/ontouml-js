/**
 *
 *
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Increment } from '@libs/ontouml2db/util/Increment';
import { GraphGeneralizationSet } from '@libs/ontouml2db/graph/GraphGeneralizationSet';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/NodePropertyEnumeration';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

// import { ClassStereotype } from '@constants/.';

import { ClassStereotype } from '@libs/ontouml';

export class Lifting {
  static doLifting(graph: Graph, tracker: Tracker): void {
    let node = graph.getLeafSortalNonKind();

    while (node !== null) {
      Lifting.liftNode(node, graph, tracker);
      graph.removeNode(node);
      node = graph.getLeafSortalNonKind();
    }
  }

  static liftNode(node: Node, graph: Graph, tracker: Tracker): void {
    Lifting.resolveGeneralization(node, tracker);

    Lifting.resolveGeneralizationSet(node, graph, tracker);

    Lifting.liftAttributes(node);

    Lifting.remakeReferences(node, tracker);
  }

  // **************************************************************************************
  // *********** Resolve the nodes generalizations
  // **************************************************************************************
  static resolveGeneralization(node: Node, tracker: Tracker): void {
    let newProperty: NodeProperty;
    node.setResolved(true);
    //here, each node must have only one generalization node
    //Generalization Sets are resolved by "resolveGeneralizationSet
    let generalization = node.getGeneralizations()[0];

    if (!generalization.isBelongGeneralizationSet()) {
      //create a boolean for the specialization
      newProperty = new NodeProperty(
        Increment.getNext().toString(),
        'is' + generalization.getSpecific().getName(),
        'boolean',
        false,
        false
      );
      newProperty.setDefaultValue(false);

      //The new property is put in the generalization node node by liftAttribute method.
      node.addProperty(newProperty);

      //for the tracking
      tracker.moveTraceFromTo(generalization.getSpecific(), generalization.getGeneral(), newProperty, true, null);
    }
  }

  // **************************************************************************************
  // *********** Resolve the node attributes
  // **************************************************************************************
  //must be called after creating all attributes on the specialization nodes.
  static liftAttributes(node: Node): void {
    //here, each note must have only one generalization

    if (node.getGeneralizations().length === 0) return;

    let generalization = node.getGeneralizations()[0];

    let properties = generalization.getSpecific().getProperties();

    for (let property of properties) {
      if (property.getDefaultValue() === null)
        //Does not change nullability for columns with default values (eg is_employee default false)
        property.setNullable(true);
    }
    generalization.getGeneral().addProperties(properties);
  }

  // **************************************************************************************
  // *********** Resolve the node generalization sets
  // **************************************************************************************
  static resolveGeneralizationSet(node: Node, graph: Graph, tracker: Tracker): void {
    let enumTableName: string;
    let enumFieldName: string;
    let associationID: string;
    let associationName: string;
    let newEnumerationField: NodePropertyEnumeration;
    let newNode: Node;
    let newRelation: GraphRelation;

    for (let gs of node.getGeneralizationSets()) {
      //The Generalization Set is resolved as soon as it is identified and marked as resolved. Lifting is
      //necessary because the "lifting" process will call the other subclasses to resolve their attributes
      //and associations, not being able to repeat the process of solving the generalization set.
      if (!gs.isResolved()) {
        enumTableName = Lifting.getEnumName(gs);
        enumFieldName = enumTableName + 'Enum';
        associationID = 'enum_' + Increment.getNext();
        associationName = 'has_' + enumTableName;

        newEnumerationField = new NodePropertyEnumeration(Increment.getNext().toString(), enumFieldName, 'int', false, false);
        newNode = new Node(Increment.getNext().toString(), enumTableName, ClassStereotype.ENUMERATION);
        newNode.addProperty(newEnumerationField);

        newRelation = new GraphRelation(
          associationID,
          associationName,
          newNode,
          Lifting.getNewSourceCardinality(gs),
          gs.getGeneral(),
          Cardinality.C0_N
        );

        gs.getGeneral().addRelation(newRelation);
        newNode.addRelation(newRelation);

        graph.addNode(newNode);
        graph.addRelation(newRelation);

        for (let specializationNode of gs.getSpecific()) {
          newEnumerationField.addValue(specializationNode.getName());
          //for the tracking
          tracker.addFilterAtNode(
            specializationNode,
            specializationNode,
            newEnumerationField,
            specializationNode.getName(),
            newNode
          );
        }

        gs.setResolved(true);
      }
    }
  }

  static getEnumName(gs: GraphGeneralizationSet): string {
    if (gs.getName() === null || gs.getName().trim() === '') return 'Enum' + Increment.getNext();
    else return gs.getName();
  }

  static getNewSourceCardinality(gs: GraphGeneralizationSet): Cardinality {
    if (gs.isDisjoint() && gs.isComplete()) {
      return Cardinality.C1;
    } else if (gs.isDisjoint() && !gs.isComplete()) {
      return Cardinality.C0_1;
    } else if (!gs.isDisjoint() && gs.isComplete()) {
      return Cardinality.C1_N;
    } else if (!gs.isDisjoint() && !gs.isComplete()) {
      return Cardinality.C0_N;
    }
    return null;
  }

  // **************************************************************************************
  // *********** Resolve the references
  // **************************************************************************************
  static remakeReferences(node: Node, tracker: Tracker): void {
    //here, each node must have only one generalization node
    let generalization = node.getGeneralizations()[0];

    let superNode = generalization.getGeneral();

    while (node.getRelations().length !== 0) {
      let relation = node.getRelations()[0];
      if (relation.getSourceNode() === node) {
        relation.setSourceNode(superNode);
        relation.setTargetCardinality(Lifting.getNewCardinality(relation.getTargetCardinality()));
      } else {
        relation.setTargetNode(superNode);
        relation.setSourceCardinality(Lifting.getNewCardinality(relation.getSourceCardinality()));
      }
      superNode.addRelation(relation);
      node.deleteAssociation(relation);
    }

    //for the tracking
    tracker.copyTracesFromTo(node, superNode);
    tracker.removeNodeFromTraces(node);
  }

  static getNewCardinality(oldCardinality: Cardinality): Cardinality {
    if (oldCardinality === Cardinality.C1_N) {
      return Cardinality.C0_N;
    } else if (oldCardinality === Cardinality.C1) {
      return Cardinality.C0_1;
    } else return oldCardinality;
  }
}
