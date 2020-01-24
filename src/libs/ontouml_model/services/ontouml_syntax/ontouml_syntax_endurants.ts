import {
  OntoUMLStereotypeError,
  OntoUMLSpecializationError,
} from '@error/ontouml_syntax';
import { SORTAL, NON_SORTAL } from '@constants/stereotypes_constraints';
import OntoUMLParser from '../ontouml_parser';
import OntoUMLSyntaxMethod from './ontouml_syntax_method';

class OntoUMLSyntaxEndurants extends OntoUMLSyntaxMethod {
  private errors: IOntoUMLError[];

  constructor(parser: OntoUMLParser) {
    super(parser);

    this.errors = [];
  }

  async verifyEndurantTypes(): Promise<IOntoUMLError[]> {
    const classes = this.parser.getClasses();

    await Promise.all([
      this.verifyClassStereotypes(classes),
      this.verifyClasses(classes),
    ]);

    return this.errors;
  }

  async verifyClassStereotypes(elements: IElement[]) {
    const stereotypes = this.rules.getStereotypesID();

    const invalidElements = elements.filter(
      (element: IElement) =>
        !element.stereotypes ||
        !stereotypes.includes(element.stereotypes[0]) ||
        element.stereotypes.length !== 1,
    );
    const hasInvalidElements = invalidElements.length > 0;

    if (hasInvalidElements) {
      for (let i = 0; i < invalidElements.length; i += 1) {
        this.errors.push(new OntoUMLStereotypeError(invalidElements[i]));
      }
    }

    return true;
  }

  async verifyClasses(classes: IElement[]) {
    const sortalStereotypesID = this.rules.getStereotypesID({
      sortality: SORTAL,
      ultimateSortal: false,
    });

    const nonSortalStereotypesID = this.rules.getStereotypesID({
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
    const parents = this.parser.getClassParents(id);
    const stereotype = stereotypes[0];

    for (let i = 0; i < parents.length; i += 1) {
      const parentElement = parents[i];
      const parentStereotype = parentElement.stereotypes[0];
      const hasValidSpecialization = this.rules.isValidSpecialization(
        stereotype,
        parentStereotype,
      );

      if (!hasValidSpecialization) {
        const elementName = classElement.name || classElement.id;
        const parentName = parentElement.name || parentElement.id;
        const elementStereotypeName = this.rules.getStereotypeNameByID(
          classElement.stereotypes[0],
        );
        const parentStereotypeName = this.rules.getStereotypeNameByID(
          parentElement.stereotypes[0],
        );

        const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} can not specialize "${parentName}" of stereotype ${parentStereotypeName}.`;

        this.errors.push(
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
    const elementStereotypeName = this.rules.getStereotypeNameByID(
      classElement.stereotypes[0],
    );

    if (hasNoSortal) {
      const errorDetail = `Must be a sortal S that specializes "${elementName}" of stereotype ${elementStereotypeName}, or specializes a non-sortal supertype common to both "${elementName}" and S.
      )}`;

      this.errors.push(
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
    const sortalStereotypesID = this.rules.getStereotypesID({
      sortality: SORTAL,
    });
    const children = this.parser.getClassChildren(classElement.id);

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
    const ultimateSortalStereotypesName = this.rules.getStereotypesName({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const elementName = classElement.name || classElement.id;
    const elementStereotypeName = this.rules.getStereotypeNameByID(
      classElement.stereotypes[0],
    );

    if (ultimateElements.length === 0) {
      const errorDetail = `Class "${elementName}" of stereotype ${elementStereotypeName} must specialialize an ultimate sortal of stereotype ${ultimateSortalStereotypesName.join(
        ' or ',
      )}.`;

      this.errors.push(
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

      this.errors.push(
        new OntoUMLSpecializationError(errorDetail, {
          element: classElement,
          ultimateElements,
        }),
      );
    }

    return true;
  }
}

export default OntoUMLSyntaxEndurants;
