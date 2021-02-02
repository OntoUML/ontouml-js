import {
  Package,
  Class,
  Property,
  Literal,
  Relation,
  Generalization,
  GeneralizationSet,
  ModelElement,
  OntoumlType,
  PropertyStereotype,
  ClassStereotype,
  RelationStereotype,
  OntologicalNature
} from '.';
import _ from 'lodash';

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

/**
 * Set the `container` field in the content element and update the contents of previous and new containers.
 *
 * @param content -  content `ModelElement` to have its container updated
 * @param newContainer -  container `ModelElement` to contain `content`
 * @param containmentReference -  name of the field to be updated
 * @param isContainedInArray -  boolean that identifies whether the field represents a `ModelElement` or a `ModelElement[]`
 * */
function setContainer(
  content: ModelElement,
  newContainer: ModelElement,
  containmentReference: string,
  isContainedInArray: boolean
): void {
  if (content.project !== newContainer.project) {
    throw new Error('Container and content projects do not match');
  }

  const currentContainer = content.container;

  if (currentContainer && currentContainer[containmentReference]) {
    _.remove(currentContainer[containmentReference], (element: ModelElement) => element === content);
  }

  if (isContainedInArray) {
    if (newContainer[containmentReference]) {
      newContainer[containmentReference].push(content);
    } else {
      newContainer[containmentReference] = [content];
    }
  } else {
    if (newContainer[containmentReference]) {
      throw new Error(`Content field '${containmentReference}' already defined`);
    } else {
      newContainer[containmentReference] = content;
    }
  }

  content.container = newContainer;
}

export const containerUtils = {
  getContents,
  getAllContents,
  addContentToArray,
  setContainer
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
  getAllContentsByType(type: OntoumlType | OntoumlType[]): ModelElement[];
  getAllAttributesByStereotype(stereotype: PropertyStereotype | PropertyStereotype[]): Property[];
  getAllClassesByStereotype(stereotype: ClassStereotype | ClassStereotype[]): Class[];
  getAllRelationsByStereotype(stereotype: RelationStereotype | RelationStereotype[]): Relation[];
  getAllClassesWithRestrictedToContainedIn(nature: OntologicalNature | OntologicalNature[]): Class[];
  getClassesWithTypeStereotype(): Class[];
  getClassesWithHistoricalRoleStereotype(): Class[];
  getClassesWithHistoricalRoleMixinStereotype(): Class[];
  getClassesWithEventStereotype(): Class[];
  getClassesWithSituationStereotype(): Class[];
  getClassesWithCategoryStereotype(): Class[];
  getClassesWithMixinStereotype(): Class[];
  getClassesWithRoleMixinStereotype(): Class[];
  getClassesWithPhaseMixinStereotype(): Class[];
  getClassesWithKindStereotype(): Class[];
  getClassesWithCollectiveStereotype(): Class[];
  getClassesWithQuantityStereotype(): Class[];
  getClassesWithRelatorStereotype(): Class[];
  getClassesWithQualityStereotype(): Class[];
  getClassesWithModeStereotype(): Class[];
  getClassesWithSubkindStereotype(): Class[];
  getClassesWithRoleStereotype(): Class[];
  getClassesWithPhaseStereotype(): Class[];
  getClassesWithEnumerationStereotype(): Class[];
  getClassesWithDatatypeStereotype(): Class[];
  getClassesWithAbstractStereotype(): Class[];
  getClassesRestrictedToFunctionalComplex(): Class[];
  getClassesRestrictedToCollective(): Class[];
  getClassesRestrictedToQuantity(): Class[];
  getClassesRestrictedToMode(): Class[];
  getClassesRestrictedToIntrinsicMode(): Class[];
  getClassesRestrictedToExtrinsicMode(): Class[];
  getClassesRestrictedToQuality(): Class[];
  getClassesRestrictedToRelator(): Class[];
}
