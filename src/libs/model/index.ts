import Ajv from 'ajv';
import memoizee from 'memoizee';
import { OntoUMLType } from '@constants/.';
import { IPackage, IElement, IRelation, IClass, IReference } from '@types';
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
  model: IPackage;
  allElements: { [key: string]: IElement };

  constructor(model: IPackage) {
    // let validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
    const schema = require('@schemas/versions/ontouml-v1.0.schema');
    let validator = new Ajv().compile(schema);
    let isValid = validator(model);

    console.log('Checking validity');

    if (!isValid) {
      throw {
        message: 'Invalid model input.',
        errors: validator.errors,
      };
    }

    // Enabling memoization
    console.log('Enabling general memoization.');
    this.model = model;
    this.allElements = {};
    this.getElements = memoizee(this.getElements);
    this.getElementById = memoizee(this.getElementById);

    // Creating elements
    console.log('Creating elements.');
    this.getElements().forEach((element: IElement) => {
      this.allElements[element.id] = element;
      this.injectFunctions(element);
    });

    // Resolving references
    console.log('Resolving references.');
    this.getElements().forEach((element: IElement) => {
      this.replaceReferences(element);
    });
  }

  /**
   * Function that returns an array of contained IElement objects and updates the container IReference of all elements along the way.
   *
   * @param packageElement Optional package parameter that, when passed, makes the function return the elements contained within the package rather than the model itself.
   *
   * @returns Array of IElement objects contained within the model or the package parameter.
   */
  getElements(current?: IPackage): IElement[] {
    current = current ? current : this.model;
    current.container = null;

    if (!current.contents) {
      return [];
    }

    let contents = current.contents || [];

    current.contents.forEach((element: IElement) => {
      if (element.type === OntoUMLType.PACKAGE_TYPE) {
        contents = [...contents, ...this.getElements(element as IPackage)];
      } else if (element.type === OntoUMLType.RELATION_TYPE) {
        const relation = element as IRelation;

        contents = [
          ...contents,
          ...(relation.properties ? relation.properties : []),
        ];
      } else if (element.type === OntoUMLType.CLASS_TYPE) {
        const _class = element as IClass;

        contents = [
          ...contents,
          ...(_class.properties ? _class.properties : []),
          ...(_class.literals ? _class.literals : []),
        ];
      }

      element.container = { type: current.type, id: current.id };
    });

    return contents;
  }

  /**
   * Returns an IElement according to its id.
   *
   * @param elementId - Desired element's id.
   */
  getElementById(elementId: string): any {
    return this.getElements().find(element => element.id === elementId);
  }

  checkInstanceOfIContainer(element: IElement): boolean {
    return [
      OntoUMLType.PACKAGE_TYPE,
      OntoUMLType.CLASS_TYPE,
      OntoUMLType.RELATION_TYPE,
    ].includes(element.type);
  }

  checkInstanceOfIDecoratable(element: IElement): boolean {
    return [
      OntoUMLType.PROPERTY_TYPE,
      OntoUMLType.CLASS_TYPE,
      OntoUMLType.RELATION_TYPE,
    ].includes(element.type);
  }

  checkInstanceOfIClassifier(element: IElement): boolean {
    return [OntoUMLType.CLASS_TYPE, OntoUMLType.RELATION_TYPE].includes(
      element.type,
    );
  }

  injectFunctions(element: IElement): void {
    Object.keys(functions.IElement_functions).forEach(
      (functionName: string) => {
        element[functionName] = functions.IElement_functions[functionName];
      },
    );

    if (this.checkInstanceOfIContainer(element)) {
      Object.keys(functions.IContainer_functions).forEach(
        (functionName: string) => {
          element[functionName] = functions.IContainer_functions[functionName];
        },
      );
    }

    if (this.checkInstanceOfIClassifier(element)) {
      Object.keys(functions.IClassifier_functions).forEach(
        (functionName: string) => {
          element[functionName] = functions.IClassifier_functions[functionName];
        },
      );
    }
  }

  ejectFunctions(element: IElement): void {
    Object.keys(functions.IElement_functions).forEach(
      (functionName: string) => {
        element[functionName] = undefined;
      },
    );

    if (this.checkInstanceOfIContainer(element)) {
      Object.keys(functions.IContainer_functions).forEach(
        (functionName: string) => {
          element[functionName] = undefined;
        },
      );
    }

    if (this.checkInstanceOfIClassifier(element)) {
      Object.keys(functions.IClassifier_functions).forEach(
        (functionName: string) => {
          element[functionName] = undefined;
        },
      );
    }
  }

  replaceReferences(element: IElement): void {
    Object.keys(element).forEach((elementKey: string) => {
      if (JSON.stringify(Object.keys(element).sort()) === '["id","type"]') {
        element[elementKey] = this.getElementByReference(element[elementKey]);
      }
    });
  }

  getElementByReference(reference: IReference): IElement {
    const element: IElement = this.allElements[reference.id];

    if (!element || element.type !== reference.type) {
      throw {
        message: 'Bad reference.',
        reference: reference,
      };
    }

    return element;
  }

  // /**
  //  * Returns an IElement with PENDING references
  //  *
  //  * @param source - element serialized according to `ontouml-schema`.
  //  */
  // createIElement(source: any, enableMemoization = false): IElement {
  //   let element: any = {};

  //   // Checks for IElement
  //   if (
  //     [
  //       OntoUMLType.PACKAGE_TYPE,
  //       OntoUMLType.CLASS_TYPE,
  //       OntoUMLType.RELATION_TYPE,
  //       OntoUMLType.PROPERTY_TYPE,
  //       OntoUMLType.GENERALIZATION_TYPE,
  //       OntoUMLType.GENERALIZATION_SET_TYPE,
  //     ].includes(source.type)
  //   ) {
  //     element.type = source.type;
  //     element.id = source.id;
  //     element.name = source.name;
  //     element.description = source.description ? source.description : null;
  //     element.propertyAssignments = null;
  //     element.container = null;
  //     element = { ...element, ...functions.IElement_functions };
  //   } else {
  //     throw {
  //       name: 'Trying to create an IElement out of a non-recongnized source.',
  //       error: source,
  //     };
  //   }

  //   // Checks for IContainer
  //   if (
  //     [
  //       OntoUMLType.PACKAGE_TYPE,
  //       OntoUMLType.CLASS_TYPE,
  //       OntoUMLType.RELATION_TYPE,
  //     ].includes(source.type)
  //   ) {
  //     element = { ...element, ...functions.IContainer_functions };
  //   }

  //   // Checks for IDecoratable
  //   if (
  //     [
  //       OntoUMLType.CLASS_TYPE,
  //       OntoUMLType.RELATION_TYPE,
  //       OntoUMLType.PROPERTY_TYPE,
  //     ].includes(source.type)
  //   ) {
  //     element.stereotypes = source.stereotypes;
  //   }

  //   // Checks for IClassifier
  //   if (
  //     [OntoUMLType.CLASS_TYPE, OntoUMLType.RELATION_TYPE].includes(source.type)
  //   ) {
  //     element.properties = source.properties;
  //     element.isAbstract = source.isAbstract;
  //     element.isDerived = source.isDerived;
  //     element = { ...element, ...functions.IClassifier_functions };
  //   }

  //   // Checks for remaining interfaces
  //   switch (source.type) {
  //     case OntoUMLType.PACKAGE_TYPE:
  //       element.elements = null;
  //       return element as IPackage;

  //     case OntoUMLType.CLASS_TYPE:
  //       return element as IClass;

  //     case OntoUMLType.RELATION_TYPE:
  //       return element as IRelation;

  //     case OntoUMLType.GENERALIZATION_TYPE:
  //       element.general = null;
  //       element.specific = null;
  //       return element as IGeneralization;

  //     case OntoUMLType.GENERALIZATION_SET_TYPE:
  //       element.isDisjoint = source.isDisjoint;
  //       element.isComplete = source.isComplete;
  //       element.categorizer = null;
  //       element.generalizations = null;
  //       return element as IGeneralizationSet;

  //     case OntoUMLType.PROPERTY_TYPE:
  //       element.cardinality = source.cardinality;
  //       element.aggregationKind = source.aggregationKind;
  //       element.isDerived = source.isDerived;
  //       element.isOrdered = source.isOrdered;
  //       element.isReadOnly = source.isReadOnly;
  //       element.propertyType = null;
  //       element.subsettedProperties = null;
  //       element.redefinedProperties = null;
  //       return element as IProperty;
  //   }

  //   return null;
  // }

  // /**
  //  * Resolves pending references of created IElement.
  //  *
  //  * @param generatedElement - IElement with PENDING references
  //  */
  // resolveIElement(generatedElement: IElement): void {
  //   const sourceElement: any = this.sourceElements[generatedElement.id];

  //   // Checks for IElement
  //   if (
  //     [
  //       OntoUMLType.PACKAGE_TYPE,
  //       OntoUMLType.CLASS_TYPE,
  //       OntoUMLType.RELATION_TYPE,
  //       OntoUMLType.PROPERTY_TYPE,
  //       OntoUMLType.GENERALIZATION_TYPE,
  //       OntoUMLType.GENERALIZATION_SET_TYPE,
  //     ].includes(generatedElement.type)
  //   ) {
  //     (generatedElement as IElement).container = this.createdElements[
  //       sourceElement.container
  //     ] as IContainer;
  //   }

  //   // Checks for IClassifier
  //   if (
  //     [OntoUMLType.CLASS_TYPE, OntoUMLType.RELATION_TYPE].includes(
  //       generatedElement.type,
  //     ) &&
  //     sourceElement.elements
  //   ) {
  //     sourceElement.elements.forEach(
  //       item =>
  //         ((generatedElement as IClassifier).properties = [
  //           ...(generatedElement as IClassifier).properties,
  //           this.createdElements[item.id],
  //         ]),
  //     );
  //   }

  //   // Checks for remaining interfaces
  //   switch (generatedElement.type) {
  //     case OntoUMLType.PACKAGE_TYPE:
  //       if (sourceElement.elements && (generatedElement as IPackage).contents) {
  //         sourceElement.elements.forEach(
  //           item =>
  //             ((generatedElement as IPackage).contents = [
  //               ...(generatedElement as IPackage).contents,
  //               this.createdElements[item.id],
  //             ]),
  //         );
  //       }
  //       break;

  //     case OntoUMLType.CLASS_TYPE:
  //       break;

  //     case OntoUMLType.RELATION_TYPE:
  //       break;

  //     case OntoUMLType.GENERALIZATION_TYPE:
  //       (generatedElement as IGeneralization).general = this.createdElements[
  //         sourceElement.general.id
  //       ] as IClassifier;
  //       (generatedElement as IGeneralization).specific = this.createdElements[
  //         sourceElement.specific.id
  //       ] as IClassifier;
  //       break;

  //     case OntoUMLType.GENERALIZATION_SET_TYPE:
  //       (generatedElement as IGeneralizationSet).categorizer = this
  //         .createdElements[sourceElement.categorizer.id] as IClass;
  //       sourceElement.generalizations.forEach(
  //         item =>
  //           ((generatedElement as IGeneralizationSet).generalizations = [
  //             ...(generatedElement as IGeneralizationSet).generalizations,
  //             this.createdElements[item.id],
  //           ]),
  //       );
  //       break;

  //     case OntoUMLType.PROPERTY_TYPE:
  //       (generatedElement as IProperty).propertyType = this.createdElements[
  //         sourceElement.propertyType.id
  //       ] as IClassifier;
  //       if (sourceElement.subsettedProperties) {
  //         sourceElement.subsettedProperties.forEach(
  //           item =>
  //             ((generatedElement as IProperty).subsettedProperties = [
  //               ...(generatedElement as IProperty).subsettedProperties,
  //               this.createdElements[item.id],
  //             ]),
  //         );
  //       }
  //       if (sourceElement.redefinedProperties) {
  //         sourceElement.redefinedProperties.forEach(
  //           item =>
  //             ((generatedElement as IProperty).redefinedProperties = [
  //               ...(generatedElement as IProperty).redefinedProperties,
  //               this.createdElements[item.id],
  //             ]),
  //         );
  //       }
  //       break;
  //   }

  //   return null;
  // }
}
