import { SORTAL, NON_SORTAL } from '@constants/stereotypes_constraints';
import OntoUMLRules from './rules/ontouml_rules';
import OntoUMLParser from '../ontouml_parser';

class OntoUMLSyntaxMethod {
  rules: OntoUMLRules;
  parser: OntoUMLParser;

  constructor(parser: OntoUMLParser) {
    this.rules = new OntoUMLRules(parser.getVersion());
    this.parser = parser;
  }

  getOntologyNatureClass(classId: string): IElement {
    const ultimateSortalStereotypesID = this.rules.getStereotypesID({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const nonSortalStereotypesID = this.rules.getStereotypesID({
      sortality: NON_SORTAL,
    });

    const classElement = this.parser.getClass(classId);
    const classStereotype = classElement.stereotypes[0];

    if (ultimateSortalStereotypesID.includes(classStereotype)) {
      return classElement;
    }

    if (nonSortalStereotypesID.includes(classStereotype)) {
      return this.getNonSortalOntologyNature(classElement);
    }

    return this.getSortalOntologyNature(classElement);
  }

  getNonSortalOntologyNature(classElement: IElement): IElement {
    const sortalChild = this.getSortalChild([classElement]);
    const ultimateElements = this.getUltimateSortalElements(sortalChild, []);

    return ultimateElements[0];
  }

  getSortalOntologyNature(classElement: IElement): IElement {
    const ultimateElements = this.getUltimateSortalElements(classElement, []);

    return ultimateElements[0];
  }

  getSortalChild(classElements: IElement[]): IElement {
    const sortalStereotypesID = this.rules.getStereotypesID({
      sortality: SORTAL,
    });
    const children = this.parser.getClassChildren(classElements[0].id);
    const sortalChildren = children.filter((child: IElement) =>
      sortalStereotypesID.includes(child.stereotypes[0]),
    );

    if (sortalChildren.length > 0) {
      return sortalChildren[0];
    }

    classElements.slice(0, 1);

    if (classElements.length > 0) {
      return this.getSortalChild(classElements);
    }

    children.splice(0, 1);

    return this.getSortalChild(children);
  }

  getUltimateSortalElements(
    classElement: IElement,
    ultimateElements: IElement[],
  ): IElement[] {
    const ultimateSortalStereotypesID = this.rules.getStereotypesID({
      sortality: SORTAL,
      ultimateSortal: true,
    });
    const parents = this.parser.getClassParents(classElement.id);

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

  getRelationSource(relationId: string): IElement {
    const sourceProperty = this.parser.getRelationSourceProperty(relationId);

    return (
      this.parser.getClass(sourceProperty.propertyType) ||
      this.parser.getRelation(sourceProperty.propertyType)
    );
  }

  getRelationTarget(relationId: string): IElement {
    const targetProperty = this.parser.getRelationTargetProperty(relationId);

    return (
      this.parser.getClass(targetProperty.propertyType) ||
      this.parser.getRelation(targetProperty.propertyType)
    );
  }
}

export default OntoUMLSyntaxMethod;
