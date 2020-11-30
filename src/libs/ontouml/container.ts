import { Package, Class, Property, Literal, Relation, Generalization, GeneralizationSet } from '.';

function getContents<T>(container: Container<T, any>, contentFields: string[], contentsFilter?: (content: T) => boolean): T[] {
  const contents = new Set<T>();

  contentFields.forEach((fieldName: string) => {
    const value: T = container[fieldName];
    const valueArray: T[] = Array.isArray(container[fieldName]) ? container[fieldName] : undefined;

    if (valueArray) {
      valueArray.forEach((arrayItem: T) => {
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

function getAllContents<T>(container: Container<any, T>, contentFields: string[], contentsFilter?: (content: T) => boolean): T[] {
  const contents = new Set<T>();
  const tryAdd = function(value) {
    if (value && contents.has(value)) {
      throw new Error('Bad contents hierarchy');
    } else if (value) {
      contents.add(value);
    }
  };

  contentFields.forEach((fieldName: string) => {
    const value: T = container[fieldName];
    const valueArray: T[] = Array.isArray(container[fieldName]) ? container[fieldName] : undefined;

    if (valueArray) {
      valueArray.forEach((arrayItem: T) => {
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

function addContentToArray<GeneralContentType, SpecificContentType extends GeneralContentType>(
  container: Container<GeneralContentType, any>,
  arrayField: string,
  content: SpecificContentType
): SpecificContentType {
  if (!Array.isArray(container[arrayField])) {
    container[arrayField] = [content];
  } else {
    container[arrayField].push(content);
  }

  return content;
}

export const container = {
  getContents,
  getAllContents,
  addContentToArray
};

export interface Container<ContentType, DeepContentType> {
  getContents(contentsFilter?: (content: ContentType) => boolean): ContentType[];
  getAllContents(contentsFilter?: (content: DeepContentType) => boolean): DeepContentType[];
}

export interface PackageContainer<ContentType, DeepContentType> extends Container<ContentType, DeepContentType> {
  getAllPackages(): Package[];
  getAllClasses(): Class[];
  getAllEnumerations(): Class[];
  getAllAttributes(): Property[];
  getAllLiterals(): Literal[];
  getAllRelations(): Relation[];
  getAllRelationEnds(): Property[];
  getAllGeneralizations(): Generalization[];
  getAllGeneralizationSets(): GeneralizationSet[];
}
