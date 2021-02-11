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
  OntologicalNature,
  Container
} from './';

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
