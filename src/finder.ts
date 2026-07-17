import {
  BinaryRelation,
  Class,
  ModelElement,
  Nature,
  Property,
  Relation,
  ClassStereotype,
  PropertyStereotype,
  RelationStereotype,
  Project
} from '.';

/**
 * A query helper that retrieves the elements of a {@link Project} by their
 * OntoUML stereotypes and other classification criteria. For example, it can
 * list all classes stereotyped as «kind», all rigid types, or all «mediation»
 * relations in the project.
 *
 * Every project exposes an instance of this class through its `finder` field.
 *
 * @example
 * ```typescript
 * const kinds = project.finder.getKinds();
 * const rigidTypes = project.finder.getRigidTypes();
 * const mediations = project.finder.getMediations();
 * ```
 */
export class Finder {
  /** The project whose elements this finder queries. */
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  /**
   * Returns a plain object representation of this finder, identifying its
   * project by id, suitable for `JSON.stringify`.
   */
  toJSON(): any {
    return { type: 'Finder', project: this.project.id };
  }

  /**
   * Retrieves all model elements contained in the project.
   */
  getModelElements(): ModelElement[] {
    return this.project
      .getContents()
      .filter(e => e instanceof ModelElement) as ModelElement[];
  }

  /**
   * Retrieves all attributes in the project whose stereotype is included in
   * `stereotypes`.
   *
   * @param stereotypes - the property stereotypes to filter by.
   */
  getAttributesByStereotype(stereotypes: PropertyStereotype[]): Property[] {
    return this.project.attributes
      .filter(a => a.hasStereotype())
      .filter(a => stereotypes.includes(a.stereotype!));
  }

  /**
   * Retrieves all classes in the project whose stereotype is included in
   * `stereotypes`.
   *
   * @param stereotypes - the class stereotypes to filter by.
   */
  getClassesByStereotype(stereotypes: ClassStereotype[]): Class[] {
    return this.project.classes
      .filter(c => c.hasStereotype())
      .filter(c => stereotypes.includes(c.stereotype!));
  }

  /**
   * Retrieves all binary relations in the project whose stereotype is
   * included in `stereotypes`.
   *
   * @param stereotypes - the relation stereotypes to filter by.
   */
  getBinaryRelationsByStereotype(
    stereotypes: RelationStereotype[]
  ): BinaryRelation[] {
    return this.project.binaryRelations
      .filter(r => r.hasStereotype())
      .filter(r => stereotypes.includes(r.stereotype!));
  }

  /**
   * Retrieves all classes in the project stereotyped as «type».
   */
  getTypes(): Class[] {
    return this.project.classes.filter(c => c.isType());
  }

  /**
   * Retrieves all classes in the project stereotyped as «historicalRole».
   */
  getHistoricalRoles(): Class[] {
    return this.project.classes.filter(c => c.isHistoricalRole());
  }

  /**
   * Retrieves all classes in the project stereotyped as
   * «historicalRoleMixin».
   */
  getHistoricalRoleMixins(): Class[] {
    return this.project.classes.filter(c => c.isHistoricalRoleMixin());
  }

  /**
   * Retrieves all classes in the project stereotyped as «event».
   */
  getEvents(): Class[] {
    return this.project.classes.filter(c => c.isEvent());
  }

  /**
   * Retrieves all classes in the project stereotyped as «situation».
   */
  getSituations(): Class[] {
    return this.project.classes.filter(c => c.isSituation());
  }

  /**
   * Retrieves all classes in the project stereotyped as «category».
   */
  getCategories(): Class[] {
    return this.project.classes.filter(c => c.isCategory());
  }

  /**
   * Retrieves all classes in the project stereotyped as «mixin».
   */
  getMixins(): Class[] {
    return this.project.classes.filter(c => c.isMixin());
  }

  /**
   * Retrieves all classes in the project stereotyped as «roleMixin».
   */
  getRoleMixins(): Class[] {
    return this.project.classes.filter(c => c.isRoleMixin());
  }

  /**
   * Retrieves all classes in the project stereotyped as «phaseMixin».
   */
  getPhaseMixins(): Class[] {
    return this.project.classes.filter(c => c.isPhaseMixin());
  }

  /**
   * Retrieves all classes in the project stereotyped as «kind».
   */
  getKinds(): Class[] {
    return this.project.classes.filter(c => c.isKind());
  }

  /**
   * Retrieves all classes in the project stereotyped as «collective».
   */
  getCollectives(): Class[] {
    return this.project.classes.filter(c => c.isCollective());
  }

  /**
   * Retrieves all classes in the project stereotyped as «quantity».
   */
  getQuantities(): Class[] {
    return this.project.classes.filter(c => c.isQuantity());
  }

  /**
   * Retrieves all classes in the project stereotyped as «relator».
   */
  getRelators(): Class[] {
    return this.project.classes.filter(c => c.isRelator());
  }

  /**
   * Retrieves all classes in the project stereotyped as «quality».
   */
  getQualities(): Class[] {
    return this.project.classes.filter(c => c.isQuality());
  }

  /**
   * Retrieves all classes in the project stereotyped as «mode».
   */
  getModes(): Class[] {
    return this.project.classes.filter(c => c.isMode());
  }

  /**
   * Retrieves all classes in the project stereotyped as «subkind».
   */
  getSubkinds(): Class[] {
    return this.project.classes.filter(c => c.isSubkind());
  }

  /**
   * Retrieves all classes in the project stereotyped as «role».
   */
  getRoles(): Class[] {
    return this.project.classes.filter(c => c.isRole());
  }

  /**
   * Retrieves all classes in the project stereotyped as «phase».
   */
  getPhases(): Class[] {
    return this.project.classes.filter(c => c.isPhase());
  }

