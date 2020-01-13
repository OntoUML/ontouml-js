import {
  OntoUMLStereotypeError,
  OntoUMLSpecializationError,
} from '@error/ontouml_syntax';
import { SORTAL, NON_SORTAL } from '@constants/stereotypes_constraints';
import OntoUMLRules from '@rules/ontouml_rules';
import OntoUMLParser from '../ontouml_parser';

class OntoUMLSyntaxEndurants {
  private _rules: OntoUMLRules;
  private _parser: OntoUMLParser;
  private _errors: IOntoUMLError[];

  constructor(parser: OntoUMLParser) {
    this._rules = new OntoUMLRules(parser.getVersion());
    this._parser = parser;
    this._errors = [];
  }

  async verifyEndurantTypes(): Promise<IOntoUMLError[]> {
    const classes = this._parser.getClasses();

    await Promise.all([
      this.verifyStereotypes(classes),
      this.verifyClasses(classes),
    ]);

    return this._errors;
  }

  async verifyStereotypes(elements: IElement[]) {
    const stereotypes = this._rules.getStereotypesID();

    const invalidElements = elements.filter(
      (element: IElement) =>
        !element.stereotypes ||
        !stereotypes.includes(element.stereotypes[0]) ||
        element.stereotypes.length !== 1,
    );
    const hasInvalidElements = invalidElements.length > 0;

    if (hasInvalidElements) {
      for (let i = 0; i < invalidElements.length; i += 1) {
        this._errors.push(new OntoUMLStereotypeError(invalidElements[i]));
      }
    }

    return true;
  }

  async verifyClasses(classes: IElement[]) {
    const sortalStereotypesID = this._rules.getStereotypesID({
      sortality: SORTAL,
      ultimateSortal: false,
    });

    const nonSortalStereotypesID = this._rules.getStereotypesID({
      sortality: NON_SORTAL,
    });

    try {
      for (let i = 0; i < classes.length; i += 1) {
        const classElement = classes[i];
        const stereotype = classElement.stereotypes[0];

        await this.verifySpecializations(classElement);

        if (nonSortalStereotypesID.includes(stereotype)) {
          await this.verifyNonSortalSpecializations(classElement);
        }

        if (sortalStereotypesID.includes(stereotype)) {
          await this.verifySortalitySpecializations(classElement);
        }
      }
    } catch (error) {
      // ignore
    }

    return true;
  }

  async verifySpecializations(classElement: IElement) {
    const { stereotypes, id } = classElement;
    const parents = this._parser.getClassParents(id);
    const stereotype = stereotypes[0];

    for (let i = 0; i < parents.length; i += 1) {
      const parentElement = parents[i];
      const parentStereotype = parentElement.stereotypes[0];
      const hasValidSpecialization = this._rules.isValidSpecialization(
        stereotype,
        parentStereotype,
      );

      if (!hasValidSpecialization) {
        const elementName = classElement.name || classElement.id;
        const parentName = parentElement.name || parentElement.id;
        const elementStereotypeName = this._rules.getStereotypeNameByID(
          classElement.stereotypes[0],
        );
        const parentStereotypeName = this._rules.getStereotypeNameByID(
          parentElement.stereotypes[0],
        );

        const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} can not specialize "${parentName}" of stereotype ${parentStereotypeName}.`;

        this._errors.push(
          new OntoUMLSpecializationError(errorDetail, {
            element: classElement,
            parentElement,
          }),
        );
      }
    }

    return true;
  }

  // Given a non-sortal N, there must be a sortal S that specializes N, or specializes a non-sortal supertype common to both N and S.
  async verifyNonSortalSpecializations(classElement: IElement) {
    const sortalElements = this.getSortalElements(classElement, []);
    const hasNoSortal = sortalElements.length === 0;
    const elementName = classElement.name || classElement.id;
    const elementStereotypeName = this._rules.getStereotypeNameByID(
      classElement.stereotypes[0],
    );

    if (hasNoSortal) {
      const errorDetail = `Must be a sortal S that specializes "${elementName}" of stereotype ${elementStereotypeName}, or specializes a non-sortal supertype common to both "${elementName}" and S.
      )}`;

      this._errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          element: classElement,
        }),
      );
    }

    return true;
  }

  getSortalElements(
    classElement: IElement,
    sortalElements: IElement[],
  ): IElement[] {
    const sortalStereotypesID = this._rules.getStereotypesID({
      sortality: SORTAL,
    });
    const children = this._parser.getClassChildren(classElement.id);

    for (let i = 0; i < children.length; i += 1) {
      const childElement = children[i];
      const childStereotype = childElement.stereotypes[0];

      if (sortalStereotypesID.includes(childStereotype)) {
        sortalElements.push(childElement);
      } else {
        return [
          ...sortalElements,
          ...this.getSortalElements(childElement, sortalElements),
        ];
      }
    }

    return sortalElements;
  }

  // A Sortal element must specialize only 1 Ultimate Sortal element
  async verifySortalitySpecializations(classElement: IElement) {
    const ultimateElements = this.getUltimateSortalElements(classElement, []);
    const ultimateSortalStereotypesName = this._rules.getStereotypesName({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const elementName = classElement.name || classElement.id;
    const elementStereotypeName = this._rules.getStereotypeNameByID(
      classElement.stereotypes[0],
    );

    if (ultimateElements.length === 0) {
      const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} must specialialize an ultimate sortal of stereotype ${ultimateSortalStereotypesName.join(
        ' or ',
      )}.`;

      this._errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          element: classElement,
        }),
      );
    } else if (ultimateElements.length > 1) {
      const ultimateElementsName = ultimateElements.map(
        (ultimateElement: IElement) =>
          ultimateElement.name || ultimateElement.id,
      );
      const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} must specialialize only 1 ultimate sortal (${ultimateElementsName.join(
        ' or ',
      )}).`;

      this._errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          element: classElement,
          ultimateElements,
        }),
      );
    }

    return true;
  }

  getUltimateSortalElements(
    classElement: IElement,
    ultimateElements: IElement[],
  ): IElement[] {
    const ultimateSortalStereotypesID = this._rules.getStereotypesID({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const parents = this._parser.getClassParents(classElement.id);

    for (let i = 0; i < parents.length; i += 1) {
      const parentElement = parents[i];
      const parentStereotype = parentElement.stereotypes[0];

      if (ultimateSortalStereotypesID.includes(parentStereotype)) {
        ultimateElements.push(parentElement);
      } else {
        return [
          ...ultimateElements,
          ...this.getUltimateSortalElements(parentElement, ultimateElements),
        ];
      }
    }

    return ultimateElements;
  }
}

export default OntoUMLSyntaxEndurants;
