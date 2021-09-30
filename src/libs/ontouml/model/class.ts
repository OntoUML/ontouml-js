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
    const object = {
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

    Object.assign(object, super.toJSON());

    if (typeof object.order === 'number') {
      object.order = object.order === ORDERLESS_LEVEL ? '*' : object.order.toString();
    }

    return object;
  }

  createAttribute(propertyType?: Class, name?: string, base?: Partial<Property>): Property {
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

  /**
   * 
   */
  allowsSome(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return utils.intersects(this.restrictedTo, naturesArray);
  }

  allowsOnly(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return !_.isEmpty(this.restrictedTo) && !_.isEmpty(naturesArray) && utils.includesAll(naturesArray, this.restrictedTo);
  }

  allowsAll(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return !_.isEmpty(this.restrictedTo) && !_.isEmpty(naturesArray) && utils.includesAll(this.restrictedTo, naturesArray);
  }

  allowsExactly(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray: OntologicalNature[] = utils.arrayFrom(natures);
    return utils.equalContents(this.restrictedTo, naturesArray);
  }

  isRestrictedToEndurant(): boolean {
    return this.allowsOnly(natureUtils.EndurantNatures);
  }

  isRestrictedToSubstantial(): boolean {
    return this.allowsOnly(natureUtils.SubstantialNatures);
  }

  isRestrictedToMoment(): boolean {
    return this.allowsOnly(natureUtils.MomentNatures);
  }

  isRestrictedToFunctionalComplex(): boolean {
    return this.allowsOnly(OntologicalNature.functional_complex);
  }

  isRestrictedToCollective(): boolean {
    return this.allowsOnly(OntologicalNature.collective);
  }

  isRestrictedToQuantity(): boolean {
    return this.allowsOnly(OntologicalNature.quantity);
  }

  isRestrictedToIntrinsicMoment(): boolean {
    return this.allowsOnly(natureUtils.IntrinsicMomentNatures);
  }

  isRestrictedToExtrinsicMoment(): boolean {
    return this.allowsOnly(natureUtils.ExtrinsicMomentNatures);
  }

  isRestrictedToRelator(): boolean {
    return this.allowsOnly(OntologicalNature.relator);
  }

  isRestrictedToIntrinsicMode(): boolean {
    return this.allowsOnly(OntologicalNature.intrinsic_mode);
  }

  isRestrictedToExtrinsicMode(): boolean {
    return this.allowsOnly(OntologicalNature.extrinsic_mode);
  }

  isRestrictedToQuality(): boolean {
    return this.allowsOnly(OntologicalNature.quality);
  }

  isRestrictedToEvent(): boolean {
    return this.allowsOnly(OntologicalNature.event);
  }

  isRestrictedToSituation(): boolean {
    return this.allowsOnly(OntologicalNature.situation);
  }

  isRestrictedToType(): boolean {
    return this.allowsOnly(OntologicalNature.type);
  }

  isRestrictedToAbstract(): boolean {
    return this.allowsOnly(OntologicalNature.abstract);
  }

  isType(): boolean {
    return this.hasStereotype(ClassStereotype.TYPE);
  }

  isEvent(): boolean {
    return this.hasStereotype(ClassStereotype.EVENT);
  }

  isSituation(): boolean {
    return this.hasStereotype(ClassStereotype.SITUATION);
  }

  isAbstractStereotype(): boolean {
    return this.hasStereotype(ClassStereotype.ABSTRACT);
  }

  isDatatype(): boolean {
    return this.hasStereotype(ClassStereotype.DATATYPE);
  }

  isEnumeration(): boolean {
    return this.hasStereotype(ClassStereotype.ENUMERATION);
  }

  isComplexDatatype(): boolean {
    return this.isDatatype() && this.hasAttributes();
  }

  isPrimitiveDatatype(): boolean {
    return this.isDatatype() && !this.hasAttributes();
  }

  isEndurantType(): boolean {
    return this.hasStereotype(stereotypeUtils.EndurantStereotypes);
  }

  isMomentType(): boolean {
    return this.hasStereotype(stereotypeUtils.MomentOnlyStereotypes);
  }

  // TODO: explain substantial
  isSubstantialType(): boolean {
    return this.hasStereotype(stereotypeUtils.SubstantialOnlyStereotypes);
  }

  isRigid(): boolean {
    return this.hasStereotype(stereotypeUtils.RigidStereotypes);
  }

  isSemiRigid(): boolean {
    return this.hasStereotype(stereotypeUtils.SemiRigidStereotypes);
  }

  isAntiRigid(): boolean {
    return this.hasStereotype(stereotypeUtils.AntiRigidStereotypes);
  }

  isNonSortal(): boolean {
    return this.hasStereotype(stereotypeUtils.NonSortalStereotypes);
  }

  isSortal(): boolean {
    return this.hasStereotype(stereotypeUtils.SortalStereotypes);
  }

  isUltimateSortal(): boolean {
    return this.hasStereotype(stereotypeUtils.UltimateSortalStereotypes);
  }

  isBaseSortal(): boolean {
    return this.hasStereotype(stereotypeUtils.BaseSortalStereotypes);
  }

  isKind(): boolean {
    return this.hasStereotype(ClassStereotype.KIND);
  }

  isCollective(): boolean {
    return this.hasStereotype(ClassStereotype.COLLECTIVE);
  }

  isQuantity(): boolean {
    return this.hasStereotype(ClassStereotype.QUANTITY);
  }

  /**
   * Returns true if the class has a relator stereotype.
   */
  isRelator(): boolean {
    return this.hasStereotype(ClassStereotype.RELATOR);
  }

  /**
   * Returns true if the class has a «quality» stereotype.
   */
  isQuality(): boolean {
    return this.hasStereotype(ClassStereotype.QUALITY);
  }

  isMode(): boolean {
    return this.hasStereotype(ClassStereotype.MODE);
  }

  isSubkind(): boolean {
    return this.hasStereotype(ClassStereotype.SUBKIND);
  }

  isPhase(): boolean {
    return this.hasStereotype(ClassStereotype.PHASE);
  }

  isRole(): boolean {
    return this.hasStereotype(ClassStereotype.ROLE);
  }

  isHistoricalRole(): boolean {
    return this.hasStereotype(ClassStereotype.HISTORICAL_ROLE);
  }

  isCategory(): boolean {
    return this.hasStereotype(ClassStereotype.CATEGORY);
  }

  isPhaseMixin(): boolean {
    return this.hasStereotype(ClassStereotype.PHASE_MIXIN);
  }

  isRoleMixin(): boolean {
    return this.hasStereotype(ClassStereotype.ROLE_MIXIN);
  }

  isHistoricalRoleMixin(): boolean {
    return this.hasStereotype(ClassStereotype.HISTORICAL_ROLE_MIXIN);
  }

  isMixin(): boolean {
    return this.hasStereotype(ClassStereotype.MIXIN);
  }

  getUltimateSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.isUltimateSortal());
  }

  getUltimateSortalsDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.isUltimateSortal());
  }

  getSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.isSortal());
  }

  getSortalDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.isSortal());
  }

  getBaseSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.isBaseSortal());
  }

  getBaseSortalDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.isBaseSortal());
  }

  getNonSortalAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.isNonSortal();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getNonSortalDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.isNonSortal();
    return this.getFilteredDescendants(descendantsFilter);
  }

  getRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.isRigid();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.isRigid();
    return this.getFilteredDescendants(descendantsFilter);
  }

  getSemiRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.isSemiRigid();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getSemiRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.isSemiRigid();
    return this.getFilteredDescendants(descendantsFilter);
  }

  getAntiRigidAncestors(): Class[] {
    const ancestorsFilter = (ancestor: Class) => ancestor.isAntiRigid();
    return this.getFilteredAncestors(ancestorsFilter);
  }

  getAntiRigidDescendants(): Class[] {
    const descendantsFilter = (descendent: Class) => descendent.isAntiRigid();
    return this.getFilteredDescendants(descendantsFilter);
  }

  /** Returns own attributes, excluding inherited ones */
  getAttributes(): Property[] {
    if (this.isEnumeration()) {
      throw new Error('Cannot retrieve attributes from an enumeration.');
    }

    return this.properties ? [...this.properties] : [];
  }

  /** Returns both own and inherited attributes */
  getAllAttributes(): Property[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allAttributes = thisAndAncestors.reduce((attributesAcc: Property[], _class: Class) => {
      attributesAcc.push(..._class.getAttributes());
      return attributesAcc;
    }, []);

    return allAttributes;
  }

  /** Returns own literals, excluding inherited ones */
  getLiterals(): Literal[] {
    if (!this.isEnumeration()) {
      throw new Error('Cannot retrieve literals from a non-enumeration.');
    }

    return this.literals ? [...this.literals] : [];
  }

  /** Returns both own and inherited literals */
  getAllLiterals(): Literal[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allLiterals = thisAndAncestors.reduce((literalsAcc: Literal[], _class: Class) => {
      literalsAcc.push(..._class.getLiterals());
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

  // TODO: add static version of factory methods present in class here
  // TODO: expand support
  static haveRigidStereotypes(classes: Class[]): boolean {
    return classes.every((_class: Class) => _class.isRigid());
  }

  static areAbstract(classes: Class[]): boolean {
    return !_.isEmpty(classes) && classes.every((_class: Class) => _class.isAbstract);
  }
}
