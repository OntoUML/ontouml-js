import {
  OntoUMLStereotypeError,
  OntoUMLRelationError,
} from '@error/ontouml_syntax';
import OntoUMLRules from '@rules/ontouml_rules';
import OntoUMLParser from '../ontouml_parser';

class OntoUMLSyntaxRelations {
  private _rules: OntoUMLRules;
  private _parser: OntoUMLParser;
  private _errors: IOntoUMLError[];

  constructor(parser: OntoUMLParser) {
    this._rules = new OntoUMLRules(parser.getVersion());
    this._parser = parser;
    this._errors = [];
  }

  async verifyRelationTypes(): Promise<IOntoUMLError[]> {
    const relations = this._parser.getRelations();

    await Promise.all([
      this.verifyRelationStereotypes(relations),
      this.verifyRelations(relations),
    ]);

    return this._errors;
  }

  async verifyRelationStereotypes(structuralElements: IStructuralElement[]) {
    const stereotypes = this._rules.getRelationStereotypesURI();

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

  async verifyRelations(relations: IStructuralElement[]) {
    try {
      const promises = [];

      for (let i = 0; i < relations.length; i += 1) {
        const relation = relations[i];

        promises.push(this.verifyRelationConnections(relation));
      }

      await Promise.all(promises);
    } catch (error) {
      // ignore
      console.log(error);
    }

    return true;
  }

  async verifyRelationConnections(relation: IStructuralElement) {
    const sourceClassUri = this._parser.getRelationSourceClassURI(relation.uri);
    const sourceClass = this._parser.getClass(sourceClassUri);
    const sourceStereotypeUri = sourceClass.stereotypes[0];
    const targetClassUri = this._parser.getRelationTargetClassURI(relation.uri);
    const targetClass = this._parser.getClass(targetClassUri);
    const targetStereotypeUri = targetClass.stereotypes[0];

    const isValidRelation = this._rules.isValidRelation(
      sourceStereotypeUri,
      targetStereotypeUri,
      relation.stereotypes[0],
    );

    if (isValidRelation) {
      await this.verifyRelationMultiplicities(relation);
    } else {
      const relationName = this._rules.getRelationNameByURI(
        relation.stereotypes[0],
      );
      const sourceClassName = sourceClass.name || sourceClass.uri;
      const sourceStereotypeName = this._rules.getStereotypeNameByURI(
        sourceStereotypeUri,
      );
      const targetClassName = targetClass.name || targetClass.uri;
      const targetStereotypeName = this._rules.getStereotypeNameByURI(
        targetStereotypeUri,
      );

      const errorDetail = `${sourceClass['@type']} "${sourceClassName}" of stereotype ${sourceStereotypeName} cannot have a ${relationName} relation with ${targetClass['@type']} "${targetClassName}" of stereotype ${targetStereotypeName}`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    return true;
  }

  async verifyRelationMultiplicities(relation: IStructuralElement) {
    const sourceProperty = this._parser.getRelationSourceProperty(relation.uri);
    const sourceClass = this._parser.getClass(sourceProperty.propertyType);
    const sourceName = sourceClass.name || sourceClass.uri;
    const targetProperty = this._parser.getRelationTargetProperty(relation.uri);
    const targetClass = this._parser.getClass(targetProperty.propertyType);
    const targetName = targetClass.name || targetClass.uri;
    const relationStereotype = this._rules.getRelationStereotype(
      relation.stereotypes[0],
    );

    const sourcePropertyLowerbound = this._rules.getRelationMultiplicityValue(
      sourceProperty.lowerbound,
    );
    const sourcePropertyUpperbound = this._rules.getRelationMultiplicityValue(
      sourceProperty.upperbound,
    );
    const relationSourceLowerbound = this._rules.getRelationMultiplicityValue(
      relationStereotype.source.lowerbound,
    );
    const relationSourceUpperbound = this._rules.getRelationMultiplicityValue(
      relationStereotype.source.upperbound,
    );
    const targetPropertyLowerbound = this._rules.getRelationMultiplicityValue(
      targetProperty.lowerbound,
    );
    const targetPropertyUpperbound = this._rules.getRelationMultiplicityValue(
      targetProperty.upperbound,
    );
    const relationTargetLowerbound = this._rules.getRelationMultiplicityValue(
      relationStereotype.target.lowerbound,
    );
    const relationTargetUpperbound = this._rules.getRelationMultiplicityValue(
      relationStereotype.target.upperbound,
    );

    if (sourcePropertyLowerbound < relationSourceLowerbound) {
      const errorDetail = `${relation['@type']} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the source lowebound bigger than ${relationStereotype.source.lowerbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (sourcePropertyUpperbound > relationSourceUpperbound) {
      const errorDetail = `${relation['@type']} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the source upperbound less than ${relationStereotype.source.upperbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (targetPropertyLowerbound < relationTargetLowerbound) {
      const errorDetail = `${relation['@type']} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the target lowebound bigger than ${relationStereotype.target.lowerbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (targetPropertyUpperbound > relationTargetUpperbound) {
      const errorDetail = `${relation['@type']} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the target upperbound less than ${relationStereotype.target.upperbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    return true;
  }
}

export default OntoUMLSyntaxRelations;
