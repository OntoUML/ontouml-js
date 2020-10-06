import { OntoUMLType, AggregationKind, OntologicalNature } from '@constants/.';
import URIManager from '@libs/ontouml2gufo/uri_manager';

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
  id: string;
  name: string | null;
  description: string | null;
  propertyAssignments: any;

  /**
   * The IContainer object that contains this object (having as reference `ontouml-schema`).
   *
   * **Read Only**. Do not manually update.
   */
  _container?: IContainer | IReference;

  /**
   * Returns the outtermost container of an element.
   */
  getRootPackage?: () => IPackage;

  hasIContainerType?: () => boolean;

  hasIDecoratableType?: () => boolean;

  hasIClassifierType?: () => boolean;
}

interface IContainer extends IElement {
  /**
   * Function that returns an array of contained IElement objects.
   */
  getAllContents?: () => IElement[];

  /**
   * Returns an array of all Element objects that may be reached from a package filtered by those which the type field matches the selected ones.
   *
   * @param selectedTypes - an array of strings representing the desired types (i.e., PACKAGE_TYPE, CLASS_TYPE, RELATION_TYPE, GENERALIZATION_TYPE, GENERALIZATION_SET_TYPE, or PROPERTY_TYPE).
   */
  getAllContentsByType?: (types: OntoUMLType[]) => IElement[];

  /**
   * Returns an Element according of matching id.
   *
   * @param elementId - Desired element's id.
   */
  getContentById?: (id: string) => IElement;
}

interface IDecoratable extends IElement {
  stereotypes: string[] | null;
}

interface IClassifier extends IElement {
  properties: IProperty[] | null;
  isAbstract: boolean | null;
  isDerived: boolean | null;

  /**
   * An array of IGeneralization objects where the object is the `specific` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _generalOfGeneralizations?: IGeneralization[] | null;

  /**
   * An array of IGeneralization objects where the object is the `general` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _specificOfGeneralizations?: IGeneralization[] | null;

  /**
   * An array of IProperty objects contained by an IClass object where the object is the `propertyType` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _typeOfAttributes?: IProperty[] | null;

  /**
   * An array of IProperty objects contained by an IRelation object where the object is the `propertyType` IClassifier and the property captures the source of the relation.
   *
   * **Read Only**. Do not manually update.
   */
  _sourceOfRelations?: IProperty[] | null;

  /**
   * An array of IProperty objects contained by an IRelation object where the object is the `propertyType` IClassifier and the property captures the target of the relation.
   *
   * **Read Only**. Do not manually update.
   */
  _targetOfRelations?: IProperty[] | null;

  /**
   * An array of IProperty objects contained by an IRelation object where the object is the `propertyType` IClassifier and the property captures a member of a ternary relation.
   *
   * **Read Only**. Do not manually update.
   */
  _memberOfRelations?: IProperty[] | null;

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
  getRelations?: () => IRelation[];
}

/**
 * Interface that represents a Package according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IPackage extends IElement, IContainer {
  type: OntoUMLType.PACKAGE_TYPE;
  contents: IElement[] | null;
}

/**
 * Interface that represents a Class according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IClass extends IElement, IContainer, IDecoratable, IClassifier {
  type: OntoUMLType.CLASS_TYPE;
  allowed: string[] | null;
  isExtensional: boolean | null;
  literals: ILiteral[] | null;
  isPowertype: boolean | null;
  order: number | null;

  /**
   * An array of IGeneralizationSet objects where the object is the `categorizer` IClassifier.
   *
   * **Read Only**. Do not manually update.
   */
  _categorizerOfGeneralizationSets?: IGeneralizationSet[] | null;

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality», «subkind», «role», «phase»
   */
  isSortal?: () => boolean;

  /**
   * Returns true if the class has one of the following stereotypes as its unique stereotype: «category», «roleMixin», «phaseMixin», «mixin»
   */
  isNonSortal?: () => boolean;

  /**
   * Returns true if the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality»
   */
  isUltimateSortal?: () => boolean;

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality», «subkind», «category»
   */
  isRigid?: () => boolean;

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «mixin»
   */
  isSemiRigid?: () => boolean;

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «roleMixin», «phaseMixin», «role», «phase»
   */
  isAntiRigid?: () => boolean;

  /**
   * Returns true iff the class has all ontological natures passed through `instancesNatures` among its allowed natures.
   */
  allowsInstances?: (instancesNatures: OntologicalNature[]) => boolean;
}

