import {
  OntoUMLStereotypeError,
  OntoUMLRelationError,
} from '@error/ontouml_syntax';
import OntoUMLRules from './rules/ontouml_rules';
import OntoUMLParser from '../ontouml_parser';
import { CLASS_TYPE } from '@constants/model_types';

class OntoUMLSyntaxRelations {
  private rules: OntoUMLRules;
  private parser: OntoUMLParser;
  private errors: IOntoUMLError[];

  constructor(parser: OntoUMLParser) {
    this.rules = new OntoUMLRules(parser.getVersion());
    this.parser = parser;
    this.errors = [];
  }

  async verifyRelationTypes(): Promise<IOntoUMLError[]> {
    const relations = this.parser.getRelations();

    await Promise.all([
      this.verifyRelationStereotypes(relations),
      this.verifyRelations(relations),
    ]);

    return this.errors;
  }

  async verifyRelationStereotypes(elements: IElement[]) {
    const stereotypes = this.rules.getRelationStereotypesID();

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
      const sourceId = this.parser.getRelationSourceClassID(relation.id);
      const source =
        this.parser.getClass(sourceId) || this.parser.getRelation(sourceId);
      const sourceStereotypeId = source.stereotypes[0];
      const targetId = this.parser.getRelationTargetClassID(relation.id);
      const target =
        this.parser.getClass(targetId) || this.parser.getRelation(targetId);
      const targetStereotypeId = target.stereotypes[0];

      const isValidRelation = this.rules.isValidRelation(
        sourceStereotypeId,
        targetStereotypeId,
        relation.stereotypes[0],
      );

      if (isValidRelation) {
        await this.verifyRelationCardinalities(relation);
      } else {
        const relationName = this.rules.getRelationNameByID(
          relation.stereotypes[0],
        );
        const sourceName = source.name || source.id;
        const sourceStereotypeName = this.rules.getStereotypeNameByID(
          sourceStereotypeId,
        );
        const targetName = target.name || target.id;
        const targetStereotypeName =
          target.type === CLASS_TYPE
            ? this.rules.getStereotypeNameByID(targetStereotypeId)
            : this.rules.getRelationNameByID(targetStereotypeId);

        let errorDetail = `${target.type} ${source.type} "${sourceName}" of stereotype ${sourceStereotypeName} cannot have a ${relationName} relation with ${target.type} "${targetName}" of stereotype ${targetStereotypeName}`;

        if (this.rules.isDerivationRelation(relation.stereotypes[0])) {
          errorDetail = `"${targetName}" must be the source of ${relationName} relation between ${source.type} "${sourceName}" and ${target.type} "${targetName}"`;
        }

        await this.errors.push(
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
    const sourceProperty = this.parser.getRelationSourceProperty(relation.id);
    const source =
      this.parser.getClass(sourceProperty.propertyType) ||
      this.parser.getRelation(sourceProperty.propertyType);
    const sourceName = source.name || source.id;
    const targetProperty = this.parser.getRelationTargetProperty(relation.id);
    const target =
      this.parser.getClass(targetProperty.propertyType) ||
      this.parser.getRelation(targetProperty.propertyType);
    const targetName = target.name || target.id;
    const relationStereotype = this.rules.getRelationStereotype(
      relation.stereotypes[0],
    );

    const sourcePropertyLowerbound = this.parser.getRelationSourceLowerboundCardinality(
      relation.id,
    );
    const sourcePropertyUpperbound = this.parser.getRelationSourceUpperboundCardinality(
      relation.id,
    );
    const relationSourceLowerbound = this.rules.getRelationCardinalityValue(
      relationStereotype.source.lowerbound,
    );
    const relationSourceUpperbound = this.rules.getRelationCardinalityValue(
      relationStereotype.source.upperbound,
    );
    const targetPropertyLowerbound = this.parser.getRelationTargetLowerboundCardinality(
      relation.id,
    );
    const targetPropertyUpperbound = this.parser.getRelationTargetUpperboundCardinality(
      relation.id,
    );
    const relationTargetLowerbound = this.rules.getRelationCardinalityValue(
      relationStereotype.target.lowerbound,
    );
    const relationTargetUpperbound = this.rules.getRelationCardinalityValue(
      relationStereotype.target.upperbound,
    );

    if (sourcePropertyLowerbound < relationSourceLowerbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the source lowebound bigger than ${relationStereotype.source.lowerbound}.`;

      await this.errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (sourcePropertyUpperbound > relationSourceUpperbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the source upperbound less than ${relationStereotype.source.upperbound}.`;

      await this.errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (targetPropertyLowerbound < relationTargetLowerbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the target lowebound bigger than ${relationStereotype.target.lowerbound}.`;

      await this.errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    if (targetPropertyUpperbound > relationTargetUpperbound) {
      const errorDetail = `${relation.type} "${relationStereotype.name}" between "${sourceName}" and "${targetName}" must have the target upperbound less than ${relationStereotype.target.upperbound}.`;

      await this.errors.push(
        new OntoUMLRelationError(errorDetail, {
          relation,
        }),
      );
    }

    return true;
  }
}

export default OntoUMLSyntaxRelations;
