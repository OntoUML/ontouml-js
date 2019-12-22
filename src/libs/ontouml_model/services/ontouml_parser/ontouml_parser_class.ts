import { CLASS_TYPE } from '@constants/model_types';
import OntoUMLParserMethod from './ontouml_parser_method';
import OntoUMLParserGeneralizationLink from './ontouml_parser_generalization_link';

class OntoUMLParserClass extends OntoUMLParserMethod {
  private _generalizationLinkParser: OntoUMLParserGeneralizationLink;

  constructor(model: IModel) {
    super(model);

    this._generalizationLinkParser = new OntoUMLParserGeneralizationLink(model);
  }

  getClasses(): IStructuralElement[] {
    return this.getStructuralElements().filter(
      (structuralElement: IStructuralElement) =>
        structuralElement['@type'] === CLASS_TYPE,
    );
  }

  getClass(classUri: string): IStructuralElement {
    return this.getClasses().filter(
      (classEl: IStructuralElement) => classEl.uri === classUri,
    )[0];
  }

  getClassParents(classUri: string): IStructuralElement[] {
    const generalizationLinks = this._generalizationLinkParser.getGeneralizationLinksFromSpecificClass(
      classUri,
    );
    const generalClassIds = generalizationLinks.map(
      (generalizationLink: IStructuralElement) => generalizationLink.tuple[0],
    );

    return this.getClasses().filter((classEl: IStructuralElement) =>
      generalClassIds.includes(classEl.uri),
    );
  }

  getClassChildren(classUri: string): IStructuralElement[] {
    const generalizationLinks = this._generalizationLinkParser.getGeneralizationLinksFromGeneralClass(
      classUri,
    );
    const generalClassIds = generalizationLinks.map(
      (generalizationLink: IStructuralElement) => generalizationLink.tuple[1],
    );

    return this.getClasses().filter((classEl: IStructuralElement) =>
      generalClassIds.includes(classEl.uri),
    );
  }
}

export default OntoUMLParserClass;