/**
 * Interface that represents a Relation according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IRelation extends IElement, IContainer, IDecoratable, IClassifier {
  type: OntoUMLType.RELATION_TYPE;
  // TODO: why there is a `properType` here?

  propertyType: IReference;

  /**
   * Returns `true` if the relation is binary and relates two IClass objects
   */
  isBinary?: () => boolean;

  /**
   * Returns `true` if the relation is ternary and relates multiple IClass objects
   */
  isTernary?: () => boolean;

  /**
   * Returns `true` if the relation is binary and relates an IRelation object to an IClass object
   */
  isDerivation?: () => boolean;

  /**
   * Returns the `propertyType` of `properties[0]` if the relation is binary (see `isBinary()`).
   */
  getSource?: () => IClass;

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is binary (see `isBinary()`).
   */
  getTarget?: () => IClass;

  /**
   * Returns the `propertyType` of `properties[0]` if the relation is a derivation relation (see `isDerivation()`).
   */
  getDerivingRelation?: () => IRelation;

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is a derivation relation (see `isDerivation()`).
   */
  getDerivedClass?: () => IClass;
}

/**
 * Interface that represents a Generalization according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IGeneralization extends IElement {
  type: OntoUMLType.GENERALIZATION_TYPE;
  general: IClassifier | IReference;
  specific: IClassifier | IReference;

  /**
   * An array of IGeneralizationSet objects where the object is in the `generalizations` array.
   *
   * **Read Only**. Do not manually update.
   */
  _memberOfGeneralizationSets?: IGeneralizationSet[] | null;
}

/**
 * Interface that represents a Generalization Set according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IGeneralizationSet extends IElement {
  type: OntoUMLType.GENERALIZATION_SET_TYPE;
  isDisjoint: boolean | null;
  isComplete: boolean | null;
  categorizer: IClass | IReference;
  generalizations: IGeneralization[] | IReference[];

  /**
   * Returns `true` if the relation is binary and relates two IClass objects
   */
  getGeneral?: () => IClass;
}

/**
 * Interface that represents a Property according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IProperty extends IElement, IDecoratable {
  type: OntoUMLType.PROPERTY_TYPE;
  cardinality: string | null;
  propertyType: IClassifier | null | IReference;
  subsettedProperties: IProperty[] | null | IReference[];
  redefinedProperties: IProperty[] | null | IReference[];
  aggregationKind: AggregationKind | null;
  isDerived: boolean | null;
  isOrdered: boolean | null;
  isReadOnly: boolean | null;

  /**
   * An array of IProperty objects where the object is in the `subsettedProperties` IProperty array.
   *
   * **Read Only**. Do not manually update.
   */
  _subsettedPropertyOfProperties?: IProperty[] | null;

  /**
   * An array of IProperty objects where the object is in the `redefinedProperties` IProperty array.
   *
   * **Read Only**. Do not manually update.
   */
  _redefinedPropertyOfProperties?: IProperty[] | null;
}

/**
 * Interface that describes a Literal according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface ILiteral extends IElement {
  type: OntoUMLType.LITERAL_TYPE;
  _container?: IClass;
}

/**
 * Interface that represents a `ontouml-schema` reference to a OntoUML element.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
interface IReference {
  type: OntoUMLType;
  id: string;
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

interface IOntoUML2GUFOOptions {
  baseIRI: string;
  createInverses?: boolean;
  createObjectProperty?: boolean;
  customElementMapping?: {
    [key: string]: {
      label?: {
        [key: string]: string;
      };
      uri: string;
    };
  };
  customPackageMapping?: {
    [key: string]: {
      prefix: string;
      uri: string;
    };
  };
  format?: string;
  preAnalysis?: boolean;
  prefixPackages?: boolean;
  uriFormatBy?: 'name' | 'id';
  uriManager?: URIManager;
}

interface IPreAnalysisItem {
  id: string;
  code?: string;
  title: string;
  description: string;
  severity?: 'error' | 'warning';
  data?: Object;
}

interface IOntoUML2GUFOResult {
  preAnalysis: IPreAnalysisItem[];
  model: string;
}
