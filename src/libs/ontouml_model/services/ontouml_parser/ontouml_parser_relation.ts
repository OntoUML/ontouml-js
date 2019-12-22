import { RELATION_TYPE } from '@constants/model_types';
import OntoUMLParserMethod from './ontouml_parser_method';

class OntoUMLParserRelation extends OntoUMLParserMethod {
  constructor(model: IModel) {
    super(model);
  }

  getRelations(): IStructuralElement[] {
    return this.getStructuralElements().filter(
      (structuralElement: IStructuralElement) =>
        structuralElement['@type'] === RELATION_TYPE,
    );
  }

  getRelation(relationUri: string): IStructuralElement {
    return this.getRelations().filter(
      (relationEl: IStructuralElement) => relationEl.uri === relationUri,
    )[0];
  }

  getRelationSourceClassURI(relationUri: string): string {
    const relation = this.getRelation(relationUri);

    return relation.properties[0].propertyType;
  }

  getRelationTargetClassURI(relationUri: string): string {
    const relation = this.getRelation(relationUri);

    return relation.properties[1].propertyType;
  }

  getRelationSourceProperty(relationUri: string): IProperty {
    const relation = this.getRelation(relationUri);

    return relation.properties[0];
  }

  getRelationTargetProperty(relationUri: string): IProperty {
    const relation = this.getRelation(relationUri);

    return relation.properties[1];
  }
}

export default OntoUMLParserRelation;
