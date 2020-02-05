import { Model } from './model';

/**
 * Class that captures common properties of objects in `ontouml-schema`. Whenever necessary, stereotypes are captured as regular string arrays.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 *
 * @todo Update propertyAssignments
 * @todo Update stereotypes
 * @todo Replace strings (such as 'type') for constants
 */
export class Element {
  type: string;
  id: string;
  name: string | null;
}

/**
 * Interface implemented by elements that mays contain others (e.g., models and packages).
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export interface IContainer {
  elements: IContainedElement[] | null;

  /**
   * Returns an array of IContainedElement objects contained by it and its inner containers as well.
   */
  getAllElements(): IContainedElement[];
}

/**
 * Interface implemented by elements that are contained by containers (e.g., packages, classes and relations).
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export interface IContainedElement {
  [x: string]: any;
  container: IContainer | null;

  /**
   * Returns the element's model.
   */
  getModel(): Model;
}

/**
 * Interface that represents a Package according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IPackage extends IModelElement, IContainer {
  type: 'Package';
  elements: IModelElement[] | null;
}

/**
 * Interface that represents a Class according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IClass extends IModelElement {
  type: 'Class';
  stereotypes: string[] | null;
  properties: IProperty[] | null;
  isAbstract: boolean | null;
  isDerived: boolean | null;
}

/**
 * Interface that represents a Relation according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IRelation extends IModelElement {
  type: 'Relation';
  stereotypes: string[] | null;
  properties: IProperty[] | null;
  isAbstract: boolean | null;
  isDerived: boolean | null;
  // relations: {
  //   [key: string]: string[];
  // };
  // source?: {
  //   lowerbound: number | string;
  //   upperbound: number | string;
  // };
  // target?: {
  //   lowerbound: number | string;
  //   upperbound: number | string;
  // };
}

/**
 * Interface that represents a Generalization according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IGeneralization extends IModelElement {
  type: 'Generalization';
  general: IReference;
  specific: IReference;
}

/**
 * Interface that represents a Generalization Set according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IGeneralizationSet extends IModelElement {
  type: 'GeneralizationSet';
  isDisjoint: boolean | null;
  isComplete: boolean | null;
  categorizer: IReference | null;
  generalizations: IReference[];
}

/**
 * Interface that represents a Property according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IProperty extends IModelElement {
  type: 'Property';
  cardinality: string | null;
  stereotypes: string[] | null;
  propertyType: IReference;
  subsettedProperties: IReference[] | null;
  redefinedProperties: IReference[] | null;
  aggregationKind: 'NONE' | 'SHARED' | 'COMPOSITE';
  isDerived: boolean | null;
  isOrdered: boolean | null;
  isReadOnly: boolean | null;
}

/**
 * Utilitary interface that represents a `reference` according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IReference {
  type:
    | 'Package'
    | 'Class'
    | 'Relation'
    | 'Generalization'
    | 'GeneralizationSet'
    | 'Property';
  id: string;
}
