import {
  IElement,
  IContainer,
  IContainedElement,
} from '@libs/model/interfaces';
import memoizee from 'memoizee';



/**
 * Class that represents a Model according to `ontouml-schema`.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Model implements IElement, IContainer {
  type: 'Model';
  id: string;
  name: string | null;
  authors: string[] | null;
  elements: IContainedElement[] | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    authors?: string[],
    elements?: IContainedElement[],
  ) {
    this.id = id;
    this.name = name;
    this.authors = authors;
    this.elements = elements;

    if (enableHash) {
      this.getAllElements = memoizee(this.getAllElements);
    }
  }

  getAllElements(): IContainedElement {
    var allElements = [...this.elements];

    this.elements.forEach(element => {
        allElements.push(element);
        if((element as unknown as IContainer).getAllElements) {
            const innerElements = element.getAllElements();
            if()
        }
    });

    return allElements;
  }
}
