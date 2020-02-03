
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
  type: string;
  id: string;
  name: string | null;
  propertyAssignments?: any;
}

/**
 * Interface that represents a Model according to `ontouml-schema`.
 * 
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IModel extends IElement {
  type: 'Model';
  id: string;
  authors: string[] | null;
  elements: IElement[] | null;
}

/**
 * Interface that represents a Package according to `ontouml-schema`.
 * 
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IPackage extends IElement {
  type: 'Package';
  elements: IElement[] | null;
}

/**
 * Interface that represents a Class according to `ontouml-schema`.
 * 
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IClass extends IElement {
  type: 'Class',
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
interface IRelation extends IElement {
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
interface IGeneralization extends IElement {
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
interface IGeneralizationSet extends IElement {
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
interface IProperty extends IElement {
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
  type: 'Package' | 'Class' | 'Relation' | 'Generalization' | 'GeneralizationSet' | 'Property';
  id: string;
}

interface IStereotype {
  name: string;
  id: string;
  specializes: string[];
  relations: {
    [key: string]: string[];
  };
  rigidity: string;
  sortality: string;
  ultimateSortal: boolean;
}

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
