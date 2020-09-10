/**
 *
 *
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Increment } from '@libs/ontouml2db/graph/util/Increment';
import { GraphGeneralizationSet } from '@libs/ontouml2db/graph/GraphGeneralizationSet';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/NodePropertyEnumeration';
import { ClassStereotype } from '@constants/.';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';

export class Lifting {
  static doLifting(graph: Graph): void {
    let node = graph.getLeafSortalNonKind();

    while (node != null) {
      Lifting.liftNode(node, graph);
      graph.removeNode(node);
      node = graph.getLeafSortalNonKind();
    }
  }

  static liftNode(node: Node, graph: Graph): void {
    Lifting.resolveGeneralization(node);

    Lifting.resolveGeneralizationSet(node, graph);

    Lifting.liftAtributes(node);

    Lifting.remakeReferences(node);
  }

  // **************************************************************************************
  // *********** Resolve the nodes generalizations
  // **************************************************************************************
  static resolveGeneralization(node: Node): void {
    let newProperty: NodeProperty;
    node.setResolved(true);
    //here, each node must have only one generaization node
    //Generalization Sets are resolved by "resolveGeneralizatinSet
    let generalization = node.getGeneralizations()[0];

    if (!generalization.isBelongGeneralizationSet()) {
      //create a boolean for the specialization
      newProperty = new NodeProperty(
        Increment.getNext().toString(),
        'is' + generalization.getSpecific().getName(),
        'boolean',
        false,
        false,
      );
      newProperty.setDefaultValue(false);

      //The new property is put in the generalizaiton node node by liftAttribute method.
      node.addProperty(newProperty);

      node.setSourceTrackerField(newProperty, true);
    }
  }

  // **************************************************************************************
  // *********** Resolve the node attributes
  // **************************************************************************************
  //must be called after creating all attributes on the specialization nodes.
  static liftAtributes(node: Node): void {
    //here, each note must have only one generaization

    if (node.getGeneralizations().length == 0) return;

    let generalization = node.getGeneralizations()[0];

    let properties = generalization.getSpecific().getProperties();

    for (let property of properties) {
      if (property.getDefaultValue() == null)
        //Does not change nullability for columns with default values (eg is_employee default false)
        property.setNullable(true);
    }
    generalization.getGeneral().addProperties(properties);
  }

  // **************************************************************************************
  // *********** Resolve the node generalization sets
  // **************************************************************************************
  static resolveGeneralizationSet(node: Node, graph: Graph): void {
    let enumTableName: string;
    let enumFieldName: string;
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
        associationName = 'enum_' + Increment.getNext();

        newEnumerationField = new NodePropertyEnumeration(
          Increment.getNext().toString(),
          enumFieldName,
          'int',
          false,
          false,
        );
        newNode = new Node(
          Increment.getNext().toString(),
          enumTableName,
          ClassStereotype.ENUMERATION,
        );
        newNode.addProperty(newEnumerationField);

        newRelation = new GraphRelation(
          associationName,
          newNode,
          Lifting.getNewSourceCardinality(gs),
          gs.getGeneral(),
          Cardinality.C0_N,
        );

        gs.getGeneral().addRelation(newRelation);
        newNode.addRelation(newRelation);

        graph.addNode(newNode);
        graph.addRelation(newRelation);

        for (let specializationNode of gs.getSpecific()) {
          newEnumerationField.addValue(specializationNode.getName());
          specializationNode.setSourceTrackerField(
            newEnumerationField,
            specializationNode.getName(),
          );
          specializationNode.setSourcePropertyLinkedAtNode(newNode);
        }
        gs.setResolved(true);
      }
    }
  }

  static getEnumName(gs: GraphGeneralizationSet): string {
    if (gs.getName() == null || gs.getName().trim() == '')
      return 'Enum' + Increment.getNext();
    else return gs.getName();
  }

  static getNewSourceCardinality(
    gs: GraphGeneralizationSet,
  ): Cardinality {
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
  static remakeReferences(node: Node): void {
    //here, each node must have only one generaization node
    let generalization = node.getGeneralizations()[0];

    let superNode = generalization.getGeneral();

    while (node.getRelations().length != 0) {
      let relation = node.getRelations()[0];
      if (relation.getSourceNode() == node) {
        relation.setSourceNode(superNode);
        relation.setTargetCardinality(
          Lifting.getNewCardinality(relation.getTargetCardinality()),
        );
      } else {
        relation.setTargetNode(superNode);
        relation.setSourceCardinality(
          Lifting.getNewCardinality(relation.getSourceCardinality()),
        );
      }
      superNode.addRelation(relation);
      node.deleteAssociation(relation);
    }
    node.changeSourceTracking(superNode);
  }

  static getNewCardinality(oldCardinality: Cardinality): Cardinality {
    if (oldCardinality == Cardinality.C1_N) {
      return Cardinality.C0_N;
    } else if (oldCardinality == Cardinality.C1) {
      return Cardinality.C0_1;
    } else return oldCardinality;
  }
}