  /**
   * Retrieves all classes in the project stereotyped as «enumeration».
   */
  getEnumerations(): Class[] {
    return this.project.classes.filter(c => c.isEnumeration());
  }

  /**
   * Retrieves all classes in the project stereotyped as «datatype».
   */
  getDatatypes(): Class[] {
    return this.project.classes.filter(c => c.isDatatype());
  }

  /**
   * Retrieves all classes in the project stereotyped as «abstract».
   */
  getAbstracts(): Class[] {
    return this.project.classes.filter(c => c.isAbstractStereotype());
  }

  /**
   * Retrieves all classes in the project decorated with a sortal stereotype,
   * i.e., a stereotype that carries or supplies an identity principle to the
   * instances of the class.
   *
   * @see Class.isSortal
   */
  getSortals(): Class[] {
    return this.project.classes.filter(c => c.isSortal());
  }

  /**
   * Retrieves all classes in the project decorated with a non-sortal
   * stereotype, i.e., a stereotype that classifies instances with different
   * identity principles.
   *
   * @see Class.isNonSortal
   */
  getNonSortals(): Class[] {
    return this.project.classes.filter(c => c.isNonSortal());
  }

  /**
   * Retrieves all classes in the project decorated with an anti-rigid
   * stereotype, i.e., a stereotype of classes whose instances can cease to be
   * instances of them (e.g., «role», «phase»).
   *
   * @see Class.isAntiRigid
   */
  getAntiRigidTypes(): Class[] {
    return this.project.classes.filter(c => c.isAntiRigid());
  }

  /**
   * Retrieves all classes in the project decorated with a semi-rigid
   * stereotype, i.e., a stereotype of classes that apply necessarily to some
   * of their instances and contingently to others (e.g., «mixin»).
   *
   * @see Class.isSemiRigid
   */
  getSemiRigidTypes(): Class[] {
    return this.project.classes.filter(c => c.isSemiRigid());
  }

  /**
   * Retrieves all classes in the project decorated with a rigid stereotype,
   * i.e., a stereotype of classes whose instances cannot cease to be
   * instances of them (e.g., «kind», «subkind», «category»).
   *
   * @see Class.isRigid
   */
  getRigidTypes(): Class[] {
    return this.project.classes.filter(c => c.isRigid());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.FUNCTIONAL_COMPLEX} only.
   */
  getFunctionalComplexTypes(): Class[] {
    return this.project.classes.filter(c => c.isFunctionalComplexType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.COLLECTIVE} only.
   */
  getCollectiveTypes(): Class[] {
    return this.project.classes.filter(c => c.isCollectiveType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.QUANTITY} only.
   */
  getQuantityTypes(): Class[] {
    return this.project.classes.filter(c => c.isQuantityType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.INTRINSIC_MODE} and/or {@link Nature.EXTRINSIC_MODE} only.
   */
  getModeTypes(): Class[] {
    return this.project.classes.filter(c =>
      c.allowsOnly([Nature.INTRINSIC_MODE, Nature.EXTRINSIC_MODE])
    );
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.INTRINSIC_MODE} only.
   */
  getIntrinsicModeTypes(): Class[] {
    return this.project.classes.filter(c => c.isIntrinsicModeType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.EXTRINSIC_MODE} only.
   */
  getExtrinsicModeTypes(): Class[] {
    return this.project.classes.filter(c => c.isExtrinsicModeType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.QUALITY} only.
   */
  getQualityTypes(): Class[] {
    return this.project.classes.filter(c => c.isQualityType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.RELATOR} only.
   */
  getRelatorTypes(): Class[] {
    return this.project.classes.filter(c => c.isRelatorType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.TYPE} only, i.e., high-order types whose instances are
   * themselves types.
   */
  getHighOrderTypes(): Class[] {
    return this.project.classes.filter(c => c.isHighOrderType());
  }

  /**
   * Retrieves all classes in the project whose instances are restricted to
   * {@link Nature.EVENT} only.
   */
  getEventTypes(): Class[] {
    return this.project.classes.filter(c => c.isEventType());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «bringsAbout».
   */
  getBringsAboutRelation(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isBringsAbout());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «characterization».
   */
  getCharacterizations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isCharacterization());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «comparative».
   */
  getComparatives(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isComparative());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «componentOf».
   */
  getComponentOfRelations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isComponentOf());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as «creation».
   */
  getCreations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isCreation());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «derivation».
   */
  getDerivations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isDerivation());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «externalDependence».
   */
  getExternalDependencies(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isExternalDependence());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «historicalDependence».
   */
  getHistoricalDependencies(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isHistoricalDependence());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «instantiation».
   */
  getInstantiations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isInstantiation());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «manifestation».
   */
  getManifestations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isManifestation());
  }

  /**
   * Retrieves all relations in the project stereotyped as «material»,
   * whether binary or n-ary.
   */
  getMaterialRelations(): Relation[] {
    return this.project.relations.filter(r => r.isMaterial());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as «mediation».
   */
  getMediations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isMediation());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as «memberOf».
   */
  getMemberOfs(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isMemberOf());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «participation».
   */
  getParticipations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isParticipation());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «participational».
   */
  getParticipationals(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isParticipational());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «subCollectionOf».
   */
  getSubCollectionOfs(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isSubCollectionOf());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «subQuantityOf».
   */
  getSubQuantityOfs(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isSubQuantityOf());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as
   * «termination».
   */
  getTerminations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isTermination());
  }

  /**
   * Retrieves all binary relations in the project stereotyped as «triggers».
   */
  getTriggersRelations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.isTriggers());
  }
}
