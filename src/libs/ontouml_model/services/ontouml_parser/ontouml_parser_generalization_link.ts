import OntoUMLParserMethod from './ontouml_parser_method';
import { GENERALIZATION_LINK_TYPE } from '@constants/model_types';

class OntoUMLParserGeneralizationLink extends OntoUMLParserMethod {
  constructor(model: IModel) {
    super(model);
  }

  private getClassGeneralizationLinks(
    classId: string,
    index: number,
  ): IStructuralElement[] {
    return this.getStructuralElements()
      .filter(
        (structuralElement: IStructuralElement) =>
          structuralElement['@type'] === GENERALIZATION_LINK_TYPE,
      )
      .filter(
        (generalizationLinks: IStructuralElement) =>
          generalizationLinks.tuple &&
          generalizationLinks.tuple[index] === classId,
      );
  }

  getGeneralizationLinksFromGeneralClass(
    classId: string,
  ): IStructuralElement[] {
    return this.getClassGeneralizationLinks(classId, 0);
  }

  getGeneralizationLinksFromSpecificClass(
    classId: string,
  ): IStructuralElement[] {
    return this.getClassGeneralizationLinks(classId, 1);
  }
}

export default OntoUMLParserGeneralizationLink;
