/**
 * The Node is the class responsible for storing only the classes that make up the
 * diagram. In this way, Node and Class can be understood as synonyms. The Node stores
 * all the class associations. Note: the graph formed is bidirectional.
 *
 * In order to maintain the classes traceability of the source diagram to the destination
 * diagram, the current Node also stores a reference to the destination diagram Node.
 *
 * Author: Gustavo L. Guidoni
 */

import { INode } from '../INode';
import { ClassStereotype } from '@constants/.';
import { INodeProperty } from '../INodeProperty';
import { IPropertyContainer } from '../IPropertyContainer';
import { IGraphGeneralization } from '../IGraphGeneralization';
import { IAssociationContainer } from '../IAssociationContainer';
import { IGraphRelation } from '../IGraphRelation';
import { ITrackerContainer } from '../ITrackerContainer';
import { PropertyContainer } from './PropertyContainer';
import { AssociationContainer } from './AssociationContainer';
import { TrackerContainer } from './TrackerContainer';
import { ITracker } from '../ITracker';
import { IGraphAssociation } from '../IGraphAssociation';
import { IGraphGeneralizationSet } from '../IGraphGeneralizationSet';

export class Node implements INode {
  private id: string;
  private name: string;
  private stereotype: ClassStereotype;
  private resolved: boolean;

  private propertyContainer: IPropertyContainer;
  private associationContainer: IAssociationContainer;
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

  getId(): string {
    return this.id;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setStereotype(stereotype: ClassStereotype): void {
    this.stereotype = stereotype;
  }

  getStereotype(): ClassStereotype {
    return this.stereotype;
  }

  setPropertyContainer(container: IPropertyContainer): void {
    this.propertyContainer = container;
  }

  setResolved(flag: boolean): void {
    this.resolved = flag;
  }

  isResolved(): boolean {
    return this.resolved;
  }

  trackingToString(): string {
    throw new Error('Method not implemented.');
  }

  clone(): INode {
    let newNode: INode = new Node(this.id, this.name, this.stereotype);
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

  addProperty(property: INodeProperty): void {
    this.propertyContainer.addProperty(property);
  }

  addProperties(properties: INodeProperty[]): void {
    this.propertyContainer.addProperties(properties);
  }

  addPropertyAt(index: number, property: INodeProperty): void {
    this.propertyContainer.addPropertyAt(index, property);
  }

  addPropertiesAt(index: number, properties: INodeProperty[]): void {
    this.propertyContainer.addPropertiesAt(index, properties);
  }

  getPropertyByName(name: string): INodeProperty {
    return this.propertyContainer.getPropertyByName(name);
  }

  getProperties(): INodeProperty[] {
    return this.propertyContainer.getProperties();
  }

  clonePropertyContainer(): IPropertyContainer {
    return this.propertyContainer.clonePropertyContainer();
  }

  removeProperty(id: string): void {
    this.propertyContainer.removeProperty(id);
  }

  getPrimaryKey(): INodeProperty {
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

  addGeneralization(generalization: IGraphGeneralization) {
    this.associationContainer.addGeneralization(generalization);
  }

  getGeneralizations(): IGraphGeneralization[] {
    return this.associationContainer.getGeneralizations();
  }

  getGeneralizationSets(): IGraphGeneralizationSet[] {
    return this.associationContainer.getGeneralizationSets();
  }

  addRelation(relation: IGraphRelation): void {
    this.associationContainer.addRelation(relation);
  }

  getRelations(): import('../IGraphRelation').IGraphRelation[] {
    return this.associationContainer.getRelations();
  }

  isSpecialization(): boolean {
    return this.associationContainer.isSpecialization();
  }

  hasSpecialization(): boolean {
    return this.associationContainer.hasSpecialization();
  }

  deleteAssociation(association: IGraphAssociation): void {
    this.associationContainer.deleteAssociation(association);
  }

  //---------------------------------------------------------------------------------------
  //--- The methods below are intended to manipulate the trackers nodes (TrackerContainer)
  //---------------------------------------------------------------------------------------

  addSourceTrackedNode(newNodeTracker: INode): void {
    this.trackerContainer.addSourceTrackedNode(newNodeTracker);
  }

  addTrackedNode(newNodeTracker: INode): void {
    this.trackerContainer.addTrackedNode(newNodeTracker);
  }

  addTracking(trackers: ITracker[]): void {
    this.trackerContainer.addTracking(trackers);
  }

  removeSourceTracking(): void {
    this.trackerContainer.removeSourceTracking();
  }

  removeTracking(node: INode): void {
    this.trackerContainer.removeTracking(node);
  }

  changeSourceTracking(newNodeTracker: INode): void {
    this.trackerContainer.changeSourceTracking(newNodeTracker);
  }

  changeTracking(oldNodeTracker: INode, newNodeTracker: INode): void {
    this.trackerContainer.changeTracking(oldNodeTracker, newNodeTracker);
  }

  setSourceTrackerField(property: INodeProperty, value: any): void {
    this.trackerContainer.setSourceTrackerField(property, value);
  }

  setTrackerField(node: INode, property: INodeProperty, value: any): void {
    this.trackerContainer.setTrackerField(node, property, value);
  }

  setSourcePropertyLinkedAtNode(linkedNode: INode): void {
    this.trackerContainer.setSourcePropertyLinkedAtNode(linkedNode);
  }

  setPropertyLinkedAtNode(node: INode, linkedNode: INode): void {
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

  getTrackers(): ITracker[] {
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
