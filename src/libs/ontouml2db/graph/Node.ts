/**
 * A node represents the existence of a class in the OntoUML model, its properties and
 * associations. A node is an composition of properties and associations, therefore,
 * the node serves as an interface for manipulating properties and associations. The
 * node has the capacity to tell which nodes it has been transformed to.
 *
 * Author: Gustavo L. Guidoni
 */

import { PropertyContainerInterface } from '@libs/ontouml2db/graph/PropertyContainerInterface';
import { AssociationContainerInterface } from '@libs/ontouml2db/graph/AssociationContainerInterface';
import { PropertyContainer } from '@libs/ontouml2db/graph/PropertyContainer';
import { AssociationContainer } from '@libs/ontouml2db/graph/AssociationContainer';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphGeneralizationSet } from '@libs/ontouml2db/graph/GraphGeneralizationSet';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';

// import { ClassStereotype } from '@constants/.';

import { ClassStereotype } from '@libs/ontouml';

export class Node implements PropertyContainerInterface, AssociationContainerInterface {
  private id: string;
  private name: string;
  private stereotype: ClassStereotype;
  private resolved: boolean;

  private propertyContainer: PropertyContainerInterface;
  private associationContainer: AssociationContainer;

  private associationNameNtoN: string; //This property should only be filled in when the node originates from an N to N association.

  constructor(id: string, name: string, stereotype: ClassStereotype) {
    this.id = id;
    this.name = name;
    this.stereotype = stereotype;
    this.resolved = false;

    this.propertyContainer = new PropertyContainer();
    this.associationContainer = new AssociationContainer(this);

    this.associationNameNtoN = null;
  }

  /**
   * Returns the class identifier of the original model.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Informs the node name.
   *
   * @param name. Name of the node.
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Returns the node name.
   *
   * @return The name of the node.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Informs the node stereotype.
   *
   * @param stereotype. The stereotype name.
   */
  setStereotype(stereotype: ClassStereotype): void {
    this.stereotype = stereotype;
  }

  /**
   * Returns the stereotype name.
   *
   * @return The name of the stereotype.
   */
  getStereotype(): ClassStereotype {
    return this.stereotype;
  }

  /**
   * Informs the node's properties container.
   *
   * @param container Container to be put on the node.
   */
  setPropertyContainer(container: PropertyContainerInterface): void {
    this.propertyContainer = container;
  }

  /**
   * Informs that the node has been resolved. Used in the transformation
   * processes to walk in the graph produced by the Nodes.
   *
   * @param flag. True reports that the node was resolved, false not.
   */
  setResolved(flag: boolean): void {
    this.resolved = flag;
  }

  /**
   * Returns if the node was resolved.
   *
   * @return A boolean indicating whether the node has been resolved.
   */
  isResolved(): boolean {
    return this.resolved;
  }

  /**
   * Informs the association name of an N to N relationship.
   * @param name
   */
  setAssociationNameNtoN(name: string): void {
    this.associationNameNtoN = name;
  }

  /**
   * Returns the N to N association name in which the node originated.
   */
  getAssociationNameNtoN(): string {
    return this.associationNameNtoN;
  }

  /**
   * Creates a new node with the same properties values.
   *
   * @return A new node identical to the current one.
   */
  clone(): Node {
    let newNode: Node = new Node(this.id, this.name, this.stereotype);
    newNode.setPropertyContainer(this.propertyContainer.clonePropertyContainer());
    newNode.setAssociationNameNtoN(this.associationNameNtoN);
    return newNode;
  }

  //---------------------------------------------------------------------------------------
  //--- The methods below are intended to manipulate the attributes (PropertyContainer)
  //---------------------------------------------------------------------------------------

  addProperty(property: NodeProperty): void {
    this.propertyContainer.addProperty(property);
  }

  addProperties(properties: NodeProperty[]): void {
    this.propertyContainer.addProperties(properties);
  }

  addPropertyAt(index: number, property: NodeProperty): void {
    this.propertyContainer.addPropertyAt(index, property);
  }

  addPropertiesAt(index: number, properties: NodeProperty[]): void {
    this.propertyContainer.addPropertiesAt(index, properties);
  }

  getPropertyByID(id: string): NodeProperty {
    return this.propertyContainer.getPropertyByID(id);
  }

  getPropertyByName(name: string): NodeProperty {
    return this.propertyContainer.getPropertyByName(name);
  }

  getProperties(): NodeProperty[] {
    return this.propertyContainer.getProperties();
  }

  clonePropertyContainer(): PropertyContainerInterface {
    return this.propertyContainer.clonePropertyContainer();
  }

  removeProperty(id: string): void {
    this.propertyContainer.removeProperty(id);
  }

  getPrimaryKey(): NodeProperty {
    return this.propertyContainer.getPrimaryKey();
  }

  getPKName(): string {
    return this.propertyContainer.getPKName();
  }

  existsPropertyName(propertyName: string): boolean {
    return this.propertyContainer.existsPropertyName(propertyName);
  }

  existsProperty(property: NodeProperty): boolean {
    return this.propertyContainer.existsProperty(property);
  }

  getFKRelatedOfNodeID(id: string): NodeProperty {
    return this.propertyContainer.getFKRelatedOfNodeID(id);
  }

  //---------------------------------------------------------------------------------------
  //--- The methods below are intended to manipulate the associations (AssociationContainer)
  //---------------------------------------------------------------------------------------

  addGeneralization(generalization: GraphGeneralization) {
    this.associationContainer.addGeneralization(generalization);
  }

  getGeneralizations(): GraphGeneralization[] {
    return this.associationContainer.getGeneralizations();
  }

  getGeneralizationSets(): GraphGeneralizationSet[] {
    return this.associationContainer.getGeneralizationSets();
  }

  addRelation(relation: GraphRelation): void {
    this.associationContainer.addRelation(relation);
  }

  getRelations(): GraphRelation[] {
    return this.associationContainer.getRelations();
  }

  getAssociationWithNode(nodeID: string): GraphAssociation {
    return this.associationContainer.getAssociationWithNode(nodeID);
  }

  isSpecialization(): boolean {
    return this.associationContainer.isSpecialization();
  }

  hasSpecialization(): boolean {
    return this.associationContainer.hasSpecialization();
  }

  deleteAssociation(association: GraphAssociation): void {
    this.associationContainer.deleteAssociation(association);
  }

  //----------------------------------------------------

  toString(): string {
    let msg = '\n' + this.name + ' <<' + this.stereotype + '>>';

    msg += this.propertyContainer.toString();

    msg += this.associationContainer.toString();

    return msg;
  }
}
