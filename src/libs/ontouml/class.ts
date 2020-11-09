import { isEnumeration } from '@libs/ontouml2gufo/helper_functions';
import _ from 'lodash';
import {
  Relation,
  Property,
  Literal,
  Decoratable,
  getUniqueStereotype,
  hasValidStereotypeValue,
  Container,
  addContentToArray,
  getAllContents,
  getContents,
  ModelElement,
  setContainer,
  Package,
  Classifier,
  utils,
  stereotypes,
  natures,
  MultilingualText,
  ClassStereotype,
  OntologicalNature,
  Generalization,
  GeneralizationSet,
  getGeneralizationSetsInvolvingClassifier,
  getGeneralizationSetsWhereCategorizer,
  getGeneralizationSetsWhereGeneral,
  getGeneralizationSetsWhereSpecific,
  getGeneralizationsInvolvingClassifier,
  getGeneralizationsWhereGeneral,
  getGeneralizationsWhereSpecific,
  getParents,
  getChildren,
  getAncestors,
  getDescendants,
  getFilteredAncestors,
  getFilteredDescendants,
  hasStereotypeContainedIn,
  OntoumlType
} from './';

export class Class extends ModelElement
  implements Decoratable<ClassStereotype>, Container<Property | Literal, Property | Literal>, Classifier<Class> {
  container: Package;
  stereotypes: ClassStereotype[];
  restrictedTo: OntologicalNature[];
  literals: Literal[];
  properties: Property[];
  isAbstract: boolean;
  isDerived: boolean;
  isExtensional: boolean;
  isPowertype: boolean;
  order: string;

  constructor(base?: Partial<Class>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.CLASS_TYPE, enumerable: true });

    this.isAbstract = this.isAbstract || false;
    this.isDerived = this.isDerived || false;
    this.isExtensional = this.isExtensional || false;
    this.isPowertype = this.isPowertype || false;
    this.order = this.order || '1';
  }

  getGeneralizations(): Generalization[] {
    return getGeneralizationsInvolvingClassifier(this);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return getGeneralizationSetsInvolvingClassifier(this);
  }

  getGeneralizationsWhereGeneral(): Generalization[] {
    return getGeneralizationsWhereGeneral(this);
  }

  getGeneralizationsWhereSpecific(): Generalization[] {
    return getGeneralizationsWhereSpecific(this);
  }

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    return getGeneralizationSetsWhereGeneral(this);
  }

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    return getGeneralizationSetsWhereSpecific(this);
  }

  getGeneralizationSetsWhereCategorizer(): GeneralizationSet[] {
    return getGeneralizationSetsWhereCategorizer(this);
  }

  getParents(): Class[] {
    return getParents(this);
  }

  getChildren(): Class[] {
    return getChildren(this);
  }

  getAncestors(): Class[] {
    return getAncestors(this);
  }

  getDescendants(): Class[] {
    return getDescendants(this);
  }

  getFilteredAncestors(filter: (ancestor: Class) => boolean): Class[] {
    return getFilteredAncestors(this, filter);
  }

  getFilteredDescendants(filter: (descendent: Class) => boolean): Class[] {
    return getFilteredDescendants(this, filter);
  }

  getContents(contentsFilter?: (content: Property | Literal) => boolean): (Property | Literal)[] {
    return getContents(this, ['properties', 'literals'], contentsFilter);
  }

  getAllContents(contentsFilter?: (content: Property | Literal) => boolean): (Property | Literal)[] {
    return getAllContents(this, ['properties', 'literals'], contentsFilter);
  }

  hasValidStereotypeValue(): boolean {
    return hasValidStereotypeValue(this, stereotypes.ClassStereotypes);
  }

  getUniqueStereotype(): ClassStereotype {
    return getUniqueStereotype(this);
  }

  toJSON(): any {
    const classSerialization = {
      stereotypes: null,
      restrictedTo: null,
      properties: null,
      literals: null,
      isAbstract: false,
      isDerived: false,
      isExtensional: false,
      isPowertype: false,
      order: null
    };

    Object.assign(classSerialization, super.toJSON());

    return classSerialization;
  }

  createAttribute(propertyType: Class, name?: MultilingualText, base?: Partial<Property>): Property {
    if (this.hasEnumerationStereotype()) {
      throw new Error('Cannot create an attribute on an enumeration class.');
    }

    return addContentToArray<ModelElement, Property>(
      this,
      'properties',
      new Property(Object.assign({}, base, { propertyType, name, container: this, project: this.project }))
    );
  }

  createLiteral(name?: MultilingualText, base?: Partial<Literal>): Literal {
    if (!this.hasEnumerationStereotype()) {
      throw new Error('Cannot create a literal on a non-enumeration class.');
    }
    return addContentToArray<ModelElement, Literal>(
      this,
      'literals',
      new Literal(Object.assign({}, base, { name, container: this, project: this.project }))
    );
  }

  setContainer(container: Package): void {
    setContainer(this, container);
  }

  static areAbstract(classes: Class[]): boolean {
    return classes.every((_class: Class) => _class.isAbstract);
  }

  hasAttributes(): boolean {
    return !_.isEmpty(this.properties);
  }

  hasLiterals(): boolean {
    return !_.isEmpty(this.properties);
  }

  restrictedToOverlaps(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = Array.isArray(natures) ? natures : [natures];
    return utils.intersects(this.restrictedTo, naturesArray);
  }

  restrictedToContainedIn(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = Array.isArray(natures) ? natures : [natures];
    return utils.includesAll(naturesArray, this.restrictedTo);
  }

  restrictedToContains(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = Array.isArray(natures) ? natures : [natures];
    return utils.includesAll(this.restrictedTo, naturesArray);
  }

  restrictedToEquals(natures: OntologicalNature | []): boolean {
    const naturesArray: OntologicalNature[] = Array.isArray(natures) ? natures : [natures];
    return _.isEqual(this.restrictedTo, naturesArray);
  }

  isRestrictedToEndurant(): boolean {
    return this.restrictedToContainedIn(natures.EndurantNatures);
  }

  isRestrictedToSubstantial(): boolean {
    return this.restrictedToContainedIn(natures.SubstantialNatures);
  }

  isRestrictedToFunctionalComplex(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.functional_complex);
  }

  isRestrictedToCollective(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.collective);
  }

  isRestrictedToQuantity(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.quantity);
  }

  isRestrictedToMoment(): boolean {
    return this.restrictedToContainedIn(natures.MomentNatures);
  }

  isRestrictedToIntrinsicMoment(): boolean {
    return this.restrictedToContainedIn(natures.IntrinsicMomentNatures);
  }

  isRestrictedToExtrinsicMoment(): boolean {
    return this.restrictedToContainedIn(natures.ExtrinsicMomentNatures);
  }

  isRestrictedToRelator(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.relator);
  }

  isRestrictedToIntrinsicMode(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.intrinsic_mode);
  }

  isRestrictedToExtrinsicMode(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.extrinsic_mode);
  }

  isRestrictedToQuality(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.quality);
  }

  isRestrictedToEvent(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.event);
  }

  isRestrictedToSituation(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.situation);
  }

  isRestrictedToType(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.type);
  }

  isRestrictedToAbstract(): boolean {
    return this.restrictedToContainedIn(OntologicalNature.abstract);
  }

  hasStereotypeContainedIn(stereotypes: ClassStereotype | ClassStereotype[]): boolean {
    return hasStereotypeContainedIn(this, stereotypes);
  }

  hasTypeStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.TYPE);
  }

  hasEventStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.EVENT);
  }

  hasSituationStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.SITUATION);
  }

  hasAbstractStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.ABSTRACT);
  }

  hasDatatypeStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.DATATYPE);
  }

  hasEnumerationStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.ENUMERATION);
  }

  isComplexDatatype(): boolean {
    return this.hasDatatypeStereotype() && this.hasAttributes();
  }

  hasEndurantOnlyStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.EndurantStereotypes);
  }

  hasMomentOnlyStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.MomentOnlyStereotypes);
  }

  // TODO: explain substantial
  hasSubstantialOnlyStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.SubstantialOnlyStereotypes);
  }

  // TODO: expand support
  static haveRigidStereotypes(classes: Class[]): boolean {
    return classes.every((_class: Class) => _class.hasRigidStereotype());
  }

  hasRigidStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.RigidStereotypes);
  }

  hasSemiRigidStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.SemiRigidStereotypes);
  }

  hasAntiRigidStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.AntiRigidStereotypes);
  }

  hasNonSortalStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.NonSortalStereotypes);
  }

  hasSortalStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.SortalStereotypes);
  }

  hasUltimateSortalStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.UltimateSortalStereotypes);
  }

  hasBaseSortalStereotype(): boolean {
    return this.hasStereotypeContainedIn(stereotypes.BaseSortalStereotypes);
  }

  hasKindStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.KIND);
  }

  hasCollectiveStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.COLLECTIVE);
  }

  hasQuantityStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.QUANTITY);
  }

  hasRelatorStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.RELATOR);
  }

  hasQualityStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.QUALITY);
  }

  hasModeStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.MODE);
  }

  hasSubkindStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.SUBKIND);
  }

  hasPhaseStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.PHASE);
  }

  hasRoleStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.ROLE);
  }

  hasHistoricalRoleStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.HISTORICAL_ROLE);
  }

  hasCategoryStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.CATEGORY);
  }

  hasPhaseMixinStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.PHASE_MIXIN);
  }

  hasRoleMixinStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.ROLE_MIXIN);
  }

  hasHistoricalRoleMixinStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.HISTORICAL_ROLE_MIXIN);
  }

  hasMixinStereotype(): boolean {
    return this.hasStereotypeContainedIn(ClassStereotype.MIXIN);
  }

  getUltimateSortalAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasUltimateSortalStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getUltimateSortalsDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasUltimateSortalStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  /**
   * Returns not only ancestors and descendants, but also those reachable through non-disjoint diverging branch in generalization hierarchies
   */
  getUltimateSortalsInReach(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSortalAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasSortalStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getSortalDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasSortalStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  getBaseSortalAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasBaseSortalStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getBaseSortalDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasBaseSortalStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  getNonSortalAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasNonSortalStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getNonSortalDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasNonSortalStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  getRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasRigidStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasRigidStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  getSemiRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasSemiRigidStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getSemiRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasSemiRigidStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  getAntiRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasAntiRigidStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getAntiRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasAntiRigidStereotype();
    return this.getFilteredAncestors(descendantsFilter);
  }

  /** Returns both own attributes, excluding inherited ones */
  getOwnAttributes(): Property[] {
    if (!this.hasEnumerationStereotype()) {
      throw new Error('Cannot retrieve attributes from an enumeration.');
    }

    return this.properties ? [...this.properties] : [];
  }

  /** Returns both own and inherited attributes */
  getAllAttributes(): Property[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allAttributes = thisAndAncestors.reduce((attributesAcc: Property[], _class: Class) => {
      attributesAcc.push(..._class.getOwnAttributes());
      return attributesAcc;
    }, []);

    return allAttributes;
  }

  /** Returns both own literals, excluding inherited ones */
  getOwnLiterals(): Literal[] {
    if (this.hasEnumerationStereotype()) {
      throw new Error('Cannot retrieve literals from a non-enumeration.');
    }

    return this.literals ? [...this.literals] : [];
  }

  /** Returns both own and inherited literals */
  getAllLiterals(): Literal[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allLiterals = thisAndAncestors.reduce((literalsAcc: Literal[], _class: Class) => {
      literalsAcc.push(..._class.getOwnLiterals());
      return literalsAcc;
    }, []);

    return allLiterals;
  }

  clone(): Class {
    const clone = new Class(this);

    if (clone.properties) {
      clone.properties = clone.properties.map((attribute: Property) => attribute.clone());
    }

    if (clone.literals) {
      clone.literals = clone.literals.map((literal: Literal) => literal.clone());
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    this.getContents().forEach((content: ModelElement) => content.replace(originalElement, newElement));
  }

  getOwnRelations(filter?: Function): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllRelations(filter?: Function): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnIncomingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnOutgoingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllIncomingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllOutgoingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnNaryRelations(): { position: number; relation: Relation }[] {
    throw new Error('Method unimplemented!');
  }

  getAllNaryRelations(): { position: number; relation: Relation }[] {
    throw new Error('Method unimplemented!');
  }

  getOwnDerivations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllDerivations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getOwnOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  isPrimitiveDataType(): boolean {
    throw new Error('Method unimplemented!');
  }
}
