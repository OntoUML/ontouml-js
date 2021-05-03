/**
 * Class responsible for assembling the graph that represents the class model.
 *
 * Author: Gustavo L. Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Node } from '@libs/ontouml2db/graph/Node';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphGeneralizationSet } from '@libs/ontouml2db/graph/GraphGeneralizationSet';
import { Project, ClassStereotype, Class, Generalization, Relation, GeneralizationSet } from '@libs/ontouml';

export class Factory {
  graph: Graph;
  project: Project;

  constructor(project: Project) {
    this.project = project;

    this.graph = new Graph();
  }

  mountGraph(): Graph {
    this.putClasses();

    this.putRelations();

    this.putGeneralizations();

    this.putGeneralizationSets();

    return this.graph;
  }

  /********************************************************************
   ** puts the classes
   *********************************************************************/
  putClasses(): void {
    let classes: Class[];
    classes = this.project.getAllClasses();

    classes.forEach((_class: Class) => {
      if (this.getUfoStereotype(_class)) {
        this.putClass(_class);
      }
    });
  }

  putClass(_class: Class): void {
    const node: Node = new Node(_class.id, _class.getNameOrId(), this.getUfoStereotype(_class));

    for (const attribute of _class.getOwnAttributes()) {
      const cardinality = attribute.cardinality.lowerBound + '..' + attribute.cardinality.upperBound;

      const property: NodeProperty = new NodeProperty(
        attribute.id,
        attribute.getName(),
        attribute.propertyType.getName(),
        this.getAcceptNull(cardinality),
        this.getIsMultivalued(cardinality)
      );

      node.addProperty(property);
    }

    this.graph.putNode(node);
  }

  getAcceptNull(cardinality: string): boolean {
    if (cardinality === null) return true;

    if (cardinality.substring(0, 1) === '0') return true;
    else return false;
  }

  getIsMultivalued(cardinality: string): boolean {
    if (cardinality === null) return false;

    if (cardinality.length > 3) {
      let num = cardinality.substring(cardinality.length - 1, cardinality.length);

      if (num === '*') return true;

      if (!isNaN(parseFloat(num))) {
        if (Number(num) > 1) return true;
        else return false;
      }
    }
    return false;
  }

  getUfoStereotype(_class: Class): ClassStereotype {
    return [ClassStereotype.TYPE, ClassStereotype.DATATYPE, ClassStereotype.ABSTRACT].includes(_class.stereotype)
      ? null
      : _class.stereotype;
  }

  /********************************************************************
   ** puts the relations
   *********************************************************************/

  putRelations(): void {
    let newRelation: GraphRelation;
    let sourceNode: Node;
    let targetNode: Node;
    let relations = this.project.getAllRelations();

    relations.forEach((relation: Relation) => {
      const source = relation.getSourceEnd();
      const target = relation.getTargetEnd();

      const sourceCardinality = `${source.cardinality.lowerBound}..${source.cardinality.upperBound}`;
      const targetCardinality = `${target.cardinality.lowerBound}..${target.cardinality.upperBound}`;

      sourceNode = this.graph.getNodeById(relation.getSource().id);
      targetNode = this.graph.getNodeById(relation.getTarget().id);

      newRelation = new GraphRelation(
        relation.id,
        relation.getName(),
        sourceNode,
        this.getCardinality(sourceCardinality),
        targetNode,
        this.getCardinality(targetCardinality)
      );

      sourceNode.addRelation(newRelation);
      targetNode.addRelation(newRelation);

      this.graph.addRelation(newRelation);
    });
  }

  getCardinality(cardinality: string): Cardinality {
    let lowerCardinality = this.getLowerBoundCardinality(cardinality);
    let upperCardinality = this.getUpperBoundCardinality(cardinality);

    if (lowerCardinality === 0) {
      if (upperCardinality === 1) return Cardinality.C0_1;
      else return Cardinality.C0_N; // 0..2, 0..3, ..., 0..*
    } else {
      if (lowerCardinality === 1) {
        if (upperCardinality === 1) return Cardinality.C1;
        else return Cardinality.C1_N; // 1..2, 1..3, ..., 1..*
      } else {
        return Cardinality.C1_N;
      }
    }
  }

  getLowerBoundCardinality(cardinality: string): number {
    const cardinalities = cardinality.split('..');
    const lowerBound = cardinalities[0];

    return lowerBound === '*' ? 99999 : Number(lowerBound);
  }

  getUpperBoundCardinality(cardinality: string): number {
    const cardinalities = cardinality.split('..');
    const upperBound = cardinalities[1] || cardinalities[0];

    return upperBound === '*' ? 99999 : Number(upperBound);
  }

  /********************************************************************
   ** puts the generalizations
   *********************************************************************/
  putGeneralizations(): void {
    let newGeneralization: GraphGeneralization;
    let generalizationNode: Node;
    let specializationNode: Node;
    let generalizations = this.project.getAllGeneralizations();

    generalizations.forEach((gen: Generalization) => {
      generalizationNode = this.graph.getNodeById(gen.general.id);
      specializationNode = this.graph.getNodeById(gen.specific.id);

      newGeneralization = new GraphGeneralization(gen.id, generalizationNode, specializationNode);

      generalizationNode.addGeneralization(newGeneralization);
      specializationNode.addGeneralization(newGeneralization);

      this.graph.addGeneralization(newGeneralization);
    });
  }

  /********************************************************************
   ** puts the generalization sets
   *********************************************************************/
  putGeneralizationSets(): void {
    let newGeneralizationSet: GraphGeneralizationSet;
    let graphGeneralization: GraphGeneralization;
    let generalizationSets = this.project.getAllGeneralizationSets();

    //informs the generalization set that the generalizations belong to.
    generalizationSets.forEach((gs: GeneralizationSet) => {
      newGeneralizationSet = new GraphGeneralizationSet(gs.id, gs.getNameOrId(), gs.isDisjoint, gs.isComplete);
      newGeneralizationSet.setGeneral(this.graph.getNodeById((gs.getGeneral() as Class).id));

      gs.generalizations.forEach((generalization: Generalization) => {
        newGeneralizationSet.addSpecific(this.graph.getNodeById(generalization.specific.id) as Node);
        graphGeneralization = this.graph.getAssociationByID(generalization.id) as GraphGeneralization;
        graphGeneralization.setBelongGeneralizationSet(newGeneralizationSet);
      });
      this.graph.addGeneralizationSet(newGeneralizationSet);
    });
  }
}
