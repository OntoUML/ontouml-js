import {
  BinaryRelation,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  NaryRelation,
  Nature,
  Package,
  Property,
  Relation,
  ClassStereotype,
  PropertyStereotype,
  RelationStereotype,
  OntoumlElement,
  Project
} from '.';

export class Finder {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  getElementById(id: String): OntoumlElement {
    return this.project.getAllContents().filter(e => e.id === id)?.[0];
  }

  getClassById(id: String): Class {
    return this.getClasses().filter(e => e.id === id)?.[0];
  }

  getRelationById(id: String): Relation {
    return this.getRelations().filter(e => e.id === id)?.[0];
  }

  getPropertyById(id: String): Property {
    return this.getProperties().filter(e => e.id === id)?.[0];
  }

  getGeneralizationById(id: String): Generalization {
    return this.getGeneralizations().filter(e => e.id === id)?.[0];
  }

  getGeneralizationSetById(id: String): GeneralizationSet {
    return this.getGeneralizationSets().filter(e => e.id === id)?.[0];
  }

  getPackageById(id: String): Package {
    return this.getPackages().filter(e => e.id === id)?.[0];
  }

  /**
   * @returns all the properties contained in the project. That is, the ends of all relations and the attributes of all classes.
   */
  getProperties(): Property[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof Property) as Property[];
  }

  /**
   *
   * @returns the attributes of all classes contained in the project.
   */
  getAttributes(): Property[] {
    return this.getProperties().filter(p => p.isAttribute());
  }

  /**
   *
   * @returns the ends of all relations contained in the project.
   */
  getRelationEnds(): Property[] {
    return this.getProperties().filter(p => p.isRelationEnd());
  }

  /**
   *
   * @returns all relations contained in the project.
   */
  getRelations(): Relation[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof Relation) as Relation[];
  }

  /**
   *
   * @returns all binary relations contained in the project.
   */
  getBinaryRelations(): BinaryRelation[] {
    return this.getRelations().filter(e => e.isBinary()) as BinaryRelation[];
  }

  /**
   *
   * @returns all n-ary relations contained in the project.
   */
  getNaryRelations(): NaryRelation[] {
    return this.getRelations().filter(e => e.isNary()) as NaryRelation[];
  }

  /**
   *
   * @returns all generalizations contained in the project.
   */
  getGeneralizations(): Generalization[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof Generalization) as Generalization[];
  }

  /**
   *
   * @returns all generalization sets contained in the project.
   */
  getGeneralizationSets(): GeneralizationSet[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof GeneralizationSet) as GeneralizationSet[];
  }

  /**
   *
   * @returns all packages contained in the project.
   */
  getPackages(): Package[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof Package) as Package[];
  }

  /**
   *
   * @returns all classes contained in the project.
   */
  getClasses(): Class[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof Class) as Class[];
  }

  /**
   *
   * @returns the literals of all enumerations contained in the project.
   */
  getLiterals(): Literal[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof Literal) as Literal[];
  }

  /**
   *
   * @returns all model elements contained in the project.
   */
  getModelElements(): ModelElement[] {
    return this.project
      .getAllContents()
      .filter(e => e instanceof ModelElement) as ModelElement[];
  }

  /**
   *
   * @returns all attributes contained in the project whose stereotype is included in {@link stereotypes}.
   */
  getAttributesByStereotype(
    stereotypes: readonly PropertyStereotype[]
  ): Property[] {
    return this.getAttributes()
      .filter(a => a.hasStereotype())
      .filter(a => stereotypes.includes(a.stereotype!));
  }

  /**
   *
   * @returns all classes contained in the project whose stereotype is included in {@link stereotypes}.
   */
  getClassesByStereotype(stereotypes: readonly ClassStereotype[]): Class[] {
    this.getAttributesByStereotype;
    return this.getClasses()
      .filter(c => c.hasStereotype())
      .filter(c => stereotypes.includes(c.stereotype!));
  }

  /**
   *
   * @returns all relations contained in the project whose stereotype is included in {@link stereotypes}.
   */
  getRelationsByStereotype(
    stereotypes: readonly RelationStereotype[]
  ): Relation[] {
    return this.getRelations()
      .filter(r => r.hasStereotype())
      .filter(r => stereotypes.includes(r.stereotype!));
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «type».
   */
  getTypes(): Class[] {
    return this.getClasses().filter(c => c.isType());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «historicalRoles».
   */
  getHistoricalRoles(): Class[] {
    return this.getClasses().filter(c => c.isHistoricalRole());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «historicalRoleMixin».
   */
  getHistoricalRoleMixins(): Class[] {
    return this.getClasses().filter(c => c.isHistoricalRoleMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «event».
   */
  getEvents(): Class[] {
    return this.getClasses().filter(c => c.isEvent());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «situation».
   */
  getSituations(): Class[] {
    return this.getClasses().filter(c => c.isSituation());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «category».
   */
  getCategories(): Class[] {
    return this.getClasses().filter(c => c.isCategory());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «mixin».
   */
  getMixins(): Class[] {
    return this.getClasses().filter(c => c.isMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «roleMixin».
   */
  getRoleMixins(): Class[] {
    return this.getClasses().filter(c => c.isRoleMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «phaseMixin».
   */
  getPhaseMixins(): Class[] {
    return this.getClasses().filter(c => c.isPhaseMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «kind».
   */
  getKinds(): Class[] {
    return this.getClasses().filter(c => c.isKind());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «collective».
   */
  getCollectives(): Class[] {
    return this.getClasses().filter(c => c.isCollective());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «quantity».
   */
  getQuantities(): Class[] {
    return this.getClasses().filter(c => c.isQuantity());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «relator».
   */
  getRelators(): Class[] {
    return this.getClasses().filter(c => c.isQuantity());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «quality».
   */
  getQualities(): Class[] {
    return this.getClasses().filter(c => c.isQuality());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «mode».
   */
  getModes(): Class[] {
    return this.getClasses().filter(c => c.isMode());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «subkind».
   */
  getSubkinds(): Class[] {
    return this.getClasses().filter(c => c.isSubkind());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «role».
   */
  getRoles(): Class[] {
    return this.getClasses().filter(c => c.isRole());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «phase».
   */
  getPhases(): Class[] {
    return this.getClasses().filter(c => c.isPhase());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «enumeration».
   */
  getEnumerations(): Class[] {
    return this.getClasses().filter(c => c.isEnumeration());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «datatype».
   */
  getDatatypes(): Class[] {
    return this.getClasses().filter(c => c.isDatatype());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «abstract».
   */
  getAbstracts(): Class[] {
    return this.getClasses().filter(c => c.isAbstractStereotype());
  }

  /**
   *
   * @returns all classes in the project decorated with a sortal stereotype.
   * @see Class.isSortal
   */
  getSortals(): Class[] {
    return this.getClasses().filter(c => c.isSortal());
  }

  /**
   *
   * @returns all classes in the project decorated with a non-sortal stereotype.
   * @see Class.isNonSortal
   */
  getNonSortals(): Class[] {
    return this.getClasses().filter(c => c.isNonSortal());
  }

  /**
   *
   * @returns all classes in the project decorated with an anti-rigid stereotype.
   * @see Class.isAntiRigid
   */
  getAntiRigidTypes(): Class[] {
    return this.getClasses().filter(c => c.isAntiRigid());
  }

  /**
   *
   * @returns all classes in the project decorated with a semi-rigid stereotype.
   * @see Class.isSemiRigid
   */
  getSemiRigidTypes(): Class[] {
    return this.getClasses().filter(c => c.isSemiRigid());
  }

  /**
   *
   * @returns all classes in the project decorated with a rigid stereotype.
   * @see Class.isRigid
   */
  getRigidTypes(): Class[] {
    return this.getClasses().filter(c => c.isRigid());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.FUNCTIONAL_COMPLEX}.
   */
  getFunctionalComplexTypes(): Class[] {
    return this.getClasses().filter(c => c.isFunctionalComplexType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.COLLECTIVE}.
   */
  getCollectiveTypes(): Class[] {
    return this.getClasses().filter(c => c.isCollectiveType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.QUANTITY}.
   */
  getQuantityTypes(): Class[] {
    return this.getClasses().filter(c => c.isQuantityType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes {@link Nature.INTRINSIC_MODE} and/or {@link Nature.EXTRINSIC_MODE} .
   */
  getModeTypes(): Class[] {
    return this.getClasses().filter(c => c.isMode());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.INTRINSIC_MODE}.
   */
  getInstricModeTypes(): Class[] {
    return this.getClasses().filter(c => c.isIntrinsicModeType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.EXTRINSIC_MODE}.
   */
  getExtrinsicModeTypes(): Class[] {
    return this.getClasses().filter(c => c.isExtrinsicModeType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.QUALITY}.
   */
  getQualityTypes(): Class[] {
    return this.getClasses().filter(c => c.isQualityType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.RELATOR}.
   */
  getRelatorTypes(): Class[] {
    return this.getClasses().filter(c => c.isRelator());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.TYPE}.
   */
  getHighOrderTypes(): Class[] {
    return this.getClasses().filter(c => c.isHighOrderType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.EVENT}.
   */
  getEventTypes(): Class[] {
    return this.getClasses().filter(c => c.isEventType());
  }

  getBringsAboutRelation(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isBringsAbout());
  }

  getCharacterizations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isCharacterization());
  }

  getComparatives(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isComparative());
  }

  getComponentOfRelations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isComponentOf());
  }

  getCreations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isCreation());
  }

  getDerivations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isDerivation());
  }

  getExternalDependencies(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isExternalDependence());
  }

  getHistoricalDependencies(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isHistoricalDependence());
  }

  getInstantiations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isInstantiation());
  }

  getManifestations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isManifestation());
  }

  getMaterialRelations(): Relation[] {
    return this.getRelations().filter(r => r.isMaterial());
  }

  getMediations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isMediation());
  }

  getMemberOfs(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isMemberOf());
  }

  getParticipations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isParticipation());
  }

  getParticipationals(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isParticipational());
  }

  getSubCollectionOfs(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isSubCollectionOf());
  }

  getSubQuantityOfs(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isSubQuantityOf());
  }

  getTerminations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isTermination());
  }

  getTriggersRelations(): BinaryRelation[] {
    return this.getBinaryRelations().filter(r => r.isTriggers());
  }
}
