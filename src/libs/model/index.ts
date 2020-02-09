import Ajv from 'ajv';
import memoizee from 'memoizee';
import { OntoUMLType } from '@constants/.';
import {
  IPackage,
  IElement,
  IRelation,
  IClass,
  IReference,
  IProperty,
  ILiteral,
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
  rootPackage: IPackage;
  allElements: { [key: string]: IElement };

  constructor(model: IPackage) {
    // const validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
    const schema = require('@schemas/versions/ontouml-v1.0.schema');
    const validator = new Ajv().compile(schema);
    const isValid = validator(model);

    // console.log('Checking validity');

    if (!isValid) {
      throw {
        message: 'Invalid model input.',
        errors: validator.errors,
      };
    }

    // Enabling memoization
    // console.log('Enabling general memoization.');
    this.rootPackage = model;
    this.allElements = {};
    this.getElements = memoizee(this.getElements);
    this.getElementById = memoizee(this.getElementById);

    // Creating elements
    // console.log('Creating elements.');
    this.getElements().forEach((element: IElement) => {
      this.allElements[element.id] = element;
      this.checkAndInjectFunctions(element);
    });

    // Resolving references
    // console.log('Resolving references.');
    this.getElements().forEach((element: IElement) => {
      this.replaceReferences(element);
    });
  }

  /**
   * Function that returns an array of contained IElement objects and updates the container IReference of all elements along the way.
   */
  getElements(current?: IPackage): IElement[] {
    let contents: IElement[];

    if (!current) {
      current = this.rootPackage;
      contents = [current, ...(current.contents ? current.contents : [])];
    } else {
      contents = [...(current.contents ? current.contents : [])];
    }

    current.container = null;

    if (!current.contents) {
      return [];
    }

    current.contents.forEach((element: IElement) => {
      if (element.type === OntoUMLType.PACKAGE_TYPE) {
        contents = [...contents, ...this.getElements(element as IPackage)];
      } else if (element.type === OntoUMLType.RELATION_TYPE) {
        const relation = element as IRelation;

        if (relation.properties) {
          relation.properties.forEach(
            (property: IProperty) => (property.container = relation),
          );
        }
        contents = [
          ...contents,
          ...(relation.properties ? relation.properties : []),
        ];
      } else if (element.type === OntoUMLType.CLASS_TYPE) {
        const _class = element as IClass;

        if (_class.properties) {
          _class.properties.forEach(
            (property: IProperty) => (property.container = _class),
          );
        }
        if (_class.literals) {
          _class.literals.forEach(
            (literal: ILiteral) => (literal.container = _class),
          );
        }
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
    return this.getElements().find(
      (element: IElement) => element.id === elementId,
    );
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

  checkAndInjectFunctions(element: IElement, enableMemoization = true): void {
    this.injectFunctions(
      element,
      functions.IElement_functions,
      enableMemoization,
    );

    if (element.hasIContainerType()) {
      this.injectFunctions(
        element,
        functions.IContainer_functions,
        enableMemoization,
      );
    }

    if (element.hasIClassifierType()) {
      this.injectFunctions(
        element,
        functions.IClassifier_functions,
        enableMemoization,
      );
    }
  }

  injectFunctions(
    element: IElement,
    functionImplementations: any,
    enableMemoization = true,
  ): void {
    Object.keys(functionImplementations).forEach((functionName: string) => {
      element[functionName] = enableMemoization
        ? memoizee(functionImplementations[functionName])
        : functionImplementations[functionName];
    });
  }

  ejectFunctions(element: IElement): void {
    Object.keys(element).forEach((elementKey: string) => {
      if (element[elementKey] instanceof Function) {
        delete element[elementKey];
      }
    });
  }

  replaceReferences(element: IElement): void {
    Object.keys(element).forEach((elementKey: string) => {
      element[elementKey] = this.resolveReference(element[elementKey]);
    });
  }

  resolveReference(reference: IReference | IReference[]): any {
    if (Array.isArray(reference)) {
      return (reference as IReference[]).map((reference: IReference) => {
        return this.resolveReference(reference);
      });
    } else if (reference instanceof Object) {
      const keys = Object.keys(reference);
      if (keys.length === 2 && keys.includes('type') && keys.includes('id')) {
        return this.getElementByReference(reference as IReference);
      }
    }

    return reference;
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
}
