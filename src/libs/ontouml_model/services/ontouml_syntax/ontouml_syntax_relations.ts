import {
  OntoUMLStereotypeError,
  OntoUMLRelationError,
} from '@error/ontouml_syntax';
import OntoUMLParser from '../ontouml_parser';
import OntoUMLSyntaxMethod from './ontouml_syntax_method';
import { CLASS_TYPE } from '@constants/model_types';

class OntoUMLSyntaxRelations extends OntoUMLSyntaxMethod {
  private errors: IOntoUMLError[];

  constructor(parser: OntoUMLParser) {
    super(parser);

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
      const source = this.getRelationSource(relation.id);
      const sourceStereotypeId = source.stereotypes[0];
      const target = this.getRelationTarget(relation.id);
      const targetStereotypeId = target.stereotypes[0];

      const isValidRelation = this.rules.isValidRelation(
        sourceStereotypeId,
        targetStereotypeId,
        relation.stereotypes[0],
      );

      if (isValidRelation) {
        await Promise.all([
          this.verifyRelationNatureConnections(relation),
          this.verifyRelationCardinalities(relation),
        ]);
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

        let errorDetail = `${source.type} "${sourceName}" of stereotype ${sourceStereotypeName} cannot have a ${relationName} relation with ${target.type} "${targetName}" of stereotype ${targetStereotypeName}`;

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

  async verifyRelationNatureConnections(relation: IElement) {
    const source = this.getRelationSource(relation.id);
    const target = this.getRelationTarget(relation.id);

    if (source.type === CLASS_TYPE && target.type === CLASS_TYPE) {
      const sourceOntologyNature = this.getOntologyNatureClass(source.id);
      const targetOntologyNature = this.getOntologyNatureClass(target.id);

      if (sourceOntologyNature && targetOntologyNature) {
        const sourceONStereotypeId = sourceOntologyNature.stereotypes[0];
        const targetONStereotypeId = targetOntologyNature.stereotypes[0];

        const isValidRelation = this.rules.isValidRelation(
          sourceONStereotypeId,
          targetONStereotypeId,
          relation.stereotypes[0],
        );

        if (!isValidRelation) {
          const relationName = this.rules.getRelationNameByID(
            relation.stereotypes[0],
          );
          const sourceName = source.name || source.id;
          const sourceONStereotypeName = this.rules.getStereotypeNameByID(
            sourceONStereotypeId,
          );
          const targetName = target.name || target.id;
          const targetONStereotypeName = this.rules.getStereotypeNameByID(
            targetONStereotypeId,
          );

          const errorDetail = `${source.type} "${sourceName}" of ontolgy nature ${sourceONStereotypeName} cannot have a ${relationName} relation with ${target.type} "${targetName}" of ontology nature ${targetONStereotypeName}`;

          await this.errors.push(
            new OntoUMLRelationError(errorDetail, {
              relation,
            }),
          );
        }
      }
    }

    return true;
  }

  async verifyRelationCardinalities(relation: IElement) {
    const source = this.getRelationSource(relation.id);
    const sourceName = source.name || source.id;
    const target = this.getRelationTarget(relation.id);
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
