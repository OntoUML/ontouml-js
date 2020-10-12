import Ajv from 'ajv';
import memoizee from 'memoizee';
import { OntoumlType } from '@constants/.';
import {
  IPackage,
  IElement,
  IRelation,
  IClass,
  IReference,
  IProperty,
  ILiteral,
  IGeneralization,
  IClassifier,
  IGeneralizationSet
} from '@types';
import { inject } from '@libs/model/functions';
import schemas from 'ontouml-schema';

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
    const validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
    const isValid = validator(model);

    // Check input validity
    if (!isValid) {
      throw {
        message: 'Invalid model input.',
        errors: validator.errors
      };
    }

    // Enabling memoization
    this.rootPackage = model;
    this.allElements = {};
    this.getElements = memoizee(this.getElements);
    this.getElementById = memoizee(this.getElementById);

    // Creating elements
    this.getElements().forEach((element: IElement) => {
      this.allElements[element.id] = element;
      inject(element, true);
    });

    // Resolving references
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

    current._container = null;

    if (!current.contents) {
      return [];
    }

    current.contents.forEach((element: IElement) => {
      if (element.type === OntoumlType.PACKAGE_TYPE) {
        contents = [...contents, ...this.getElements(element as IPackage)];
      } else if (element.type === OntoumlType.RELATION_TYPE) {
        const relation = element as IRelation;

        if (relation.properties) {
          relation.properties.forEach((property: IProperty) => (property._container = relation));
        }
        contents = [...contents, ...(relation.properties ? relation.properties : [])];
      } else if (element.type === OntoumlType.CLASS_TYPE) {
        const _class = element as IClass;

        if (_class.properties) {
          _class.properties.forEach((property: IProperty) => (property._container = _class));
        }
        if (_class.literals) {
          _class.literals.forEach((literal: ILiteral) => (literal._container = _class));
        }
        contents = [...contents, ...(_class.properties ? _class.properties : []), ...(_class.literals ? _class.literals : [])];
      }

      element._container = { type: current.type, id: current.id };
    });

    return contents;
  }

  /**
   * Returns an IElement according to its id.
   *
   * @param elementId - Desired element's id.
   */
  getElementById(elementId: string): any {
    return this.getElements().find((element: IElement) => element.id === elementId);
  }

  replaceReferences(element: IElement): void {
    Object.keys(element).forEach((elementKey: string) => {
      element[elementKey] = this.resolveReference(element[elementKey]);
    });

    switch (element.type) {
      case OntoumlType.PACKAGE_TYPE:
        this.updateReadOnlyReferencesToIPackage(element as IPackage);
        break;
      case OntoumlType.CLASS_TYPE:
        this.updateReadOnlyReferencesToIClass(element as IClass);
        break;
      case OntoumlType.RELATION_TYPE:
        this.updateReadOnlyReferencesToIRelation(element as IRelation);
        break;
      case OntoumlType.GENERALIZATION_TYPE:
        this.updateReadOnlyReferencesToIGeneralization(element as IGeneralization);
        break;
      case OntoumlType.GENERALIZATION_SET_TYPE:
        this.updateReadOnlyReferencesToIGeneralizationSet(element as IGeneralizationSet);
        break;
      case OntoumlType.PROPERTY_TYPE:
        this.updateReadOnlyReferencesToIProperty(element as IProperty);
        break;
      case OntoumlType.LITERAL_TYPE:
        this.updateReadOnlyReferencesToILiteral(element as ILiteral);
        break;
    }
  }

  updateReadOnlyReferencesToIPackage(_package: IPackage): void {}

  updateReadOnlyReferencesToIClass(_class: IClass): void {}

  updateReadOnlyReferencesToIRelation(relation: IRelation): void {
    if (relation) {
    }
  }

  updateReadOnlyReferencesToIGeneralization(generalization: IGeneralization): void {
    const general = this.allElements[generalization.general.id] as IClassifier;
    const specific = this.allElements[generalization.specific.id] as IClassifier;

    general._specificOfGeneralizations = general._specificOfGeneralizations
      ? [...general._specificOfGeneralizations, generalization]
      : [generalization];
    specific._generalOfGeneralizations = specific._generalOfGeneralizations
      ? [...specific._generalOfGeneralizations, generalization]
      : [generalization];
  }

  updateReadOnlyReferencesToIGeneralizationSet(generalizationSet: IGeneralizationSet): void {
    if (generalizationSet.generalizations) {
      generalizationSet.generalizations.forEach((generalization: IGeneralization) => {
        generalization._memberOfGeneralizationSets = !generalization._memberOfGeneralizationSets
          ? []
          : [...generalization._memberOfGeneralizationSets, generalizationSet];
      });
    }

    if (generalizationSet.categorizer) {
      const categorizer = generalizationSet.categorizer as IClass;
      categorizer._categorizerOfGeneralizationSets = !categorizer._categorizerOfGeneralizationSets
        ? []
        : [...categorizer._categorizerOfGeneralizationSets, generalizationSet];
    }
  }

  updateReadOnlyReferencesToIProperty(property: IProperty): void {
    switch (property._container.type) {
      case OntoumlType.CLASS_TYPE:
        break;
      case OntoumlType.RELATION_TYPE:
        break;
    }

    // _typeOfAttributes
    // _sourceOfRelations
    // _targetOfRelations
    // _memberOfRelations
    // _subsettedPropertyOfProperties
    // _redefinedPropertyOfProperties
  }

  updateReadOnlyReferencesToILiteral(literal: ILiteral): void {
    if (literal) {
    }
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
        reference: reference
      };
    }

    return element;
  }
}
