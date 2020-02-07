import schemas from 'ontouml-schema';
import Ajv from 'ajv';
import memoizee from 'memoizee';
import { OntoUMLType } from '@constants/.';
import {
  IPackage,
  IElement,
  IProperty,
  IGeneralizationSet,
  IGeneralization,
  IRelation,
  IClass,
  IContainer,
  IClassifier,
} from '@types';
import functions from '@libs/model/functions';

/**
 * Utility class for the manipulation of models in OntoUML2 in conformance to the `ontouml-schema` definition.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 *
 * @todo Create function to access this.sourceElements that throws an exception when the element is not found.
 */
export class ModelManager {
  model: any;
  sourceElements: any;
  createdElements: any;

  constructor(model: any) {
    let validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
    let isValid = validator(model);

    console.log('Checking validity');

    // if (!isValid) {
    //   throw {
    //     message: 'Invalid model input.',
    //     errors: validator.errors,
    //   };
    // }

    // Enabling memoization
    console.log('Enabling memoization.');
    this.model = model;
    this.sourceElements = {};
    this.createdElements = {};
    this.getElements = memoizee(this.getElements);
    this.getElementById = memoizee(this.getElementById);

    // Creating elements
    this.getElements().forEach(sourceElement => {
      // console.log(
      //   `Source - ${sourceElement.type} - ${sourceElement.name} - contianer: "${sourceElement.container}"`,
      // );

      this.sourceElements[sourceElement.id] = sourceElement;
      this.createdElements[sourceElement.id] = this.createIElement(
        sourceElement,
        true,
      );
    });

    // Resolving references
    Object.values(this.createdElements).forEach((createdElement: IElement) => {
      this.resolveIElement(createdElement);
    });
  }

  /**
   * Function that returns an array of contained IElement objects.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IElement objects contained within the model or the package parameter.
   */
  getElements(current?: any): any[] {
    current = current ? current : this.model;
    current.container = null;

    let elements = current.elements || [];

    elements.forEach(element => {
      if (element.type === OntoUMLType.PACKAGE_TYPE) {
        elements = [...elements, ...this.getElements(element)];
      } else if (element.type === OntoUMLType.CLASS_TYPE) {
        elements = [
          ...elements,
          ...(element.properties ? element.properties : []),
        ];
      }

      element.container = current.id;
    });

    return elements;
  }

  /**
   * Returns an IElement according to its id.
   *
   * @param elementId - Desired element's id.
   */
  getElementById(elementId: string): any {
    return this.getElements().find(element => element.id === elementId);
  }

  /**
   * Returns an IElement with PENDING references
   *
   * @param source - element serialized according to `ontouml-schema`.
   */
  createIElement(source: any, enableMemoization = false): IElement {
    let element: any = {};

    // Checks for IElement
    if (
      [
        OntoUMLType.PACKAGE_TYPE,
        OntoUMLType.CLASS_TYPE,
        OntoUMLType.RELATION_TYPE,
        OntoUMLType.PROPERTY_TYPE,
        OntoUMLType.GENERALIZATION_TYPE,
        OntoUMLType.GENERALIZATION_SET_TYPE,
      ].includes(source.type)
    ) {
      element.type = source.type;
      element.id = source.id;
      element.name = source.name;
      element.description = source.description ? source.description : null;
      element.propertyAssignments = null;
      element.container = null;
      element = { ...element, ...functions.IElement_functions };
    } else {
      throw {
        name: 'Trying to create an IElement out of a non-recongnized source.',
        error: source,
      };
    }

    // Checks for IContainer
    if (
      [
        OntoUMLType.PACKAGE_TYPE,
        OntoUMLType.CLASS_TYPE,
        OntoUMLType.RELATION_TYPE,
      ].includes(source.type)
    ) {
      element = { ...element, ...functions.IContainer_functions };
    }

    // Checks for IDecoratable
    if (
      [
        OntoUMLType.CLASS_TYPE,
        OntoUMLType.RELATION_TYPE,
        OntoUMLType.PROPERTY_TYPE,
      ].includes(source.type)
    ) {
      element.stereotypes = source.stereotypes;
    }

    // Checks for IClassifier
    if (
      [OntoUMLType.CLASS_TYPE, OntoUMLType.RELATION_TYPE].includes(source.type)
    ) {
      element.properties = source.properties;
      element.isAbstract = source.isAbstract;
      element.isDerived = source.isDerived;
      element = { ...element, ...functions.IClassifier_functions };
    }

    // Checks for remaining interfaces
    switch (source.type) {
      case OntoUMLType.PACKAGE_TYPE:
        element.elements = null;
        return element as IPackage;

      case OntoUMLType.CLASS_TYPE:
        return element as IClass;

      case OntoUMLType.RELATION_TYPE:
        return element as IRelation;

      case OntoUMLType.GENERALIZATION_TYPE:
        element.general = null;
        element.specific = null;
        return element as IGeneralization;

      case OntoUMLType.GENERALIZATION_SET_TYPE:
        element.isDisjoint = source.isDisjoint;
        element.isComplete = source.isComplete;
        element.categorizer = null;
        element.generalizations = null;
        return element as IGeneralizationSet;

      case OntoUMLType.PROPERTY_TYPE:
        element.cardinality = source.cardinality;
        element.aggregationKind = source.aggregationKind;
        element.isDerived = source.isDerived;
        element.isOrdered = source.isOrdered;
        element.isReadOnly = source.isReadOnly;
        element.propertyType = null;
        element.subsettedProperties = null;
        element.redefinedProperties = null;
        return element as IProperty;
    }

    return null;
  }

