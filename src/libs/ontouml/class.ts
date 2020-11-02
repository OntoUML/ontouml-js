import _ from 'lodash';
import { OntoumlType } from '@constants/.';
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
  OntologicalNature
} from './';

// TODO: implement Classifier

const classTemplate = {
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

export class Class extends ModelElement
  implements Decoratable<ClassStereotype>, Container<Property | Literal, Property | Literal>, Classifier {
  container: Package;
  stereotypes: ClassStereotype[];
  restrictedTo: OntologicalNature[];
  literals: Literal[];
  properties: Property[];
  isAbstract: boolean; // TODO: review terminology; isAbstract conflicts with «abstract» on isAbstract() or isAbstractClass()
  isDerived: boolean;
  isExtensional: boolean;
  isPowertype: boolean;
  order: string;
  // _typeOf?: Property[]; // inverse relation to Property.propertyType when it is an attribute

  constructor(base?: Partial<Class>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.CLASS_TYPE, enumerable: true });

    this.isAbstract = this.isAbstract || false;
    this.isDerived = this.isDerived || false;
    this.isExtensional = this.isExtensional || false;
    this.isPowertype = this.isPowertype || false;
    this.order = this.order || '1';
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
    const classSerialization = {};

    Object.assign(classSerialization, classTemplate, super.toJSON());

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

  hasTypeStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.TYPE;
  }

  hasEventStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.EVENT;
  }

  hasSituationStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.SITUATION;
  }

  hasAbstractStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.ABSTRACT;
  }

  hasDatatypeStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.DATATYPE;
  }

  hasEnumerationStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.ENUMERATION;
  }

  isComplexDatatype(): boolean {
    return this.hasDatatypeStereotype() && this.hasAttributes();
  }

  hasEndurantOnlyStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.EndurantStereotypes.includes(stereotype);
  }

  hasMomentOnlyStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.MomentOnlyStereotypes.includes(stereotype);
  }

  hasSubstantialOnlyStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.SubstantialOnlyStereotypes.includes(stereotype);
  }

  // TODO: expand support
  static haveRigidStereotypes(classes: Class[]): boolean {
    return classes.every((_class: Class) => _class.hasRigidStereotype());
  }

  hasRigidStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.RigidStereotypes.includes(stereotype);
  }

  hasSemiRigidStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.SemiRigidStereotypes.includes(stereotype);
  }

  hasAntiRigidStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.AntiRigidStereotypes.includes(stereotype);
  }

  hasNonSortalStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.NonSortalStereotypes.includes(stereotype);
  }

  hasSortalStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.SortalStereotypes.includes(stereotype);
  }

  hasUltimateSortalStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.UltimateSortalStereotypes.includes(stereotype);
  }

  hasBaseSortalStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.BaseSortalStereotypes.includes(stereotype);
  }

  hasKindStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.KIND;
  }

  hasCollectiveStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.COLLECTIVE;
  }

  hasQuantityStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.QUANTITY;
  }

  hasRelatorStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.RELATOR;
  }

  hasQualityStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.QUALITY;
  }

  hasModeStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.MODE;
  }

  hasSubkindStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.SUBKIND;
  }

  hasPhaseStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.PHASE;
  }

  hasRoleStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.ROLE;
  }

  hasHistoricalRoleStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.HISTORICAL_ROLE;
  }

  hasCategoryStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.CATEGORY;
  }

  hasPhaseMixinStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.PHASE_MIXIN;
  }

  hasRoleMixinStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.ROLE_MIXIN;
  }

  hasHistoricalRoleMixinStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.HISTORICAL_ROLE_MIXIN;
  }

  hasMixinStereotype(): boolean {
    return this.getUniqueStereotype() === ClassStereotype.MIXIN;
  }

  getGeneralizationAsCategorizer(): Class {
    throw new Error('Method unimplemented!');
  }

  getParents(): Class[] {
    // return super.getParents() as Class[];
    throw new Error('Method unimplemented!');
  }

  getChildren(): Class[] {
    // return super.getChildren() as Class[];
    throw new Error('Method unimplemented!');
  }

  getAncestors(knownAncestors?: Class[]): Class[] {
    // return super.getAncestors() as Class[];
    throw new Error('Method unimplemented!');
  }

  getDescendants(knownDescendants?: Class[]): Class[] {
    // return super.getDescendants() as Class[];
    throw new Error('Method unimplemented!');
  }

  getFilteredAncestors(filter: (ancestor: Class) => boolean): Class[] {
    // return super.getFilteredAncestors(filter) as Class[]
    throw new Error('Method unimplemented!');
  }

  getFilteredDescendants(filter: (descendent: Class) => boolean): Class[] {
    // return super.getFilteredDescendants(filter) as Class[]
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasNature(nature: OntologicalNature | OntologicalNature[]): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Includes all
   */
  allowsNature(nature: OntologicalNature | OntologicalNature[]): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasRelatorNature(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Includes relator
   */
  allowsRelatorNature(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match (unique stereotypes only)
   */
  hasStereotype(stereotype: ClassStereotype): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param stereotypes True only if the class has exactly one stereotype which is included in the stereotypes array
   */
  hasOneOfStereotype(stereotypes: ClassStereotype[]): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  // hasKindStereotype(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   *
   * @param nature Exact match
   */
  // hasRoleStereotype(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   *
   * @param nature Exact match
   */
  // hasRelatorStereotype(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality», «subkind», «role», «phase»
   */
  // isSortal(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns true if the class has one of the following stereotypes as its unique stereotype: «category», «roleMixin», «phaseMixin», «mixin»
   */
  // isNonSortal(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns true if the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality»
   */
  // isUltimateSortal(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns true for «subkind», «role», «phase», and «historicalRole»
   */
  // isBaseSortal(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality», «subkind», «category»
   */
  // isRigid(): boolean {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «mixin»
   */
  isSemiRigid(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «roleMixin», «phaseMixin», «role», «phase»
   */
  isAntiRigid(): boolean {
    throw new Error('Method unimplemented!');
  }

  getUltimateSortalAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getUltimateSortalsDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns not only ancestors and descendants, but also those reachable through non-disjoint diverging branch in generalization hierarchies
   */
  getUltimateSortalsInReach(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSortalAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSortalDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getNonSortalAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getNonSortalDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getRigidAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getRigidDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSemiRigidAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSemiRigidDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAntiRigidAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAntiRigidDescendants(): Class[] {
    throw new Error('Method unimplemented!');
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

  getOwnAttributes(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getAllAttributes(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getAllOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getOwnOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getOwnLiterals(): Literal[] {
    throw new Error('Method unimplemented!');
  }

  getAllLiterals(): Literal[] {
    throw new Error('Method unimplemented!');
  }

  isPrimitiveDataType(): boolean {
    throw new Error('Method unimplemented!');
  }

  // TODO: evaluate if these stereotype retrieval methods are necessary
  static getUltimateSortalStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getSortalStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getNonSortalStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getRigidStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getAntiRigidStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getSemiRigidStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }
}
