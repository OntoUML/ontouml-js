import { OntoUMLType } from '@constants/.';
import { AggregationKind } from '@constants/.';

/**
 * Interface that captures common properties of objects in `ontouml-schema`. Whenever necessary, stereotypes are captured as regular string arrays.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 *
 * @todo Update propertyAssignments
 * @todo Update stereotypes
 * @todo Replace strings (such as 'type') for constants
 */
interface IElement {
  type: OntoUMLType;
  // type:
  //   | 'Package'
  //   | 'Class'
  //   | 'Relation'
  //   | 'Generalization'
  //   | 'GeneralizationSet'
  //   | 'Property';
  id: string;
  name: string | null;
  description: string | null;
  propertyAssignments?: any;
  container: IContainer;

  /**
   * Returns the outtermost container of an element.
   */
  getRootPackage: () => IPackage;
}

interface IContainer extends IElement {
  /**
   * Function that returns an array of contained IElement objects.
   */
  getAllContents: () => IElement[];

  /**
   * Returns an array of all Element objects that may be reached from a package filtered by those which the type field matches the selected ones.
   *
   * @param selectedTypes - an array of strings representing the desired types (i.e., PACKAGE_TYPE, CLASS_TYPE, RELATION_TYPE, GENERALIZATION_TYPE, GENERALIZATION_SET_TYPE, or PROPERTY_TYPE).
   */
  getAllContentsByType: (types: OntoUMLType[]) => IElement[];

  /**
   * Returns an Element according of matching id.
   *
   * @param elementId - Desired element's id.
   */
  getContentById: (id: string) => IElement;
}

// interface IContainable<T extends IElement> extends IElement {
//   container: T | null;
//   getRootPackage: () => IPackage;
// }

interface IDecoratable extends IElement {
  stereotypes: string[] | null;
}

interface IClassifier extends IElement {
  properties: IProperty[] | null;
  isAbstract: boolean | null;
  isDerived: boolean | null;

  /**
   * Returns an array of Classifier objects connected to this classifier through generalizations as its parents.
   */
  getParents: () => IClassifier[];

  /**
   * Returns an array of Classifier objects connected to this classifier through generalizations as its children.
   */
  getChildren: () => IClassifier[];

  /**
   * Returns an array of Classifier objects recursivelly connected to this classifier through generalizations as its parents or ancestors.
   *
   * @param knownAncestors - MUST NOT USE in regular code. Optional attribute that allows recursive execution of the function.
   */
  getAncestors: (knownAncestors?: IClassifier[]) => IClassifier[];

  /**
   * Returns an array of Classifier objects recursivelly connected to this classifier through generalizations as its children or descendents.
   *
   * @param knownDescendents - MUST NOT USE in regular code. Optional attribute that allows recursive execution of the function.
   */
  getDescendents: (knownDescendents?: IClassifier[]) => IClassifier[];
}

// /**
//  * Interface that represents a Model according to `ontouml-schema`.
//  *
//  * @author Claudenir Fonseca
//  * @author Lucas Bassetti
//  */
// interface IModel extends IElement {
//   type: 'Model';
//   id: string;
//   authors: string[] | null;
//   elements: IElement[] | null;
// }

/**
 * Interface that represents a Package according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IPackage extends IElement, IContainer {
  type: OntoUMLType.PACKAGE_TYPE;
  // type: 'Package';
  elements: IElement[] | null;
}

/**
 * Interface that represents a Class according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IClass
  extends IElement,
    IContainer,
    // IContainable<IPackage>,
    IDecoratable {
  type: OntoUMLType.CLASS_TYPE;
  // type: 'Class';
}

/**
 * Interface that represents a Relation according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IRelation
  extends IElement,
    IContainer,
    // IContainable<IPackage>,
    IDecoratable {
  type: OntoUMLType.RELATION_TYPE;
  // type: 'Relation';
}

/**
 * Interface that represents a Generalization according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IGeneralization extends IElement {
  type: OntoUMLType.GENERALIZATION_TYPE;
  // type: 'Generalization';
  general: IClassifier;
  specific: IClassifier;
}

/**
 * Interface that represents a Generalization Set according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IGeneralizationSet extends IElement {
  type: OntoUMLType.GENERALIZATION_SET_TYPE;
  // type: 'GeneralizationSet';
  isDisjoint: boolean | null;
  isComplete: boolean | null;
  categorizer: IClass;
  generalizations: IGeneralization[];
}

/**
 * Interface that represents a Property according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IProperty extends IElement, IDecoratable {
  type: OntoUMLType.PROPERTY_TYPE;
  // type: 'Property';
  cardinality: string | null;
  propertyType: IClassifier | null;
  subsettedProperties: IProperty[] | null;
  redefinedProperties: IProperty[] | null;
  aggregationKind: AggregationKind | null;
  isDerived: boolean | null;
  isOrdered: boolean | null;
  isReadOnly: boolean | null;
}

// /**
//  * Utilitary interface that represents a `reference` according to `ontouml-schema`.
//  *
//  * @author Claudenir Fonseca
//  * @author Lucas Bassetti
//  */
// interface IReference {
//   type:
//     | 'Package'
//     | 'Class'
//     | 'Relation'
//     | 'Generalization'
//     | 'GeneralizationSet'
//     | 'Property';
//   id: string;
// }

// interface IStereotype {
//   name: string;
//   id: string;
//   specializes: string[];
//   relations: {
//     [key: string]: string[];
//   };
//   rigidity: string;
//   sortality: string;
//   ultimateSortal: boolean;
// }

interface ISelfLink {
  self: string;
}

interface IRelatedLink {
  related: {
    hred: string;
    meta: object;
  };
}

interface IOntoUMLError {
  id?: string;
  code: string;
  title: string;
  detail: string;
  links: ISelfLink | IRelatedLink;
  meta?: object;
}