  /**
   * Resolves pending references of created IElement.
   *
   * @param generatedElement - IElement with PENDING references
   */
  resolveIElement(generatedElement: IElement): void {
    const sourceElement: any = this.sourceElements[generatedElement.id];

    // Checks for IElement
    if (
      [
        OntoUMLType.PACKAGE_TYPE,
        OntoUMLType.CLASS_TYPE,
        OntoUMLType.RELATION_TYPE,
        OntoUMLType.PROPERTY_TYPE,
        OntoUMLType.GENERALIZATION_TYPE,
        OntoUMLType.GENERALIZATION_SET_TYPE,
      ].includes(generatedElement.type)
    ) {
      (generatedElement as IElement).container = this.createdElements[
        sourceElement.container
      ] as IContainer;
    }

    // Checks for IClassifier
    if (
      [OntoUMLType.CLASS_TYPE, OntoUMLType.RELATION_TYPE].includes(
        generatedElement.type,
      ) &&
      sourceElement.elements
    ) {
      sourceElement.elements.forEach(
        item =>
          ((generatedElement as IClassifier).properties = [
            ...(generatedElement as IClassifier).properties,
            this.createdElements[item.id],
          ]),
      );
    }

    // Checks for remaining interfaces
    switch (generatedElement.type) {
      case OntoUMLType.PACKAGE_TYPE:
        if (sourceElement.elements && (generatedElement as IPackage).elements) {
          sourceElement.elements.forEach(
            item =>
              ((generatedElement as IPackage).elements = [
                ...(generatedElement as IPackage).elements,
                this.createdElements[item.id],
              ]),
          );
        }
        break;

      case OntoUMLType.CLASS_TYPE:
        break;

      case OntoUMLType.RELATION_TYPE:
        break;

      case OntoUMLType.GENERALIZATION_TYPE:
        (generatedElement as IGeneralization).general = this.createdElements[
          sourceElement.general.id
        ] as IClassifier;
        (generatedElement as IGeneralization).specific = this.createdElements[
          sourceElement.specific.id
        ] as IClassifier;
        break;

      case OntoUMLType.GENERALIZATION_SET_TYPE:
        (generatedElement as IGeneralizationSet).categorizer = this
          .createdElements[sourceElement.categorizer.id] as IClass;
        sourceElement.generalizations.forEach(
          item =>
            ((generatedElement as IGeneralizationSet).generalizations = [
              ...(generatedElement as IGeneralizationSet).generalizations,
              this.createdElements[item.id],
            ]),
        );
        break;

      case OntoUMLType.PROPERTY_TYPE:
        (generatedElement as IProperty).propertyType = this.createdElements[
          sourceElement.propertyType.id
        ] as IClassifier;
        sourceElement.subsettedProperties.forEach(
          item =>
            ((generatedElement as IProperty).subsettedProperties = [
              ...(generatedElement as IProperty).subsettedProperties,
              this.createdElements[item.id],
            ]),
        );
        sourceElement.redefinedProperties.forEach(
          item =>
            ((generatedElement as IProperty).redefinedProperties = [
              ...(generatedElement as IProperty).redefinedProperties,
              this.createdElements[item.id],
            ]),
        );
        break;
    }

    return null;
  }
}
