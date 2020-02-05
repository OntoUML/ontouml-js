import memoizee from 'memoizee';
import { PACKAGE_TYPE } from '@constants/';
import { Element, Classifier } from '.';

/**
 * Class that represents an OntoUML package or model.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Package extends Element {
  authors: string[] | null;
  contents: Element[] | null;
  container: Package | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    authors?: string[],
    contents?: Element[],
    container?: Package,
  ) {
    super(PACKAGE_TYPE, id, enableHash, name, description, container);
    this.authors = authors;
    this.contents = contents;

    if (enableHash) {
      this.getAllContents = memoizee(this.getAllContents);
      this.getAllContentsByType = memoizee(this.getAllContentsByType);
      this.getContentById = memoizee(this.getContentById);
    }
  }

  /**
   * Returns an array of all Element objects that may be reached from a package, including classifier's properties.
   */
  getAllContents(): Element[] {
    let allElements = [...this.contents];

    this.contents.forEach(content => {
      allElements.push(content);
      if (content instanceof Package) {
        const innerContents = content.getAllContents();
        if (innerContents.includes(this)) {
          throw 'Circular containment references';
        }
        allElements = [...allElements, ...innerContents];
      } else if (content instanceof Classifier) {
        allElements = [...allElements, ...content.properties];
      }
    });

    return allElements;
  }

  /**
   * Returns an array of all Element objects that may be reached from a package filtered by those which the type field matches the selected ones.
   *
   * @param selectedTypes - an array of strings representing the desired types (i.e., PACKAGE_TYPE, CLASS_TYPE, RELATION_TYPE, GENERALIZATION_TYPE, GENERALIZATION_SET_TYPE, or PROPERTY_TYPE).
   */
  getAllContentsByType(selectedTypes: string[]): Element[] {
    return this.getAllContents().filter(element =>
      selectedTypes.includes(element.type),
    );
  }

  /**
   * Returns an Element according of matching id.
   *
   * @param elementId - Desired element's id.
   */
  getContentById(elementId: string): Element {
    return this.getAllContents().find(
      (element: Element) => element.id === elementId,
    );
  }
}
