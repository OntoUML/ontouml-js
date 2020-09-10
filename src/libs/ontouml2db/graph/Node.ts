/**
 * A node represents the existence of a class in the OntoUML model, its properties and
 * associations. A node is an composition of properties and associations, therefore,
 * the node serves as an interface for manipulating properties and associations. The
 * node has the capacity to tell which nodes it has been transformed to.
 *
 * Author: Gustavo L. Guidoni
 */

import { ClassStereotype } from '@constants/.';
import { IPropertyContainer } from './IPropertyContainer';
import { ITrackerContainer } from './ITrackerContainer';
import { IAssociationContainer } from './IAssociationContainer';
import { PropertyContainer } from './PropertyContainer';
import { AssociationContainer } from './AssociationContainer';
import { TrackerContainer } from './TrackerContainer';
import { NodeProperty } from './NodeProperty';
import { GraphGeneralization } from './GraphGeneralization';
import { GraphGeneralizationSet } from './GraphGeneralizationSet';
import { GraphRelation } from './GraphRelation';
import { GraphAssociation } from './GraphAssociation';
import { Tracker } from './Tracker';

export class Node
  implements IPropertyContainer, IAssociationContainer, ITrackerContainer {
  private id: string;
  private name: string;
  private stereotype: ClassStereotype;
  private resolved: boolean;

  private propertyContainer: IPropertyContainer;
  private associationContainer: AssociationContainer;
  private trackerContainer: ITrackerContainer;

  constructor(id: string, name: string, stereotype: ClassStereotype) {
    this.id = id;
    this.name = name;
    this.stereotype = stereotype;
    this.resolved = false;

    this.propertyContainer = new PropertyContainer();
    this.associationContainer = new AssociationContainer(this);
    this.trackerContainer = new TrackerContainer(this);
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
  setPropertyContainer(container: IPropertyContainer): void {
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
   * Returns a string containing the description of the trace.
   *
   * @return A string with tracking of the node.
   */
  trackingToString(): string {
    throw new Error('Method not implemented.');
  }

  /**
   * Creates a new node with the same properties values.
   *
   * @return A new node identical to the current one.
   */
  clone(): Node {
    let newNode: Node = new Node(this.id, this.name, this.stereotype);
    newNode.setPropertyContainer(
      this.propertyContainer.clonePropertyContainer(),
    );
    newNode.addTrackedNode(this);
    this.addTrackedNode(newNode);
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

  getPropertyByName(name: string): NodeProperty {
    return this.propertyContainer.getPropertyByName(name);
  }

  getProperties(): NodeProperty[] {
    return this.propertyContainer.getProperties();
  }

  clonePropertyContainer(): IPropertyContainer {
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

  isSpecialization(): boolean {
    return this.associationContainer.isSpecialization();
  }

  hasSpecialization(): boolean {
    return this.associationContainer.hasSpecialization();
  }

  deleteAssociation(association: GraphAssociation): void {
    this.associationContainer.deleteAssociation(association);
  }

  //---------------------------------------------------------------------------------------
  //--- The methods below are intended to manipulate the trackers nodes (TrackerContainer)
  //---------------------------------------------------------------------------------------

  addSourceTrackedNode(newNodeTracker: Node): void {
    this.trackerContainer.addSourceTrackedNode(newNodeTracker);
  }

  addTrackedNode(newNodeTracker: Node): void {
    this.trackerContainer.addTrackedNode(newNodeTracker);
  }

  addTracking(trackers: Tracker[]): void {
    this.trackerContainer.addTracking(trackers);
  }

  removeSourceTracking(): void {
    this.trackerContainer.removeSourceTracking();
  }

  removeTracking(node: Node): void {
    this.trackerContainer.removeTracking(node);
  }

  changeSourceTracking(newNodeTracker: Node): void {
    this.trackerContainer.changeSourceTracking(newNodeTracker);
  }

  changeTracking(oldNodeTracker: Node, newNodeTracker: Node): void {
    this.trackerContainer.changeTracking(oldNodeTracker, newNodeTracker);
  }

  setSourceTrackerField(property: NodeProperty, value: any): void {
    this.trackerContainer.setSourceTrackerField(property, value);
  }

  setTrackerField(node: Node, property: NodeProperty, value: any): void {
    this.trackerContainer.setTrackerField(node, property, value);
  }

  setSourcePropertyLinkedAtNode(linkedNode: Node): void {
    this.trackerContainer.setSourcePropertyLinkedAtNode(linkedNode);
  }

  setPropertyLinkedAtNode(node: Node, linkedNode: Node): void {
    this.trackerContainer.setPropertyLinkedAtNode(node, linkedNode);
  }

  removeSourcePropertyLinkedAtNode(id: string): void {
    this.trackerContainer.removeSourcePropertyLinkedAtNode(id);
  }

  removePropertyLinkedAtNode(id: string): void {
    this.trackerContainer.removePropertyLinkedAtNode(id);
  }

  getAmountNodesTracked(): number {
    throw new Error('Method not implemented.');
  }
  getTargetColumnName(field: string): string {
    throw new Error('Method not implemented.');
  }
  getTargetPKName(): string {
    throw new Error('Method not implemented.');
  }

  getTrackers(): Tracker[] {
    return this.trackerContainer.getTrackers();
  }

  //----------------------------------------------------

  toString(): string {
    let msg = '\n' + this.name + ' <<' + this.stereotype + '>>';

    msg += this.propertyContainer.toString();

    msg += this.associationContainer.toString();

    msg += this.trackerContainer.toString();

    return msg;
  }
}
