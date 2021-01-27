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

// import { ModelManager } from '@libs/model';
// import { IClass, IGeneralization, IRelation, IGeneralizationSet } from '@types';
// import { OntoumlType, ClassStereotype } from '@constants/.';

import { Project, OntoumlType, ClassStereotype, Class, Generalization, Relation, GeneralizationSet } from '@libs/ontouml';

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
    // classes = this.modelManager.rootPackage.getAllContentsByType([OntoumlType.CLASS_TYPE]) as Class[];
    classes = this.project.getAllClasses();

    classes.forEach((_class: Class) => {
      if (this.getUfoStereotype(_class) != null) {
        this.putClass(_class);
      }
    });
  }

  putClass(_class: Class): void {
    let node: Node;
    let property: NodeProperty;

    node = new Node(_class.id, _class.name.toString(), this.getUfoStereotype(_class));

    const { properties: attributes } = _class;

    if (attributes != null) {
      for (let i = 0; i < attributes.length; i += 1) {
        const { id: attrID, propertyType: attrElement, name: attrName, cardinality: attrCardinality } = attributes[i];
        const { name: datatypeName } = (attrElement || {}) as Class;

        property = new NodeProperty(
          attrID,
          attrName.toString(),
          datatypeName.toString(),
          this.getAcceptNull(attrCardinality),
          this.getIsMultivalued(attrCardinality)
        );

        node.addProperty(property);
      }
    }
    this.graph.addNode(node);
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
    return _class.getUniqueStereotype();
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
      const source = relation.getSource();
      const target = relation.getTarget();

      const sourceCardinality = source.cardinality.lowerBound;
      const targetCardinality = target.cardinality;

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
    let generalizations = this.modelManager.rootPackage.getAllContentsByType([
      OntoumlType.GENERALIZATION_TYPE
    ]) as IGeneralization[];

    generalizations.forEach((gen: IGeneralization) => {
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
    let generalizationSets = this.modelManager.rootPackage.getAllContentsByType([
      OntoumlType.GENERALIZATION_SET_TYPE
    ]) as IGeneralizationSet[];

    //informs the generalization set that the generalizations belong to.
    generalizationSets.forEach((gs: IGeneralizationSet) => {
      newGeneralizationSet = new GraphGeneralizationSet(gs.id, gs.name.toString(), gs.isDisjoint, gs.isComplete);
      newGeneralizationSet.setGeneral(this.graph.getNodeById(gs.getGeneral().id));

      gs.generalizations.forEach((generalization: IGeneralization) => {
        newGeneralizationSet.addSpecific(this.graph.getNodeById(generalization.specific.id) as Node);
        graphGeneralization = this.graph.getAssociationByID(generalization.id) as GraphGeneralization;
        graphGeneralization.setBelongGeneralizationSet(newGeneralizationSet);
      });
      this.graph.addGeneralizationSet(newGeneralizationSet);
    });
  }
}
