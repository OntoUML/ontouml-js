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

  async verifyRelationStereotypes(elements: IElement[]) {
    const stereotypes = this._rules.getRelationStereotypesID();

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

  async verifyRelations(relations: IElement[]) {
    const promises = [];

    for (let i = 0; i < relations.length; i += 1) {
      const relation = relations[i];

      promises.push(this.verifyRelationConnections(relation));
    }

    await Promise.all(promises);

    return true;
  }

  async verifyRelationConnections(relation: IElement) {
    try {
      const sourceId = this._parser.getRelationSourceClassID(relation.id);
      const source =
        this._parser.getClass(sourceId) || this._parser.getRelation(sourceId);
      const sourceStereotypeId = source.stereotypes[0];
      const targetId = this._parser.getRelationTargetClassID(relation.id);
      const target =
        this._parser.getClass(targetId) || this._parser.getRelation(targetId);
      const targetStereotypeId = target.stereotypes[0];

      const isValidRelation = this._rules.isValidRelation(
        sourceStereotypeId,
        targetStereotypeId,
        relation.stereotypes[0],
      );

      if (isValidRelation) {
        await this.verifyRelationCardinalities(relation);
      } else {
        const relationName = this._rules.getRelationNameByID(
          relation.stereotypes[0],
        );
        const sourceName = source.name || source.id;
        const sourceStereotypeName = this._rules.getStereotypeNameByID(
          sourceStereotypeId,
        );
        const targetName = target.name || target.id;
        const targetStereotypeName =
          target.type === CLASS_TYPE
            ? this._rules.getStereotypeNameByID(targetStereotypeId)
            : this._rules.getRelationNameByID(targetStereotypeId);

        let errorDetail = `${target.type} ${source.type} "${sourceName}" of stereotype ${sourceStereotypeName} cannot have a ${relationName} relation with ${target.type} "${targetName}" of stereotype ${targetStereotypeName}`;

        if (this._rules.isDerivationRelation(relation.stereotypes[0])) {
          errorDetail = `"${targetName}" must be the source of ${relationName} relation between ${source.type} "${sourceName}" and ${target.type} "${targetName}"`;
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

  async verifyRelationCardinalities(relation: IElement) {
    const sourceProperty = this._parser.getRelationSourceProperty(relation.id);
    const source =
      this._parser.getClass(sourceProperty.propertyType) ||
      this._parser.getRelation(sourceProperty.propertyType);
    const sourceName = source.name || source.id;
    const targetProperty = this._parser.getRelationTargetProperty(relation.id);
    const target =
      this._parser.getClass(targetProperty.propertyType) ||
      this._parser.getRelation(targetProperty.propertyType);
    const targetName = target.name || target.id;
    const relationStereotype = this._rules.getRelationStereotype(
      relation.stereotypes[0],
    );

    const sourcePropertyLowerbound = this._parser.getRelationSourceLowerboundCardinality(
      relation.id,
    );
    const sourcePropertyUpperbound = this._parser.getRelationSourceUpperboundCardinality(
      relation.id,
    );
    const relationSourceLowerbound = this._rules.getRelationCardinalityValue(
      relationStereotype.source.lowerbound,
    );
    const relationSourceUpperbound = this._rules.getRelationCardinalityValue(
      relationStereotype.source.upperbound,
    );
    const targetPropertyLowerbound = this._parser.getRelationTargetLowerboundCardinality(
      relation.id,
    );
    const targetPropertyUpperbound = this._parser.getRelationTargetUpperboundCardinality(
      relation.id,
    );
    const relationTargetLowerbound = this._rules.getRelationCardinalityValue(
      relationStereotype.target.lowerbound,
    );
    const relationTargetUpperbound = this._rules.getRelationCardinalityValue(
      relationStereotype.target.upperbound,
    );

    if (sourcePropertyLowerbound < relationSourceLowerbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the source lowebound bigger than ${relationStereotype.source.lowerbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (sourcePropertyUpperbound > relationSourceUpperbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the source upperbound less than ${relationStereotype.source.upperbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (targetPropertyLowerbound < relationTargetLowerbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the target lowebound bigger than ${relationStereotype.target.lowerbound}.`;

      await this._errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (targetPropertyUpperbound > relationTargetUpperbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the target upperbound less than ${relationStereotype.target.upperbound}.`;

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
