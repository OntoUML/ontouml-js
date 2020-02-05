import schemas from 'ontouml-schema';
import Ajv from 'ajv';
import memoizee from 'memoizee';
import {
  PACKAGE_TYPE,
  CLASS_TYPE,
  RELATION_TYPE,
  GENERALIZATION_TYPE,
  GENERALIZATION_SET_TYPE,
} from '@constants/model_types';
import { Property } from './property';
import { Package } from './package';

/**
 * Utility class for the manipulation of models in OntoUML2 in conformance to the `ontouml-schema` definition.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class OntoUML2Model {
  model: IModel;

  constructor(model?: IModel) {
    let validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
    let isValid = validator(model);

    if (!isValid) {
      throw {
        message: 'Invalid model input.',
        errors: validator.errors,
      };
    }

    this.model = model;
    this.getElements = memoizee(this.getElements);
    this.getPackages = memoizee(this.getPackages);
    this.getClasses = memoizee(this.getClasses);
    this.getRelations = memoizee(this.getRelations);
    this.getGeneralizations = memoizee(this.getGeneralizations);
    this.getGeneralizationSets = memoizee(this.getGeneralizationSets);
    this.getProperties = memoizee(this.getProperties);
    this.getElementById = memoizee(this.getElementById);
    this.getPackageById = memoizee(this.getPackageById);
    this.getClassById = memoizee(this.getClassById);
    this.getRelationById = memoizee(this.getRelationById);
    this.getGeneralizationById = memoizee(this.getGeneralizationById);
    this.getGeneralizationSetById = memoizee(this.getGeneralizationSetById);
    this.getPropertyById = memoizee(this.getPropertyById);
    this.getParentsIds = memoizee(this.getParentsIds);
    this.getChildrenIds = memoizee(this.getChildrenIds);
    this.getAncestorsIds = memoizee(this.getAncestorsIds);
    this.getChildrenIds = memoizee(this.getChildrenIds);
  }

  /**
   * Function that returns an array of contained IElement objects.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IElement objects contained within the model or the package parameter.
   */
  getElements(packageElement?: IPackage): IElement[] {
    const current = packageElement || this.model;
    let elements: IElement[] = current.elements || [];

    elements.forEach((element: IElement) => {
      if (element.type === PACKAGE_TYPE) {
        elements = [...elements, ...this.getElements(<IPackage>element)];
      }
    });

    return elements;
  }

  /**
   * Function that returns all packages in the model or passed package.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IPackage objects contained within the model or the package parameter.
   */
  getPackages(packageElement?: IPackage): IPackage[] {
    const elements = packageElement
      ? this.getElements(packageElement)
      : this.getElements();

    return elements
      .filter((element: IElement) => element.type === PACKAGE_TYPE)
      .map((element: IPackage) => element);
  }

  /**
   * Function that returns all classes in the model or passed package.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IClass objects contained within the model or the package parameter.
   */
  getClasses(packageElement?: IPackage): IClass[] {
    const elements = packageElement
      ? this.getElements(packageElement)
      : this.getElements();

    return elements
      .filter((element: IElement) => element.type === CLASS_TYPE)
      .map((element: IClass) => element);
  }

  /**
   * Function that returns all relations in the model or passed package.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IRelation objects contained within the model or the package parameter.
   */
  getRelations(packageElement?: IPackage): IRelation[] {
    const elements = packageElement
      ? this.getElements(packageElement)
      : this.getElements();

    return elements
      .filter((element: IElement) => element.type === RELATION_TYPE)
      .map((element: IRelation) => element);
  }

  /**
   * Function that returns all generalizations in the model or passed package.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IGeneralization objects contained within the model or the package parameter.
   */
  getGeneralizations(packageElement?: IPackage): IGeneralization[] {
    const elements = packageElement
      ? this.getElements(packageElement)
      : this.getElements();

    return elements
      .filter((element: IElement) => element.type === GENERALIZATION_TYPE)
      .map((element: IGeneralization) => element);
  }

  /**
   * Function that returns all generalization sets in the model or passed package.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IGeneralizationSet objects contained within the model or the package parameter.
   */
  getGeneralizationSets(packageElement?: IPackage): IGeneralizationSet[] {
    const elements = packageElement
      ? this.getElements(packageElement)
      : this.getElements();

    return elements
      .filter((element: IElement) => element.type === GENERALIZATION_SET_TYPE)
      .map((element: IGeneralizationSet) => element);
  }

  /**
   * Function that returns all properties in the model or passed package.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IProperty objects contained within the model or the package parameter.
   */
  getProperties(packageElement?: IPackage): IProperty[] {
    const elements = packageElement
      ? this.getElements(packageElement)
      : this.getElements();

    let properties: IProperty[] = [];

    elements.forEach((element: IElement) => {
      if (element.type === CLASS_TYPE) {
        properties = [...properties, ...(<IClass>element).properties];
      } else if (element.type === RELATION_TYPE) {
        properties = [...properties, ...(<IRelation>element).properties];
      }
    });

    return properties;
  }

  /**
   * Returns an IElement according to its id.
   *
   * @param elementId - Desired element's id.
   */
  getElementById(elementId: string): IElement {
    return this.getElements().find(
      (element: IElement) => element.id === elementId,
    );
  }

  /**
   * Returns an IPackage according to its id.
   *
   * @param packageId - Desired element's id.
   */
  getPackageById(packageId: string): IPackage {
    return this.getPackages().find(
      (packageElement: IPackage) => packageElement.id === packageId,
    );
  }

  /**
   * Returns an IClass according to its id.
   *
   * @param classId - Desired element's id.
   */
  getClassById(classId: string): IClass {
    return this.getClasses().find(
      (classElement: IClass) => classElement.id === classId,
    );
  }

  /**
   * Returns an IRelation according to its id.
   *
   * @param relationId - Desired element's id.
   */
  getRelationById(relationId: string): IRelation {
    return this.getRelations().find(
      (relation: IRelation) => relation.id === relationId,
    );
  }

  /**
   * Returns an IGeneralization according to its id.
   *
   * @param generalizationId - Desired element's id.
   */
  getGeneralizationById(generalizationId: string): IGeneralization {
    return this.getGeneralizations().find(
      (generalization: IGeneralization) =>
        generalization.id === generalizationId,
    );
  }

  /**
   * Returns an IGeneralizationSet according to its id.
   *
   * @param generalizationSetId - Desired element's id.
   */
  getGeneralizationSetById(generalizationSetId: string): IGeneralizationSet {
    return this.getGeneralizationSets().find(
      (generalizationSet: IGeneralizationSet) =>
        generalizationSet.id === generalizationSetId,
    );
  }

  /**
   * Returns an IProperty according to its id.
   *
   * @param propertyId - Desired element's id.
   */
  getPropertyById(propertyId: string): IProperty {
    return this.getProperties().find(
      (property: IProperty) => property.id === propertyId,
    );
  }

  /**
   * Returns an array of string ids of the parents of an element.
   *
   * @param specificElementId - Desired element's id.
   */
  getParentsIds(specificElementId: string): string[] {
    return this.getGeneralizations()
      .filter(
        (generalization: IGeneralization) =>
          generalization.specific.id === specificElementId,
      )
      .map((generalization: IGeneralization) => generalization.id);
  }

  /**
   * Returns an array of string ids of the children of an element.
   *
   * @param generalElementId - Desired element's id.
   */
  getChildrenIds(generalElementId: string): string[] {
    return this.getGeneralizations()
      .filter(
        (generalization: IGeneralization) =>
          generalization.general.id === generalElementId,
      )
      .map((generalization: IGeneralization) => generalization.id);
  }

  /**
   * Returns an array of string ids of the ancestors of an element.
   *
   * @param elementId - Desired element's id.
   * @param knownAncestorsIds - MUST NOT USE in regular code. Optional attribute that allows recursive execution of the function.
   */
  getAncestorsIds(elementId: string, knownAncestorsIds?: string[]): string[] {
    let ancestorsIds = [] || [...knownAncestorsIds];
    this.getParentsIds(elementId).forEach((parentId: string) => {
      if (!ancestorsIds.includes(parentId)) {
        ancestorsIds.push(parentId);
        ancestorsIds = [
          ...ancestorsIds,
          ...this.getAncestorsIds(parentId, ancestorsIds),
        ];
      }
    });

    return ancestorsIds;
  }

  /**
   * Returns an array of string ids of the descendents of an element.
   *
   * @param elementId - Desired element's id.
   * @param knownAncestorsIds - MUST NOT USE in regular code. Optional attribute that allows recursive execution of the function.
   */
  getDescendentsIds(
    elementId: string,
    knownDescendentsIds?: string[],
  ): string[] {
    let descendentsIds = [] || [...knownDescendentsIds];
    this.getChildrenIds(elementId).forEach((childId: string) => {
      if (!descendentsIds.includes(childId)) {
        descendentsIds.push(childId);
        descendentsIds = [
          ...descendentsIds,
          ...this.getDescendentsIds(childId, descendentsIds),
        ];
      }
    });

    return descendentsIds;
  }
}

