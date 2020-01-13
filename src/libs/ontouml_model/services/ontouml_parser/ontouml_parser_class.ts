import OntoUMLParserMethod from './ontouml_parser_method';
import OntoUMLParserGeneralizationLink from './ontouml_parser_generalization_link';
import { CLASS_TYPE } from '@constants/model_types';

class OntoUMLParserClass extends OntoUMLParserMethod {
  private _generalizationLinkParser: OntoUMLParserGeneralizationLink;

  constructor(model: IModel) {
    super(model);

    this._generalizationLinkParser = new OntoUMLParserGeneralizationLink(model);
  }

  getClasses(): IElement[] {
    return this.getElements().filter(
      (element: IElement) => element.type === CLASS_TYPE,
    );
  }

  getClass(classId: string): IElement {
    return this.getClasses().filter(
      (classEl: IElement) => classEl.id === classId,
    )[0];
  }

  getClassParents(classId: string): IElement[] {
    const generalizationLinks = this._generalizationLinkParser.getGeneralizationLinksFromSpecificClass(
      classId,
    );
    const generalClassIds = generalizationLinks.map(
      (generalizationLink: IElement) => generalizationLink.general.id,
    );

    return this.getClasses().filter((classEl: IElement) =>
      generalClassIds.includes(classEl.id),
    );
  }

  getClassChildren(classId: string): IElement[] {
    const generalizationLinks = this._generalizationLinkParser.getGeneralizationLinksFromGeneralClass(
      classId,
    );
    const generalClassIds = generalizationLinks.map(
      (generalizationLink: IElement) => generalizationLink.specific.id,
    );

    return this.getClasses().filter((classEl: IElement) =>
      generalClassIds.includes(classEl.id),
    );
  }
}

export default OntoUMLParserClass;
