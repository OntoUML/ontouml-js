import { OntoUMLType } from '@constants/.';
import { Project } from './project';
import { Package } from './Package';
import { Property } from './Property';
import { Generalization } from './Generalization';
import { Relation } from './Relation';

export class ModelElement {
  type: OntoUMLType;
  id: string;
  name: string | object | null; // TODO: add support to multilingual textual fields
  description: string | object | null;
  propertyAssignments: any;

  _project?: Project; // TODO: look for circular dependency issues
  _parent?: null | object; // TODO: should we detail the parent's type as Package or Class, for instance?

  constructor() {
    throw new Error('Class unimplemented');
  }

  toJSON(): object {
    throw new Error('Method unimplemented!');
  }
}

export interface IClassifier {
  properties: Property[] | null;
  isAbstract: boolean | null;
  isDerived: boolean | null;

  /**
   * An array of IGeneralization objects where the object is the `specific` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _generalOf?: Generalization[] | null;

  /**
   * An array of IGeneralization objects where the object is the `general` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _specificOf?: Generalization[] | null;

  /**
   * An array of IProperty objects contained by an IClass object where the object is the `propertyType` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _typeOf?: Property[] | null;

  /**
   * An array of IProperty objects contained by an IRelation object where the object is the `propertyType` IClassifier and the property captures the source of the relation.
   *
   * **Read Only**. Do not manually update.
   */
  _sourceOf?: Property[] | null;

  /**
   * An array of IProperty objects contained by an IRelation object where the object is the `propertyType` IClassifier and the property captures the target of the relation.
   *
   * **Read Only**. Do not manually update.
   */
  _targetOf?: Property[] | null;

  /**
   * An array of IProperty objects contained by an IRelation object where the object is the `propertyType` IClassifier and the property captures a member of a ternary relation.
   *
   * **Read Only**. Do not manually update.
   */
  _memberOf?: null | { position: number; property: Property }[];

  /**
   * Returns an array of Classifier objects connected to this classifier through generalizations as its parents.
   */
  getParents?: () => IClassifier[];

  /**
   * Returns an array of Classifier objects connected to this classifier through generalizations as its children.
   */
  getChildren?: () => IClassifier[];

  /**
   * Returns an array of Classifier objects recursivelly connected to this classifier through generalizations as its parents or ancestors.
   *
   * @param knownAncestors - MUST NOT USE in regular code. Optional attribute that allows recursive execution of the function.
   */
  getAncestors?: (knownAncestors?: IClassifier[]) => IClassifier[];

  /**
   * Returns an array of Classifier objects recursivelly connected to this classifier through generalizations as its children or descendents.
   *
   * @param knownDescendants - MUST NOT USE in regular code. Optional attribute that allows recursive execution of the function.
   */
  getDescendants?: (knownDescendants?: IClassifier[]) => IClassifier[];

  /**
   * Returns an array of Relations objects connected to this classifier
   */
  // TODO: consider removing this since we should have access to the "association ends"
  getRelations?: () => Relation[];
}
