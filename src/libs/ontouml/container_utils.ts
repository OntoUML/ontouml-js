import { OntoumlElement } from '.';
import _ from 'lodash';

function getContents(
  element: OntoumlElement,
  contentFields: string[],
  contentsFilter?: (content: OntoumlElement) => boolean
): OntoumlElement[] {
  const contents = new Set<OntoumlElement>();

  contentFields.forEach((fieldName: string) => {
    const value: OntoumlElement = element[fieldName];
    const valueArray: OntoumlElement[] = Array.isArray(element[fieldName]) ? element[fieldName] : undefined;

    if (valueArray) {
      valueArray.forEach((arrayItem: OntoumlElement) => {
        if (arrayItem) {
          contents.add(arrayItem);
        }
      });
    } else if (value) {
      contents.add(value);
    }
  });

  return contentsFilter ? [...contents].filter(contentsFilter) : [...contents];
}

function getAllContents(
  element: OntoumlElement,
  contentFields: string[],
  contentsFilter?: (content: OntoumlElement) => boolean
): OntoumlElement[] {
  const contents = new Set<OntoumlElement>();
  const tryAdd = function(value) {
    if (value && contents.has(value)) {
      throw new Error('Bad contents hierarchy');
    } else if (value) {
      contents.add(value);
    }
  };

  contentFields.forEach((fieldName: string) => {
    const value: OntoumlElement = element[fieldName];
    const valueArray: OntoumlElement[] = Array.isArray(element[fieldName]) ? element[fieldName] : undefined;

    if (valueArray) {
      valueArray.forEach((arrayItem: OntoumlElement) => {
        if (arrayItem) {
          contents.add(arrayItem);
        }
      });
    } else if (value) {
      contents.add(value);
    }
  });

  [...contents].forEach((content: any) => {
    if (content.getAllContents) {
      content.getAllContents().forEach(tryAdd);
    }
  });

  return contentsFilter ? [...contents].filter(contentsFilter) : [...contents];
}

function addContentToArray(element: OntoumlElement, arrayField: string, content: OntoumlElement): OntoumlElement {
  if (!Array.isArray(element[arrayField])) {
    element[arrayField] = [content];
  } else {
    element[arrayField].push(content);
  }

  return content;
}

/**
 * Set the `container` field in the content element and update the contents of previous and new containers.
 *
 * @param element -  content `OntoumlElement` to have its container updated
 * @param container -  container `OntoumlElement` to contain `content`
 * @param containmentReference -  name of the field to be updated
 * @param isContainedInArray -  boolean that identifies whether the field represents a `OntoumlElement` or a `OntoumlElement[]`
 * */
function setContainer(
  element: OntoumlElement,
  container: OntoumlElement,
  containmentReference: string,
  isContainedInArray: boolean
): void {
  if (element.project !== container.project) {
    throw new Error('OntoumlElement and content projects do not match');
  }

  const currentContainer = element.container;

  if (currentContainer && currentContainer[containmentReference]) {
    _.remove(currentContainer[containmentReference], (element: OntoumlElement) => element === element);
  }

  if (isContainedInArray) {
    if (container[containmentReference]) {
      container[containmentReference].push(element);
    } else {
      container[containmentReference] = [element];
    }
  } else {
    if (container[containmentReference]) {
      throw new Error(`Content field '${containmentReference}' already defined`);
    } else {
      container[containmentReference] = element;
    }
  }

  element.container = container;
}

export const containerUtils = {
  getContents,
  getAllContents,
  addContentToArray,
  setContainer
};