/**
 * Abstract class that captures OntoUML elements.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export abstract class Element {
  type: string;
  id: string;
  name: string | null;
  description: string | null;
  container: Element | null;

  constructor(
    type: string,
    id: string,
    enableMemoization = false,
    description?: string,
    name?: string,
    container?: Element,
  ) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.description = description;
    this.container = container;

    if (enableMemoization) {
      this.getRootPackage = memoizee(this.getRootPackage);
    }
  }

  /**
   * Returns the outtermost container of an element.
   */
  getRootPackage(): Package {
    if (this.container) {
      let root: Package;
      root = this.container.getRootPackage();
      if (this instanceof Package && root === this) {
        throw 'Circular containment references';
      } else if (root) {
        return root;
      } else if (this.container instanceof Package) {
        return this.container;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

/**
 * Abstract class that captures OntoUML elements that can be decorated with stereotypes.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export abstract class Stereotyped extends Element {
  stereotypes: string[] | null;

  constructor(
    type: string,
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    stereotypes?: string[],
    container?: Element,
  ) {
    super(type, id, enableHash, name, description, container);
    this.stereotypes = stereotypes;

    // if (enableHash) {}
  }
}

/**
 * Abstract class that captures OntoUML elements that represent types and bear properties.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export abstract class Classifier extends Stereotyped {
  properties: Property[] | null;
  isAbstract: boolean | null;
  isDerived: boolean | null;

  constructor(
    type: string,
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    stereotypes?: string[],
    properties?: Property[],
    isAbstract?: boolean,
    isDerived?: boolean,
    container?: Package,
  ) {
    super(type, id, enableHash, name, description, stereotypes, container);
    this.properties = properties;
    this.isAbstract = isAbstract;
    this.isDerived = isDerived;

    // if (enableHash) {}
  }
}
