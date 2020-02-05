import memoizee from 'memoizee';
import { PACKAGE_TYPE } from '@constants/';

class OntoUMLParserMethod {
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;

    this.getElements = memoizee(this.getElements);
  }

  getElements(packageElement?: IElement) {
    const current = packageElement || this.model;
    let elements: IElement[] = current.elements || [];

    elements.forEach((element: IElement) => {
      if (element.type === PACKAGE_TYPE) {
        elements = [...elements, ...this.getElements(element)];
      }
    });

    return elements;
  }
}

export default OntoUMLParserMethod;
