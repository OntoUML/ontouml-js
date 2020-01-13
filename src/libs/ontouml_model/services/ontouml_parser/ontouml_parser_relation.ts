import { RELATION_TYPE } from '@constants/model_types';
import OntoUMLParserMethod from './ontouml_parser_method';

class OntoUMLParserRelation extends OntoUMLParserMethod {
  constructor(model: IModel) {
    super(model);
  }

  getRelations(): IElement[] {
    return this.getElements().filter(
      (element: IElement) => element.type === RELATION_TYPE,
    );
  }

  getRelation(relationId: string): IElement {
    return this.getRelations().filter(
      (relationEl: IElement) => relationEl.id === relationId,
    )[0];
  }

  getRelationSourceClassID(relationId: string): string {
    const relation = this.getRelation(relationId);

    return relation.properties[0].propertyType;
  }

  getRelationTargetClassID(relationId: string): string {
    const relation = this.getRelation(relationId);

    return relation.properties[1].propertyType;
  }

  getRelationSourceProperty(relationId: string): IProperty {
    const relation = this.getRelation(relationId);

    return relation.properties[0];
  }

  getRelationTargetProperty(relationId: string): IProperty {
    const relation = this.getRelation(relationId);

    return relation.properties[1];
  }
}

export default OntoUMLParserRelation;
