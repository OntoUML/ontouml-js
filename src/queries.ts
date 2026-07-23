import { Nature } from './model/natures';
import type {
  BinaryRelation,
  Class,
  ClassStereotype,
  ModelElement,
  Property,
  PropertyStereotype,
  Relation,
  RelationStereotype
} from '.';

/**
 * A mixin that adds convenience queries for retrieving model elements by their
 * OntoUML stereotypes and other classification criteria. For example, it lists
 * all classes stereotyped as «kind», all rigid types, or all «mediation»
 * relations.
 *
 * The mixin is applied to both {@link Project} and {@link Package}, so the same
 * query methods are available at either scope: on a project they range over the
 * whole model, and on a package they range over that package and its
 * subpackages. Concrete hosts supply the collections to be queried through the
 * `queryable*` scope providers.
 *
 * @example
 * ```typescript
 * const kinds = project.getKinds();       // «kind»s in the whole model
 * const localKinds = somePackage.getKinds(); // «kind»s in this package's subtree
 * const rigidTypes = project.getRigidTypes();
 * const mediations = project.getMediations();
 * ```
 */
export abstract class Queries {
  /** The classes in scope: the whole project, or a package's subtree. */
  protected abstract queryableClasses(): Class[];

  /** The binary relations in scope. */
  protected abstract queryableBinaryRelations(): BinaryRelation[];

  /** The relations in scope, both binary and n-ary. */
  protected abstract queryableRelations(): Relation[];

  /** The attributes in scope. */
  protected abstract queryableAttributes(): Property[];

  /** The model elements in scope. */
  protected abstract queryableModelElements(): ModelElement[];

  /**
   * Retrieves all model elements in scope.
   */
  getModelElements(): ModelElement[] {
    return this.queryableModelElements();
  }

  /**
   * Retrieves all attributes in scope whose stereotype is included in
   * `stereotypes`.
   *
   * @param stereotypes - the property stereotypes to filter by.
   */
  getAttributesByStereotype(stereotypes: PropertyStereotype[]): Property[] {
    return this.queryableAttributes()
      .filter(a => a.hasStereotype())
      .filter(a => stereotypes.includes(a.stereotype!));
  }

  /**
   * Retrieves all classes in scope whose stereotype is included in
   * `stereotypes`.
   *
   * @param stereotypes - the class stereotypes to filter by.
   */
  getClassesByStereotype(stereotypes: ClassStereotype[]): Class[] {
    return this.queryableClasses()
      .filter(c => c.hasStereotype())
      .filter(c => stereotypes.includes(c.stereotype!));
  }

  /**
   * Retrieves all binary relations in scope whose stereotype is included in
   * `stereotypes`.
   *
   * @param stereotypes - the relation stereotypes to filter by.
   */
  getBinaryRelationsByStereotype(
    stereotypes: RelationStereotype[]
  ): BinaryRelation[] {
    return this.queryableBinaryRelations()
      .filter(r => r.hasStereotype())
      .filter(r => stereotypes.includes(r.stereotype!));
  }

