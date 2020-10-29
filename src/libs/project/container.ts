export function getContents<T>(container: Container<T, any>, contentFields: string[]): T[] {
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

  return [...contents];
}

export function getAllContents<T>(container: Container<any, T>, contentFields: string[]): T[] {
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

  return [...contents];
}

export function addContentToArray<GeneralContentType, SpecificContentType extends GeneralContentType>(
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

export default interface Container<Content, DeepContent> {
  getContents(): Content[];
  getAllContents(): DeepContent[];
}
