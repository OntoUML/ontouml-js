import {
  OntoUMLStereotypeError,
  OntoUMLRelationError,
} from '@error/ontouml_syntax';
import OntoUMLRules from '@rules/ontouml_rules';
import OntoUMLParser from '../ontouml_parser';
import { CLASS_TYPE } from '@constants/model_types';

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
    const promises = [];

    for (let i = 0; i < relations.length; i += 1) {
      const relation = relations[i];

      promises.push(this.verifyRelationConnections(relation));
    }

    await Promise.all(promises);

    return true;
  }

  async verifyRelationConnections(relation: IStructuralElement) {
    try {
      const sourceUri = this._parser.getRelationSourceClassURI(relation.uri);
      const source =
        this._parser.getClass(sourceUri) || this._parser.getRelation(sourceUri);
      const sourceStereotypeUri = source.stereotypes[0];
      const targetUri = this._parser.getRelationTargetClassURI(relation.uri);
      const target =
        this._parser.getClass(targetUri) || this._parser.getRelation(targetUri);
      const targetStereotypeUri = target.stereotypes[0];

      const isValidRelation = this._rules.isValidRelation(
        sourceStereotypeUri,
        targetStereotypeUri,
        relation.stereotypes[0],
      );

      if (isValidRelation) {
        await this.verifyRelationCardinalities(relation);
      } else {
        const relationName = this._rules.getRelationNameByURI(
          relation.stereotypes[0],
        );
        const sourceName = source.name || source.uri;
        const sourceStereotypeName = this._rules.getStereotypeNameByURI(
          sourceStereotypeUri,
        );
        const targetName = target.name || target.uri;
        const targetStereotypeName =
          target['@type'] === CLASS_TYPE
            ? this._rules.getStereotypeNameByURI(targetStereotypeUri)
            : this._rules.getRelationNameByURI(targetStereotypeUri);

        let errorDetail = `${target['@type']} ${source['@type']} "${sourceName}" of stereotype ${sourceStereotypeName} cannot have a ${relationName} relation with ${target['@type']} "${targetName}" of stereotype ${targetStereotypeName}`;

        if (this._rules.isDerivationRelation(relation.stereotypes[0])) {
          errorDetail = `"${targetName}" must be the source of ${relationName} relation between ${source['@type']} "${sourceName}" and ${target['@type']} "${targetName}"`;
        }

        await this._errors.push(
          new OntoUMLRelationError(errorDetail, {
            relation,
          }),
        );
      }
    } catch (error) {
      // ignore
      console.log(error);
    }

    return true;
  }

  async verifyRelationCardinalities(relation: IStructuralElement) {
    const sourceProperty = this._parser.getRelationSourceProperty(relation.uri);
    const source =
      this._parser.getClass(sourceProperty.propertyType) ||
      this._parser.getRelation(sourceProperty.propertyType);
    const sourceName = source.name || source.uri;
    const targetProperty = this._parser.getRelationTargetProperty(relation.uri);
    const target =
      this._parser.getClass(targetProperty.propertyType) ||
      this._parser.getRelation(targetProperty.propertyType);
    const targetName = target.name || target.uri;
    const relationStereotype = this._rules.getRelationStereotype(
      relation.stereotypes[0],
    );

    const sourcePropertyLowerbound = this._rules.getRelationCardinalityValue(
      sourceProperty.lowerbound,
    );
    const sourcePropertyUpperbound = this._rules.getRelationCardinalityValue(
      sourceProperty.upperbound,
    );
    const relationSourceLowerbound = this._rules.getRelationCardinalityValue(
      relationStereotype.source.lowerbound,
    );
    const relationSourceUpperbound = this._rules.getRelationCardinalityValue(
      relationStereotype.source.upperbound,
    );
    const targetPropertyLowerbound = this._rules.getRelationCardinalityValue(
      targetProperty.lowerbound,
    );
    const targetPropertyUpperbound = this._rules.getRelationCardinalityValue(
      targetProperty.upperbound,
    );
    const relationTargetLowerbound = this._rules.getRelationCardinalityValue(
      relationStereotype.target.lowerbound,
    );
    const relationTargetUpperbound = this._rules.getRelationCardinalityValue(
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
