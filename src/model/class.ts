import _ from 'lodash';
import {
  ClassStereotype,
  Nature,
  OntoumlElement,
  OntoumlType,
  utils,
  Literal,
  ModelElement,
  Package,
  Property,
  GeneralizationSet,
  Project,
  TYPE,
  EVENT,
  SITUATION,
  ABSTRACT,
  DATATYPE,
  ENUMERATION,
  KIND,
  COLLECTIVE,
  QUANTITY,
  RELATOR,
  QUALITY,
  MODE,
  SUBKIND,
  PHASE,
  ROLE,
  HISTORICAL_ROLE,
  CATEGORY,
  PHASE_MIXIN,
  ROLE_MIXIN,
  HISTORICAL_ROLE_MIXIN,
  MIXIN,
  EndurantNatures,
  ExtrinsicMomentNatures,
  IntrinsicMomentNatures,
  MomentNatures,
  SubstantialNatures,
  RIGID_STEREOTYPES,
  SEMI_RIGID_STEREOTYPES,
  ANTI_RIGID_STEREOTYPES,
  NON_SORTAL_STEREOTYPES,
  SORTAL_STEREOTYPES,
  ULTIMATE_SORTAL_STEREOTYPES,
  BASE_SORTAL_STEREOTYPES
} from '..';

import { Classifier } from './classifier';
// import { PropertyBuilder } from '../builder/property_builder';

export class Class extends Classifier<Class, ClassStereotype> {
  private _restrictedTo: Nature[] = [];
  private _literals: Literal[] = [];
  private _order: number = 1;
  isPowertype: boolean = false;

  constructor(project: Project, container?: Package) {
    super(project, container);
    project.addClass(this);
  }

  public get restrictedTo(): Nature[] {
    return [...this._restrictedTo];
  }

  public set restrictedTo(value: Nature[]) {
    this._restrictedTo = [...new Set(value)];
  }

  public get literals(): Literal[] {
    return [...this._literals];
  }

  public set literals(value: Literal[]) {
    this._literals = [...new Set(value)];
  }

  public get order(): number {
    return this._order;
  }

  public set order(value: number) {
    if (value < 1) {
      throw new Error('The order of a class must be greater or equal to one');
    }

    this._order = value;
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
    return Object.values(ClassStereotype);
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.CLASS,
      restrictedTo: this.restrictedTo,
      literals: this.literals.map(l => l.id),
      isPowertype: this.isPowertype,
      order: this.getOrderAsString()
    };

