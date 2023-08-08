import {
  OntoumlElement,
  OntoumlType,
  Class,
  ClassStereotype,
  OntologicalNature,
  PropertyStereotype,
  RelationStereotype,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  Package,
  Property,
  Relation
} from '..';

export interface ModelElementContainer {
  getElementById(id: String): OntoumlElement;
  getClassById(id: String): Class;
  getRelationById(id: String): Relation;
  getPropertyById(id: String): Property;
  getGeneralizationById(id: String): Generalization;
  getGeneralizationSetById(id: String): GeneralizationSet;
  getPackageById(id: String): Package;
  getAllPackages(): Package[];
  getAllClasses(): Class[];
  getAllEnumerations(): Class[];
  getAllProperties(): Property[];
  getAllAttributes(): Property[];
  getAllLiterals(): Literal[];
  getAllRelations(): Relation[];
  getAllRelationEnds(): Property[];
  getAllGeneralizations(): Generalization[];
  getAllGeneralizationSets(): GeneralizationSet[];
  getAllModelElements(): ModelElement[];
  getAllContentsByType(type: OntoumlType | OntoumlType[]): OntoumlElement[];
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
