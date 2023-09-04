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
  getAttributesByStereotype(stereotypes: PropertyStereotype[]): Property[] {
    return this.project.attributes
      .filter(a => a.hasStereotype())
      .filter(a => stereotypes.includes(a.stereotype!));
  }

  /**
   *
   * @returns all classes contained in the project whose stereotype is included in {@link stereotypes}.
   */
  getClassesByStereotype(stereotypes: ClassStereotype[]): Class[] {
    return this.project.classes
      .filter(c => c.hasStereotype())
      .filter(c => stereotypes.includes(c.stereotype!));
  }

  /**
   *
   * @returns all binary relations contained in the project whose stereotype is included in {@link stereotypes}.
   */
  getBinaryRelationsByStereotype(
    stereotypes: RelationStereotype[]
  ): BinaryRelation[] {
    return this.project.binaryRelations
      .filter(r => r.hasStereotype())
      .filter(r => stereotypes.includes(r.stereotype!));
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «type».
   */
  getTypes(): Class[] {
    return this.project.classes.filter(c => c.isType());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «historicalRoles».
   */
  getHistoricalRoles(): Class[] {
    return this.project.classes.filter(c => c.isHistoricalRole());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «historicalRoleMixin».
   */
  getHistoricalRoleMixins(): Class[] {
    return this.project.classes.filter(c => c.isHistoricalRoleMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «event».
   */
  getEvents(): Class[] {
    return this.project.classes.filter(c => c.isEvent());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «situation».
   */
  getSituations(): Class[] {
    return this.project.classes.filter(c => c.isSituation());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «category».
   */
  getCategories(): Class[] {
    return this.project.classes.filter(c => c.isCategory());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «mixin».
   */
  getMixins(): Class[] {
    return this.project.classes.filter(c => c.isMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «roleMixin».
   */
  getRoleMixins(): Class[] {
    return this.project.classes.filter(c => c.isRoleMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «phaseMixin».
   */
  getPhaseMixins(): Class[] {
    return this.project.classes.filter(c => c.isPhaseMixin());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «kind».
   */
  getKinds(): Class[] {
    return this.project.classes.filter(c => c.isKind());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «collective».
   */
  getCollectives(): Class[] {
    return this.project.classes.filter(c => c.isCollective());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «quantity».
   */
  getQuantities(): Class[] {
    return this.project.classes.filter(c => c.isQuantity());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «relator».
   */
  getRelators(): Class[] {
    return this.project.classes.filter(c => c.isQuantity());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «quality».
   */
  getQualities(): Class[] {
    return this.project.classes.filter(c => c.isQuality());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «mode».
   */
  getModes(): Class[] {
    return this.project.classes.filter(c => c.isMode());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «subkind».
   */
  getSubkinds(): Class[] {
    return this.project.classes.filter(c => c.isSubkind());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «role».
   */
  getRoles(): Class[] {
    return this.project.classes.filter(c => c.isRole());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «phase».
   */
  getPhases(): Class[] {
    return this.project.classes.filter(c => c.isPhase());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «enumeration».
   */
  getEnumerations(): Class[] {
    return this.project.classes.filter(c => c.isEnumeration());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «datatype».
   */
  getDatatypes(): Class[] {
    return this.project.classes.filter(c => c.isDatatype());
  }

  /**
   *
   * @returns all classes contained in the package that are stereotyped as «abstract».
   */
  getAbstracts(): Class[] {
    return this.project.classes.filter(c => c.isAbstractStereotype());
  }

  /**
   *
   * @returns all classes in the project decorated with a sortal stereotype.
   * @see Class.isSortal
   */
  getSortals(): Class[] {
    return this.project.classes.filter(c => c.isSortal());
  }

  /**
   *
   * @returns all classes in the project decorated with a non-sortal stereotype.
   * @see Class.isNonSortal
   */
  getNonSortals(): Class[] {
    return this.project.classes.filter(c => c.isNonSortal());
  }

  /**
   *
   * @returns all classes in the project decorated with an anti-rigid stereotype.
   * @see Class.isAntiRigid
   */
  getAntiRigidTypes(): Class[] {
    return this.project.classes.filter(c => c.isAntiRigid());
  }

  /**
   *
   * @returns all classes in the project decorated with a semi-rigid stereotype.
   * @see Class.isSemiRigid
   */
  getSemiRigidTypes(): Class[] {
    return this.project.classes.filter(c => c.isSemiRigid());
  }

  /**
   *
   * @returns all classes in the project decorated with a rigid stereotype.
   * @see Class.isRigid
   */
  getRigidTypes(): Class[] {
    return this.project.classes.filter(c => c.isRigid());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.FUNCTIONAL_COMPLEX}.
   */
  getFunctionalComplexTypes(): Class[] {
    return this.project.classes.filter(c => c.isFunctionalComplexType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.COLLECTIVE}.
   */
  getCollectiveTypes(): Class[] {
    return this.project.classes.filter(c => c.isCollectiveType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.QUANTITY}.
   */
  getQuantityTypes(): Class[] {
    return this.project.classes.filter(c => c.isQuantityType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes {@link Nature.INTRINSIC_MODE} and/or {@link Nature.EXTRINSIC_MODE} .
   */
  getModeTypes(): Class[] {
    return this.project.classes.filter(c => c.isMode());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.INTRINSIC_MODE}.
   */
  getInstricModeTypes(): Class[] {
    return this.project.classes.filter(c => c.isIntrinsicModeType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.EXTRINSIC_MODE}.
   */
  getExtrinsicModeTypes(): Class[] {
    return this.project.classes.filter(c => c.isExtrinsicModeType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.QUALITY}.
   */
  getQualityTypes(): Class[] {
    return this.project.classes.filter(c => c.isQualityType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.RELATOR}.
   */
  getRelatorTypes(): Class[] {
    return this.project.classes.filter(c => c.isRelator());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.TYPE}.
   */
  getHighOrderTypes(): Class[] {
    return this.project.classes.filter(c => c.isHighOrderType());
  }

  /**
   *
   * @returns all classes whose field `restrictedTo` includes only {@link Nature.EVENT}.
   */
  getEventTypes(): Class[] {
    return this.project.classes.filter(c => c.isEventType());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «bringsAbout».
   */
  getBringsAboutRelation(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isBringsAbout());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «characterization».
   */
  getCharacterizations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isCharacterization());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «».
   */
  getComparatives(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isComparative());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «componentOf».
   */
  getComponentOfRelations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isComponentOf());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «creation».
   */
  getCreations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isCreation());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «derivation».
   */
  getDerivations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isDerivation());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «externalDependence».
   */
  getExternalDependencies(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isExternalDependence());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «historicalDependence».
   */
  getHistoricalDependencies(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isHistoricalDependence());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «instantiation».
   */
  getInstantiations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isInstantiation());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «manifestation».
   */
  getManifestations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isManifestation());
  }

  /**
   *
   * @returns all relations in the project stereotyped as «material».
   */
  getMaterialRelations(): Relation[] {
    return this.project.relations.filter(r => r.isMaterial());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «mediation».
   */
  getMediations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isMediation());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «memberOf».
   */
  getMemberOfs(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isMemberOf());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «participation».
   */
  getParticipations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isParticipation());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «participational».
   */
  getParticipationals(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isParticipational());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «subCollectionOf».
   */
  getSubCollectionOfs(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isSubCollectionOf());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «subQuantityOf».
   */
  getSubQuantityOfs(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isSubQuantityOf());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «termination».
   */
  getTerminations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isTermination());
  }

  /**
   *
   * @returns all binary relations in the project stereotyped as «triggers».
   */
  getTriggersRelations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isTriggers());
  }
}
