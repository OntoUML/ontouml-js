import {
  Relation,
  OntoumlElement,
  containerUtils,
  Package,
  Diagram,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  Property,
  PackageContainer,
  OntoumlType,
  PropertyStereotype,
  ClassStereotype,
  RelationStereotype,
  OntologicalNature
} from './';

export class Project extends OntoumlElement implements PackageContainer<Package, ModelElement> {
  type: OntoumlType.PROJECT_TYPE;
  model: Package;
  diagrams: Diagram[];

  constructor(base?: Partial<Project>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.PROJECT_TYPE, enumerable: true });

    this.model = this.model || null;
    this.diagrams = this.diagrams || null;
  }

  // TODO: add support to diagrams element
  getContents(): Package[] {
    return this.model ? [this.model] : [];
  }

  getAllContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return containerUtils.getAllContents(this, ['model'], contentsFilter);
  }

  getAllAttributes(): Property[] {
    return this.model.getAllAttributes();
  }

  getAllRelationEnds(): Property[] {
    return this.model.getAllRelationEnds();
  }

  getAllRelations(): Relation[] {
    return this.model.getAllRelations();
  }

  getAllGeneralizations(): Generalization[] {
    return this.model.getAllGeneralizations();
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    return this.model.getAllGeneralizationSets();
  }

  getAllPackages(): Package[] {
    const packagesFilter = (modelElement: ModelElement) => modelElement instanceof Package;
    return this.getAllContents(packagesFilter) as Package[];
  }

  getAllClasses(): Class[] {
    return this.model.getAllClasses();
  }

  getAllEnumerations(): Class[] {
    return this.model.getAllEnumerations();
  }

  getAllLiterals(): Literal[] {
    return this.model.getAllLiterals();
  }

  getAllContentsByType(type: OntoumlType | OntoumlType[]): ModelElement[] {
    return this.model.getAllContentsByType(type);
  }

  getAllAttributesByStereotype(stereotype: PropertyStereotype | PropertyStereotype[]): Property[] {
    return this.model.getAllAttributesByStereotype(stereotype);
  }

  getAllClassesByStereotype(stereotype: ClassStereotype | ClassStereotype[]): Class[] {
    return this.model.getAllClassesByStereotype(stereotype);
  }

  getAllRelationsByStereotype(stereotype: RelationStereotype | RelationStereotype[]): Relation[] {
    return this.model.getAllRelationsByStereotype(stereotype);
  }

  getAllClassesWithRestrictedToContainedIn(nature: OntologicalNature | OntologicalNature[]): Class[] {
    return this.model.getAllClassesWithRestrictedToContainedIn(nature);
  }

  getClassesWithTypeStereotype(): Class[] {
    return this.model.getClassesWithTypeStereotype();
  }

  getClassesWithHistoricalRoleStereotype(): Class[] {
    return this.model.getClassesWithHistoricalRoleStereotype();
  }

  getClassesWithHistoricalRoleMixinStereotype(): Class[] {
    return this.model.getClassesWithHistoricalRoleMixinStereotype();
  }

  getClassesWithEventStereotype(): Class[] {
    return this.model.getClassesWithEventStereotype();
  }

  getClassesWithSituationStereotype(): Class[] {
    return this.model.getClassesWithSituationStereotype();
  }

  getClassesWithCategoryStereotype(): Class[] {
    return this.model.getClassesWithCategoryStereotype();
  }

  getClassesWithMixinStereotype(): Class[] {
    return this.model.getClassesWithMixinStereotype();
  }

  getClassesWithRoleMixinStereotype(): Class[] {
    return this.model.getClassesWithRoleMixinStereotype();
  }

  getClassesWithPhaseMixinStereotype(): Class[] {
    return this.model.getClassesWithPhaseMixinStereotype();
  }

  getClassesWithKindStereotype(): Class[] {
    return this.model.getClassesWithKindStereotype();
  }

  getClassesWithCollectiveStereotype(): Class[] {
    return this.model.getClassesWithCollectiveStereotype();
  }

  getClassesWithQuantityStereotype(): Class[] {
    return this.model.getClassesWithQuantityStereotype();
  }

  getClassesWithRelatorStereotype(): Class[] {
    return this.model.getClassesWithRelatorStereotype();
  }

  getClassesWithQualityStereotype(): Class[] {
    return this.model.getClassesWithQualityStereotype();
  }

  getClassesWithModeStereotype(): Class[] {
    return this.model.getClassesWithModeStereotype();
  }

  getClassesWithSubkindStereotype(): Class[] {
    return this.model.getClassesWithSubkindStereotype();
  }

  getClassesWithRoleStereotype(): Class[] {
    return this.model.getClassesWithRoleStereotype();
  }

  getClassesWithPhaseStereotype(): Class[] {
    return this.model.getClassesWithPhaseStereotype();
  }

  getClassesWithEnumerationStereotype(): Class[] {
    return this.model.getClassesWithEnumerationStereotype();
  }

  getClassesWithDatatypeStereotype(): Class[] {
    return this.model.getClassesWithDatatypeStereotype();
  }

  getClassesWithAbstractStereotype(): Class[] {
    return this.model.getClassesWithAbstractStereotype();
  }

  getClassesRestrictedToFunctionalComplex(): Class[] {
    return this.model.getClassesRestrictedToFunctionalComplex();
  }

  getClassesRestrictedToCollective(): Class[] {
    return this.model.getClassesRestrictedToCollective();
  }

  getClassesRestrictedToQuantity(): Class[] {
    return this.model.getClassesRestrictedToQuantity();
  }

  getClassesRestrictedToMode(): Class[] {
    return this.model.getClassesRestrictedToMode();
  }

  getClassesRestrictedToIntrinsicMode(): Class[] {
    return this.model.getClassesRestrictedToIntrinsicMode();
  }

  getClassesRestrictedToExtrinsicMode(): Class[] {
    return this.model.getClassesRestrictedToExtrinsicMode();
  }

  getClassesRestrictedToQuality(): Class[] {
    return this.model.getClassesRestrictedToQuality();
  }

  getClassesRestrictedToRelator(): Class[] {
    return this.model.getClassesRestrictedToRelator();
  }

  toJSON(): any {
    const projectSerialization = {
      model: null,
      diagrams: null
    };

    Object.assign(projectSerialization, super.toJSON());

    return projectSerialization;
  }

  createModel(base?: Partial<Package>): Package {
    if (this.model) {
      throw new Error('Model already defined');
    }

    this.model = new Package({ ...base, container: null, project: this });
    return this.model;
  }

  lock(): void {
    throw new Error('Unimplemented method');
  }

  unlock(): void {
    throw new Error('Unimplemented method');
  }

  getClassesByNature(): Class[] {
    throw new Error('Method unimplemented!');
  }
}
