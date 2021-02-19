import _ from 'lodash';
import {
  ClassStereotype,
  OntologicalNature,
  OntoumlElement,
  OntoumlType,
  utils,
  Classifier,
  Literal,
  ModelElement,
  natureUtils,
  Package,
  Property,
  Relation,
  stereotypeUtils,
  MultilingualText
} from '..';

export const ORDERLESS_LEVEL = Infinity;

export class Class extends Classifier<Class, ClassStereotype> {
  restrictedTo: OntologicalNature[];
  literals: Literal[];
  isExtensional: boolean;
  isPowertype: boolean;
  order: number;

  constructor(base?: Partial<Class>) {
    super(OntoumlType.CLASS_TYPE, base);

    this.literals = base?.literals || [];
    this.restrictedTo = base?.restrictedTo || [];
    this.isExtensional = base?.isExtensional || false;
    this.isPowertype = base?.isPowertype || false;

    let order = base?.order;
    if (typeof order === 'number') {
      this.order = order;
    } else if (typeof order === 'string') {
      this.order = Class.parseOrder(order);
    } else {
      this.order = 1;
    }
  }

  static parseOrder(orderString: string): number {
    if (orderString === '*') {
      return ORDERLESS_LEVEL;
    } else {
      return isNaN(Number(orderString)) ? 1 : Number(orderString);
    }
  }

  getContents(): OntoumlElement[] {
    let contents: OntoumlElement[] = [];

    if (this.properties) {
      contents = [...this.properties];
    }

    if (this.literals) {
      contents = [...contents, ...this.literals];
    }

    return contents;
  }

  getAllowedStereotypes(): ClassStereotype[] {
    return stereotypeUtils.ClassStereotypes;
  }

  toJSON(): any {
    const classSerialization = {
      stereotype: null,
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

    if (typeof classSerialization.order === 'number') {
      classSerialization.order = classSerialization.order === ORDERLESS_LEVEL ? '*' : classSerialization.order.toString();
    }

    return classSerialization;
  }

  createAttribute(propertyType: Class, name?: string, base?: Partial<Property>): Property {
    // TODO: explain to claude why I removed this
    // if (this.hasEnumerationStereotype()) {
    //   throw new Error('Cannot create an attribute on an enumeration class.');
    // }
    let attribute = new Property(
      Object.assign({}, base, { propertyType, name: new MultilingualText(name), container: this, project: this.project })
    );
    this.addAttribute(attribute);
    return attribute;
  }

  createLiteral(name?: string, base?: Partial<Literal>): Literal {
    let literal = new Literal(
      Object.assign({}, base, { name: new MultilingualText(name), container: this, project: this.project })
    );
    this.addLiteral(literal);
    return literal;
  }

  addAttribute(attribute: Property): void {
    if (!attribute) {
      return;
    }
    attribute.setContainer(this);
    this.properties.push(attribute);
  }

  addLiteral(literal: Literal): void {
    if (!literal) {
      return;
    }
    literal.setContainer(this);
    this.literals.push(literal);
  }

  hasAttributes(): boolean {
    return !_.isEmpty(this.properties);
  }

  hasLiterals(): boolean {
    return !_.isEmpty(this.literals);
  }

  restrictedToOverlaps(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return utils.intersects(this.restrictedTo, naturesArray);
  }

  restrictedToContainedIn(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return !_.isEmpty(this.restrictedTo) && !_.isEmpty(naturesArray) && utils.includesAll(naturesArray, this.restrictedTo);
  }

  restrictedToContains(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return !_.isEmpty(this.restrictedTo) && !_.isEmpty(naturesArray) && utils.includesAll(this.restrictedTo, naturesArray);
  }

  restrictedToEquals(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return utils.equalContents(this.restrictedTo, naturesArray);
  }

  isRestrictedToEndurant(): boolean {
    return this.restrictedToContainedIn(natureUtils.EndurantNatures);
  }

  isRestrictedToSubstantial(): boolean {
    return this.restrictedToContainedIn(natureUtils.SubstantialNatures);
  }

  isRestrictedToMoment(): boolean {
    return this.restrictedToContainedIn(natureUtils.MomentNatures);
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

  isRestrictedToIntrinsicMoment(): boolean {
    return this.restrictedToContainedIn(natureUtils.IntrinsicMomentNatures);
  }

  isRestrictedToExtrinsicMoment(): boolean {
    return this.restrictedToContainedIn(natureUtils.ExtrinsicMomentNatures);
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
    return this.hasAnyStereotype(ClassStereotype.TYPE);
  }

  hasEventStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.EVENT);
  }

  hasSituationStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.SITUATION);
  }

  hasAbstractStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.ABSTRACT);
  }

  hasDatatypeStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.DATATYPE);
  }

  hasEnumerationStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.ENUMERATION);
  }

  isComplexDatatype(): boolean {
    return this.hasDatatypeStereotype() && this.hasAttributes();
  }

  isPrimitiveDatatype(): boolean {
    return this.hasDatatypeStereotype() && !this.hasAttributes();
  }

  hasEndurantOnlyStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.EndurantStereotypes);
  }

  hasMomentOnlyStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.MomentOnlyStereotypes);
  }

  // TODO: explain substantial
  hasSubstantialOnlyStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.SubstantialOnlyStereotypes);
  }

  hasRigidStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.RigidStereotypes);
  }

  hasSemiRigidStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.SemiRigidStereotypes);
  }

  hasAntiRigidStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.AntiRigidStereotypes);
  }

  hasNonSortalStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.NonSortalStereotypes);
  }

  hasSortalStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.SortalStereotypes);
  }

  hasUltimateSortalStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.UltimateSortalStereotypes);
  }

  hasBaseSortalStereotype(): boolean {
    return this.hasAnyStereotype(stereotypeUtils.BaseSortalStereotypes);
  }

  hasKindStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.KIND);
  }

  hasCollectiveStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.COLLECTIVE);
  }

  hasQuantityStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.QUANTITY);
  }

  hasRelatorStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.RELATOR);
  }

  hasQualityStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.QUALITY);
  }

  hasModeStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.MODE);
  }

  hasSubkindStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.SUBKIND);
  }

  hasPhaseStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.PHASE);
  }

  hasRoleStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.ROLE);
  }

  hasHistoricalRoleStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.HISTORICAL_ROLE);
  }

  hasCategoryStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.CATEGORY);
  }

  hasPhaseMixinStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.PHASE_MIXIN);
  }

  hasRoleMixinStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.ROLE_MIXIN);
  }

  hasHistoricalRoleMixinStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.HISTORICAL_ROLE_MIXIN);
  }

  hasMixinStereotype(): boolean {
    return this.hasAnyStereotype(ClassStereotype.MIXIN);
  }

  getUltimateSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.hasUltimateSortalStereotype());
  }

  getUltimateSortalsDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.hasUltimateSortalStereotype());
  }

  getSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.hasSortalStereotype());
  }

  getSortalDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.hasSortalStereotype());
  }

  getBaseSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.hasBaseSortalStereotype());
  }

  getBaseSortalDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.hasBaseSortalStereotype());
  }

  getNonSortalAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasNonSortalStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getNonSortalDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasNonSortalStereotype();
    return this.getFilteredDescendants(descendantsFilter);
  }

  getRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasRigidStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasRigidStereotype();
    return this.getFilteredDescendants(descendantsFilter);
  }

  getSemiRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasSemiRigidStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getSemiRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasSemiRigidStereotype();
    return this.getFilteredDescendants(descendantsFilter);
  }

  getAntiRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.hasAntiRigidStereotype();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getAntiRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.hasAntiRigidStereotype();
    return this.getFilteredDescendants(descendantsFilter);
  }

  /** Returns both own attributes, excluding inherited ones */
  getOwnAttributes(): Property[] {
    if (this.hasEnumerationStereotype()) {
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
    if (!this.hasEnumerationStereotype()) {
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

  /**
   * Returns not only ancestors and descendants, but also those reachable through non-disjoint diverging branch in generalization hierarchies
   */
  getUltimateSortalsInReach(): Class[] {
    throw new Error('Method unimplemented!');
  }

  // TODO: investigate TSLint error TS6133 "'filter' is declared but its value is never read"
  getOwnRelations(_filter?: Function): Relation[] {
    throw new Error('Method unimplemented!');
  }

  // TODO: add static version of factory methods present in class here
  // TODO: expand support
  static haveRigidStereotypes(classes: Class[]): boolean {
    return classes.every((_class: Class) => _class.hasRigidStereotype());
  }

  static areAbstract(classes: Class[]): boolean {
    return !_.isEmpty(classes) && classes.every((_class: Class) => _class.isAbstract);
  }
}
