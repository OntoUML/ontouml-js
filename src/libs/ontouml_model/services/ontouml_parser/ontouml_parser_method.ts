import memoizee from 'memoizee';
import { PACKAGE_TYPE } from '@constants/model_types';

class OntoUMLParserMethod {
  private _model: IModel;

  constructor(model: IModel) {
    this._model = model;

    this.getStructuralElements = memoizee(this.getStructuralElements);
  }

  getStructuralElements(packageElement?: IStructuralElement) {
    const current = packageElement || this._model;
    let elements: IStructuralElement[] = current.structuralElements || [];

    elements.forEach((structuralElement: IStructuralElement) => {
      if (structuralElement['@type'] === PACKAGE_TYPE) {
        elements = [
          ...elements,
          ...this.getStructuralElements(structuralElement),
        ];
      }
    });

    return elements;
  }
}

export default OntoUMLParserMethod;