    return { ...object, ...super.toJSON() };
  }

  public getOrderAsString(): string {
    if (this.order === ORDERLESS_LEVEL) {
      return '*';
    }

    return this.order.toString();
  }

  // attributeBuilder(): PropertyBuilder {
  //   return new PropertyBuilder();

  // }

  createAttribute(propertyType?: Class, name?: string): Property {
    // TODO: Discuss the removal of this code block
    // if (this.hasEnumerationStereotype()) {
    //   throw new Error('Cannot create an attribute on an enumeration class.');
    // }
    let attr = new Property(this, propertyType);

    if (name) {
      attr.name.addText(name);
    }

    this.addAttribute(attr);
    return attr;
  }

  createLiteral(name?: string): Literal {
    let literal = new Literal(this);
    this.addLiteral(literal);

    if (name) {
      this.name.addText(name);
    }
    return literal;
  }

  addAttribute(attribute: Property): void {
    if (!attribute) {
      throw new Error('Cannot add a null attribute');
    }

    attribute.container = this;
    this.properties.push(attribute);
  }

  addLiteral(literal: Literal): void {
    if (!literal) {
      throw new Error('Cannot add a null literal');
    }

    literal.container = this;
    this.literals.push(literal);
  }

  hasAttributes(): boolean {
    return !_.isEmpty(this.properties);
  }

  hasLiterals(): boolean {
    return !_.isEmpty(this.literals);
  }

  allowsSome(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return utils.intersects(this.restrictedTo, naturesArray);
  }

  allowsOnly(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return (
      !_.isEmpty(this.restrictedTo) &&
      !_.isEmpty(naturesArray) &&
      utils.includesAll(naturesArray, this.restrictedTo)
    );
  }

  allowsAll(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return (
      !_.isEmpty(this.restrictedTo) &&
      !_.isEmpty(naturesArray) &&
      utils.includesAll(this.restrictedTo, naturesArray)
    );
  }

  allowsExactly(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return utils.equalContents(this.restrictedTo, naturesArray);
  }

  isEndurantType(): boolean {
    return this.allowsOnly(EndurantNatures);
  }

  isSubstantialType(): boolean {
    return this.allowsOnly(SubstantialNatures);
  }

  isMomentType(): boolean {
    return this.allowsOnly(MomentNatures);
  }

  isFunctionalComplexType(): boolean {
    return this.allowsExactly(Nature.FUNCTIONAL_COMPLEX);
  }

  isCollectiveType(): boolean {
    return this.allowsExactly(Nature.COLLECTIVE);
  }

  isQuantityType(): boolean {
    return this.allowsExactly(Nature.QUANTITY);
  }

  isIntrinsicMomentType(): boolean {
    return this.allowsOnly(IntrinsicMomentNatures);
  }

  isExtrinsicMomentType(): boolean {
    return this.allowsOnly(ExtrinsicMomentNatures);
  }

  isCharacterizer(): boolean {
    return this.allowsOnly([
      Nature.EXTRINSIC_MODE,
      Nature.INTRINSIC_MODE,
      Nature.QUALITY
    ]);
  }

  isRelatorType(): boolean {
    return this.allowsExactly(Nature.RELATOR);
  }

  isIntrinsicModeType(): boolean {
    return this.allowsExactly(Nature.INTRINSIC_MODE);
  }

  isExtrinsicModeType(): boolean {
    return this.allowsExactly(Nature.EXTRINSIC_MODE);
  }

  isQualityType(): boolean {
    return this.allowsExactly(Nature.QUALITY);
  }

  isEventType(): boolean {
    return this.allowsExactly(Nature.EVENT);
  }

  isSituationType(): boolean {
    return this.allowsExactly(Nature.SITUATION);
  }

  isHighOrderType(): boolean {
    return this.allowsExactly(Nature.TYPE);
  }

  isAbstractType(): boolean {
    return this.allowsExactly(Nature.ABSTRACT);
  }

  /**
   * @returns true if the class is decorated with a rigid stereotype.
   * @see RIGID_STEREOTYPES
   */
  isRigid(): boolean {
    return this.isStereotypeOneOf(RIGID_STEREOTYPES);
  }

  /**
   * @returns true if the class is decorated with a semi-rigid stereotype.
   * @see SEMI_RIGID_STEREOTYPES
   */
  isSemiRigid(): boolean {
    return this.isStereotypeOneOf(SEMI_RIGID_STEREOTYPES);
  }
  /**
   * @returns true if the class is decorated with an anti-rigid stereotype.
   * @see ANTI_RIGID_STEREOTYPES
   */
  isAntiRigid(): boolean {
    return this.isStereotypeOneOf(ANTI_RIGID_STEREOTYPES);
  }

  /**
   * @returns true if the class is decorated with a non-sortal stereotype.
   * @see NON_SORTAL_STEREOTYPES
   */
  isNonSortal(): boolean {
    return this.isStereotypeOneOf(NON_SORTAL_STEREOTYPES);
  }

  /**
   * @returns true if the class is decorated with a sortal stereotype.
   * @see SORTAL_STEREOTYPES
   */
  isSortal(): boolean {
    return this.isStereotypeOneOf(SORTAL_STEREOTYPES);
  }

  /**
   * @returns true if the class is decorated with an ultimate sortal stereotype, i.e. a stereotype that indicates that the class provides an identity principle to its instances.
   * @see ULTIMATE_SORTAL_STEREOTYPES
   */
  isIdentityProvider(): boolean {
    return this.isStereotypeOneOf(ULTIMATE_SORTAL_STEREOTYPES);
  }

  /**
   * @returns true if the class is decorated with a base sortal stereotype.
   * @see BASE_SORTAL_STEREOTYPES
   */
  isBaseSortal(): boolean {
    return this.isStereotypeOneOf(BASE_SORTAL_STEREOTYPES);
  }

  /**
   * @returns true if the class is stereotyped as «type».
   */
  isType(): boolean {
    return this.stereotype === TYPE;
  }

  /**
   * @returns true if the class is stereotyped as «event».
   */
  isEvent(): boolean {
    return this.stereotype === EVENT;
  }

  /**
   * @returns true if the class is stereotyped as «situation».
   */
  isSituation(): boolean {
    return this.stereotype === SITUATION;
  }

  /** TODO
   * @returns true if the class is stereotyped as «abstract».
   */
  isAbstractStereotype(): boolean {
    return this.stereotype === ABSTRACT;
  }

  /**
   * @returns true if the class is stereotyped as «datatype».
   */
  isDatatype(): boolean {
    return this.stereotype === DATATYPE;
  }

  isComplexDatatype(): boolean {
    return this.isAbstractType() && this.isDatatype() && this.hasAttributes();
  }

  isPrimitiveDatatype(): boolean {
    return this.isAbstractType() && this.isDatatype() && !this.hasAttributes();
  }

  /**
   * @returns true if the class is stereotyped as «enumeration».
   */
  isEnumeration(): boolean {
    return this.stereotype === ENUMERATION;
  }

  /**
   * @returns true if the class is stereotyped as «kind».
   */
  isKind(): boolean {
    return this.stereotype === KIND;
  }

  /**
   * @returns true if the class is stereotyped as «collective».
   */
  isCollective(): boolean {
    return this.stereotype === COLLECTIVE;
  }

  /**
   * @returns true if the class is stereotyped as «quantity».
   */
  isQuantity(): boolean {
    return this.stereotype === QUANTITY;
  }

  /**
   * @returns true if the class is stereotyped as «relator».
   */
  isRelator(): boolean {
    return this.stereotype === RELATOR;
  }

  /**
   * @returns true if the class is stereotyped as «quality».
   */
  isQuality(): boolean {
    return this.stereotype === QUALITY;
  }

  /**
   * @returns true if the class is stereotyped as «mode».
   */
  isMode(): boolean {
    return this.stereotype === MODE;
  }

  /**
   * @returns true if the class is stereotyped as «subkind».
   */
  isSubkind(): boolean {
    return this.stereotype === SUBKIND;
  }

  /**
   * @returns true if the class is stereotyped as «phase».
   */
  isPhase(): boolean {
    return this.stereotype === PHASE;
  }

  /**
   * @returns true if the class is stereotyped as «role».
   */
  isRole(): boolean {
    return this.stereotype === ROLE;
  }

  /**
   * @returns true if the class is stereotyped as «historicalRole».
   */
  isHistoricalRole(): boolean {
    return this.stereotype === HISTORICAL_ROLE;
  }

  /**
   * @returns true if the class is stereotyped as «category».
   */
  isCategory(): boolean {
    return this.stereotype === CATEGORY;
  }

  /**
   * @returns true if the class is stereotyped as «phaseMixin».
   */
  isPhaseMixin(): boolean {
    return this.stereotype === PHASE_MIXIN;
  }

  /**
   * @returns true if the class is stereotyped as «roleMixin».
   */
  isRoleMixin(): boolean {
    return this.stereotype === ROLE_MIXIN;
  }

  /**
   * @returns true if the class is stereotyped as «historicalRoleMixin».
   */
  isHistoricalRoleMixin(): boolean {
    return this.stereotype === HISTORICAL_ROLE_MIXIN;
  }

  /**
   * @returns true if the class is stereotyped as «mixin».
   */
  isMixin(): boolean {
    return this.stereotype === MIXIN;
  }

  getUltimateSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.isIdentityProvider());
  }

  getUltimateSortalsDescendants(): Class[] {
    return this.getFilteredDescendants(descendent =>
      descendent.isIdentityProvider()
    );
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

  /**
   * @returns attributes defined in the class, excluding inherited ones
   * */
  getAttributes(): Property[] {
    if (this.isEnumeration()) {
      throw new Error('Cannot retrieve attributes from an enumeration.');
    }

    return this.properties ? [...this.properties] : [];
  }

  /**
   * @returns both own and inherited attributes
   * */
  getAllAttributes(): Property[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allAttributes = thisAndAncestors.reduce(
      (attributesAcc: Property[], _class: Class) => {
        attributesAcc.push(..._class.getAttributes());
        return attributesAcc;
      },
      []
    );

    return allAttributes;
  }

  /** @returns both own literals, excluding inherited ones */
  getLiterals(): Literal[] {
    if (!this.isEnumeration()) {
      throw new Error('Cannot retrieve literals from a non-enumeration.');
    }

    return this.literals ? [...this.literals] : [];
  }

  /** @returns both own and inherited literals */
  getAllLiterals(): Literal[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allLiterals = thisAndAncestors.reduce(
      (literalsAcc: Literal[], _class: Class) => {
        literalsAcc.push(..._class.getLiterals());
        return literalsAcc;
      },
      []
    );

    return allLiterals;
  }

  clone(): Class {
    const clone = { ...this };

    if (clone.properties) {
      clone.properties = clone.properties.map((attribute: Property) =>
        attribute.clone()
      );
    }

    if (clone.literals) {
      clone.literals = clone.literals.map((literal: Literal) =>
        literal.clone()
      );
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    this.getContents()
      .filter(content => content instanceof ModelElement)
      .map(content => content as ModelElement)
      .forEach(content => content.replace(originalElement, newElement));
  }

  getGeneralizationSetsWhereCategorizer(): GeneralizationSet[] {
    return this.getGeneralizationSets().filter(gs => gs.categorizer === this);
  }
}

export const ORDERLESS_LEVEL = Infinity;

export function parseOrder(orderString: string): number {
  if (orderString === '*') {
    return ORDERLESS_LEVEL;
  } else {
    return isNaN(Number(orderString)) ? 1 : Number(orderString);
  }
}