  /**
   * Retrieves all classes in scope stereotyped as «type».
   */
  getTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isType());
  }

  /**
   * Retrieves all classes in scope stereotyped as «historicalRole».
   */
  getHistoricalRoles(): Class[] {
    return this.queryableClasses().filter(c => c.isHistoricalRole());
  }

  /**
   * Retrieves all classes in scope stereotyped as «historicalRoleMixin».
   */
  getHistoricalRoleMixins(): Class[] {
    return this.queryableClasses().filter(c => c.isHistoricalRoleMixin());
  }

  /**
   * Retrieves all classes in scope stereotyped as «event».
   */
  getEvents(): Class[] {
    return this.queryableClasses().filter(c => c.isEvent());
  }

  /**
   * Retrieves all classes in scope stereotyped as «situation».
   */
  getSituations(): Class[] {
    return this.queryableClasses().filter(c => c.isSituation());
  }

  /**
   * Retrieves all classes in scope stereotyped as «category».
   */
  getCategories(): Class[] {
    return this.queryableClasses().filter(c => c.isCategory());
  }

  /**
   * Retrieves all classes in scope stereotyped as «mixin».
   */
  getMixins(): Class[] {
    return this.queryableClasses().filter(c => c.isMixin());
  }

  /**
   * Retrieves all classes in scope stereotyped as «roleMixin».
   */
  getRoleMixins(): Class[] {
    return this.queryableClasses().filter(c => c.isRoleMixin());
  }

  /**
   * Retrieves all classes in scope stereotyped as «phaseMixin».
   */
  getPhaseMixins(): Class[] {
    return this.queryableClasses().filter(c => c.isPhaseMixin());
  }

  /**
   * Retrieves all classes in scope stereotyped as «kind».
   */
  getKinds(): Class[] {
    return this.queryableClasses().filter(c => c.isKind());
  }

  /**
   * Retrieves all classes in scope stereotyped as «collective».
   */
  getCollectives(): Class[] {
    return this.queryableClasses().filter(c => c.isCollective());
  }

  /**
   * Retrieves all classes in scope stereotyped as «quantity».
   */
  getQuantities(): Class[] {
    return this.queryableClasses().filter(c => c.isQuantity());
  }

  /**
   * Retrieves all classes in scope stereotyped as «relator».
   */
  getRelators(): Class[] {
    return this.queryableClasses().filter(c => c.isRelator());
  }

  /**
   * Retrieves all classes in scope stereotyped as «quality».
   */
  getQualities(): Class[] {
    return this.queryableClasses().filter(c => c.isQuality());
  }

  /**
   * Retrieves all classes in scope stereotyped as «mode».
   */
  getModes(): Class[] {
    return this.queryableClasses().filter(c => c.isMode());
  }

  /**
   * Retrieves all classes in scope stereotyped as «subkind».
   */
  getSubkinds(): Class[] {
    return this.queryableClasses().filter(c => c.isSubkind());
  }

  /**
   * Retrieves all classes in scope stereotyped as «role».
   */
  getRoles(): Class[] {
    return this.queryableClasses().filter(c => c.isRole());
  }

  /**
   * Retrieves all classes in scope stereotyped as «phase».
   */
  getPhases(): Class[] {
    return this.queryableClasses().filter(c => c.isPhase());
  }

  /**
   * Retrieves all classes in scope stereotyped as «enumeration».
   */
  getEnumerations(): Class[] {
    return this.queryableClasses().filter(c => c.isEnumeration());
  }

  /**
   * Retrieves all classes in scope stereotyped as «datatype».
   */
  getDatatypes(): Class[] {
    return this.queryableClasses().filter(c => c.isDatatype());
  }

  /**
   * Retrieves all classes in scope stereotyped as «abstract».
   */
  getAbstracts(): Class[] {
    return this.queryableClasses().filter(c => c.isAbstractStereotype());
  }

  /**
   * Retrieves all classes in scope decorated with a sortal stereotype, i.e., a
   * stereotype that carries or supplies an identity principle to the instances
   * of the class.
   *
   * @see Class.isSortal
   */
  getSortals(): Class[] {
    return this.queryableClasses().filter(c => c.isSortal());
  }

  /**
   * Retrieves all classes in scope decorated with a non-sortal stereotype,
   * i.e., a stereotype that classifies instances with different identity
   * principles.
   *
   * @see Class.isNonSortal
   */
  getNonSortals(): Class[] {
    return this.queryableClasses().filter(c => c.isNonSortal());
  }

  /**
   * Retrieves all classes in scope decorated with an anti-rigid stereotype,
   * i.e., a stereotype of classes whose instances can cease to be instances of
   * them (e.g., «role», «phase»).
   *
   * @see Class.isAntiRigid
   */
  getAntiRigidTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isAntiRigid());
  }

  /**
   * Retrieves all classes in scope decorated with a semi-rigid stereotype,
   * i.e., a stereotype of classes that apply necessarily to some of their
   * instances and contingently to others (e.g., «mixin»).
   *
   * @see Class.isSemiRigid
   */
  getSemiRigidTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isSemiRigid());
  }

  /**
   * Retrieves all classes in scope decorated with a rigid stereotype, i.e., a
   * stereotype of classes whose instances cannot cease to be instances of them
   * (e.g., «kind», «subkind», «category»).
   *
   * @see Class.isRigid
   */
  getRigidTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isRigid());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.FUNCTIONAL_COMPLEX} only.
   */
  getFunctionalComplexTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isFunctionalComplexType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.COLLECTIVE} only.
   */
  getCollectiveTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isCollectiveType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.QUANTITY} only.
   */
  getQuantityTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isQuantityType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.INTRINSIC_MODE} and/or {@link Nature.EXTRINSIC_MODE} only.
   */
  getModeTypes(): Class[] {
    return this.queryableClasses().filter(c =>
      c.allowsOnly([Nature.INTRINSIC_MODE, Nature.EXTRINSIC_MODE])
    );
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.INTRINSIC_MODE} only.
   */
  getIntrinsicModeTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isIntrinsicModeType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.EXTRINSIC_MODE} only.
   */
  getExtrinsicModeTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isExtrinsicModeType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.QUALITY} only.
   */
  getQualityTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isQualityType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.RELATOR} only.
   */
  getRelatorTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isRelatorType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.TYPE} only, i.e., high-order types whose instances are
   * themselves types.
   */
  getHighOrderTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isHighOrderType());
  }

  /**
   * Retrieves all classes in scope whose instances are restricted to
   * {@link Nature.EVENT} only.
   */
  getEventTypes(): Class[] {
    return this.queryableClasses().filter(c => c.isEventType());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «bringsAbout».
   */
  getBringsAboutRelation(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isBringsAbout());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «characterization».
   */
  getCharacterizations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isCharacterization());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «comparative».
   */
  getComparatives(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isComparative());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «componentOf».
   */
  getComponentOfRelations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isComponentOf());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «creation».
   */
  getCreations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isCreation());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «derivation».
   */
  getDerivations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isDerivation());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as
   * «externalDependence».
   */
  getExternalDependencies(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r =>
      r.isExternalDependence()
    );
  }

  /**
   * Retrieves all binary relations in scope stereotyped as
   * «historicalDependence».
   */
  getHistoricalDependencies(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r =>
      r.isHistoricalDependence()
    );
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «instantiation».
   */
  getInstantiations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isInstantiation());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «manifestation».
   */
  getManifestations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isManifestation());
  }

  /**
   * Retrieves all relations in scope stereotyped as «material», whether binary
   * or n-ary.
   */
  getMaterialRelations(): Relation[] {
    return this.queryableRelations().filter(r => r.isMaterial());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «mediation».
   */
  getMediations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isMediation());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «memberOf».
   */
  getMemberOfs(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isMemberOf());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «participation».
   */
  getParticipations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isParticipation());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «participational».
   */
  getParticipationals(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isParticipational());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «subCollectionOf».
   */
  getSubCollectionOfs(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isSubCollectionOf());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «subQuantityOf».
   */
  getSubQuantityOfs(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isSubQuantityOf());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «termination».
   */
  getTerminations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isTermination());
  }

  /**
   * Retrieves all binary relations in scope stereotyped as «triggers».
   */
  getTriggersRelations(): BinaryRelation[] {
    return this.queryableBinaryRelations().filter(r => r.isTriggers());
  }
}

/**
 * Copies the concrete method implementations of each mixin constructor onto the
 * prototype of `derivedCtor`, realizing at runtime the members that were merged
 * into `derivedCtor`'s type via interface declaration merging. Abstract members
 * are not present on the mixin prototype and are therefore left for the host
 * class to implement.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 */
export function applyMixins(derivedCtor: any, constructors: any[]): void {
  constructors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name === 'constructor') {
        return;
      }

      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(
          baseCtor.prototype,
          name
        ) as PropertyDescriptor
      );
    });
  });
}
