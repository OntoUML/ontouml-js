import OntoUMLParserMethod from './ontouml_parser_method';
import { GENERALIZATION_TYPE } from '@constants/model_types';

class OntoUMLParserGeneralizationLink extends OntoUMLParserMethod {
  constructor(model: IModel) {
    super(model);
  }

  private getClassGeneralizationLinks(
    classId: string,
    key: 'general' | 'specific',
  ): IElement[] {
    return this.getElements()
      .filter((element: IElement) => element.type === GENERALIZATION_TYPE)
      .filter(
        (generalizationLinks: IElement) =>
          generalizationLinks[key] && generalizationLinks[key].id === classId,
      );
  }

  getGeneralizationLinksFromGeneralClass(classId: string): IElement[] {
    return this.getClassGeneralizationLinks(classId, 'general');
  }

  getGeneralizationLinksFromSpecificClass(classId: string): IElement[] {
    return this.getClassGeneralizationLinks(classId, 'specific');
  }
}

export default OntoUMLParserGeneralizationLink;
