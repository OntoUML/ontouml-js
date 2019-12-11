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
    this._rules = new OntoUMLRules('1.0');
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

  async verifyStereotypes(structuralElements: IStructuralElement[]) {
    const stereotypes = this._rules.getStereotypesURI();

    const invalidElements = structuralElements.filter(
      (structuralElement: IStructuralElement) =>
        !structuralElement.stereotypes ||
        !stereotypes.includes(structuralElement.stereotypes[0]) ||
        structuralElement.stereotypes.length !== 1,
    );
    const hasInvalidElements = invalidElements.length > 0;

    if (hasInvalidElements) {
      for (let i = 0; i < invalidElements.length; i += 1) {
        this._errors.push(new OntoUMLStereotypeError(invalidElements[i]));
      }
    }

    return true;
  }

  async verifyClasses(classes: IStructuralElement[]) {
    const sortalStereotypesURI = this._rules.getStereotypesURI({
      sortality: SORTAL,
      ultimateSortal: false,
    });

    const nonSortalStereotypesURI = this._rules.getStereotypesURI({
      sortality: NON_SORTAL,
    });

    try {
      for (let i = 0; i < classes.length; i += 1) {
        const classElement = classes[i];
        const stereotype = classElement.stereotypes[0];

        await this.verifySpecializations(classElement);

        if (nonSortalStereotypesURI.includes(stereotype)) {
          await this.verifyNonSortalSpecializations(classElement);
        }

        if (sortalStereotypesURI.includes(stereotype)) {
          await this.verifySortalitySpecializations(classElement);
        }
      }
    } catch (error) {
      // ignore
    }

    return true;
  }

  async verifySpecializations(classElement: IStructuralElement) {
    const { stereotypes, uri } = classElement;
    const parents = this._parser.getClassParents(uri);
    const stereotype = stereotypes[0];

    for (let i = 0; i < parents.length; i += 1) {
      const parentElement = parents[i];
      const parentStereotype = parentElement.stereotypes[0];
      const hasValidSpecialization = this._rules.isValidSpecialization(
        stereotype,
        parentStereotype,
      );

      if (!hasValidSpecialization) {
        const elementName = classElement.name || classElement.uri;
        const parentName = parentElement.name || parentElement.uri;
        const elementStereotypeName = this._rules.getStereotypeNameByURI(
          classElement.stereotypes[0],
        );
        const parentStereotypeName = this._rules.getStereotypeNameByURI(
          parentElement.stereotypes[0],
        );

        const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} can not specialize "${parentName}" of stereotype ${parentStereotypeName}.`;

        this._errors.push(
          new OntoUMLSpecializationError(errorDetail, {
            structuralElement: classElement,
            parentElement,
          }),
        );
      }
    }

    return true;
  }

  // Given a non-sortal N, there must be a sortal S that specializes N, or specializes a non-sortal supertype common to both N and S.
  async verifyNonSortalSpecializations(classElement: IStructuralElement) {
    const sortalElements = this.getSortalElements(classElement, []);
    const hasNoSortal = sortalElements.length === 0;
    const elementName = classElement.name || classElement.uri;
    const elementStereotypeName = this._rules.getStereotypeNameByURI(
      classElement.stereotypes[0],
    );

    if (hasNoSortal) {
      const errorDetail = `Must be a sortal S that specializes "${elementName}" of stereotype ${elementStereotypeName}, or specializes a non-sortal supertype common to both "${elementName}" and S.
      )}`;

      this._errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          structuralElement: classElement,
        }),
      );
    }

    return true;
  }

  getSortalElements(
    classElement: IStructuralElement,
    sortalElements: IStructuralElement[],
  ): IStructuralElement[] {
    const sortalStereotypesURI = this._rules.getStereotypesURI({
      sortality: SORTAL,
    });
    const children = this._parser.getClassChildren(classElement.uri);

    for (let i = 0; i < children.length; i += 1) {
      const childElement = children[i];
      const childStereotype = childElement.stereotypes[0];

      if (sortalStereotypesURI.includes(childStereotype)) {
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
  async verifySortalitySpecializations(classElement: IStructuralElement) {
    const ultimateElements = this.getUltimateSortalElements(classElement, []);
    const ultimateSortalStereotypesName = this._rules.getStereotypesName({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const elementName = classElement.name || classElement.uri;
    const elementStereotypeName = this._rules.getStereotypeNameByURI(
      classElement.stereotypes[0],
    );

    if (ultimateElements.length === 0) {
      const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} must specialialize an ultimate sortal of stereotype ${ultimateSortalStereotypesName.join(
        ' or ',
      )}.`;

      this._errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          structuralElement: classElement,
        }),
      );
    } else if (ultimateElements.length > 1) {
      const ultimateElementsName = ultimateElements.map(
        (ultimateElement: IStructuralElement) =>
          ultimateElement.name || ultimateElement.uri,
      );
      const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} must specialialize only 1 ultimate sortal (${ultimateElementsName.join(
        ' or ',
      )}).`;

      this._errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          structuralElement: classElement,
          ultimateElements,
        }),
      );
    }

    return true;
  }

  getUltimateSortalElements(
    classElement: IStructuralElement,
    ultimateElements: IStructuralElement[],
  ): IStructuralElement[] {
    const ultimateSortalStereotypesURI = this._rules.getStereotypesURI({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const parents = this._parser.getClassParents(classElement.uri);

    for (let i = 0; i < parents.length; i += 1) {
      const parentElement = parents[i];
      const parentStereotype = parentElement.stereotypes[0];

      if (ultimateSortalStereotypesURI.includes(parentStereotype)) {
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
