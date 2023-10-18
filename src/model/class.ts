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
  BASE_SORTAL_STEREOTYPES,
  Classifier,
  PropertyBuilder,
  LiteralBuilder
} from '..';

// import { PropertyBuilder } from '../builder/property_builder';

export class Class extends Classifier<Class, ClassStereotype> {
  private _restrictedTo: Nature[] = [];
  private _literals: Set<Literal> = new Set();
  private _order: number = 1;
  isPowertype: boolean = false;

  constructor(project: Project) {
    super(project);
  }

  propertyBuilder(): PropertyBuilder {
    return new PropertyBuilder(this);
  }

  literalBuilder(): LiteralBuilder {
    this.assertEnumeration();
    return new LiteralBuilder(this);
  }

  assertNonEnumeration(): void {
    if (this.stereotype === ENUMERATION)
      throw new Error(
        `Prohibited method call on class decorated with «${ENUMERATION}».`
      );
  }

  assertEnumeration(): void {
    if (this.stereotype !== ENUMERATION)
      throw new Error(
        `Prohibited method call on class that is not decorated with «${ENUMERATION}».`
      );
  }

  public get restrictedTo(): Nature[] {
    return [...this._restrictedTo];
  }

  public set restrictedTo(value: Nature[]) {
    this._restrictedTo = [...new Set(value)];
  }

  /**
   * @returns attributes defined in the class, excluding inherited ones.
   * */
  public get attributes(): Property[] {
    return this.properties;
  }

  /**
   * @returns literals defined in the class, excluding inherited ones.
   * */
  public get literals(): Literal[] {
    return [...this._literals];
  }

  public set literals(literals: Literal[]) {
    this._literals.forEach(l => this.deleteLiteral(l));
    literals.forEach(l => this.addLiteral(l));
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
    return [...this._properties, ...this._literals];
  }

  getAllowedStereotypes(): ClassStereotype[] {
    return Object.values(ClassStereotype);
  }

  override toJSON(): any {
    const object: any = {
      restrictedTo: this.restrictedTo,
      literals: this.literals.map(l => l.id),
      isPowertype: this.isPowertype,
      order: this.getOrderAsString()
    };

    // TODO: consider reorder this return to improve readability on debugging; we can either place the type first, or use a library to sort the object's keys
    return { type: OntoumlType.CLASS, ...super.toJSON(), ...object };
  }

  public getOrderAsString(): string {
    if (this.order === ORDERLESS_LEVEL) {
      return '*';
    }

    return this.order.toString();
  }

  addAttribute(attribute: Property): void {
    this._properties.push(attribute);
    attribute._container = this;
  }

  addLiteral(literal: Literal): void {
    this.assertEnumeration();

    if (!literal) {
      throw new Error('Parameter literal should be defined. Given: ' + literal);
    }

    if (this._literals.has(literal)) {
      throw new Error('Literal is already contained by the enumeration.');
    }

    literal.container?.deleteLiteral(literal);

    this._literals.add(literal);
    literal._container = this;
  }

  deleteLiteral(literal: Literal): void {
    this.assertEnumeration();

    if (!literal) {
      throw new Error('Parameter literal should be defined. Given: ' + literal);
    }

    if (!this._literals.has(literal)) {
      throw new Error('Literal is not contained by the enumeration.');
    }

    this._literals.delete(literal);
    literal._container = undefined;
  }

  hasAttributes(): boolean {
    return !_.isEmpty(this._properties);
  }

  hasLiterals(): boolean {
    return !_.isEmpty(this._literals);
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

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are stereotyped with one of {@link ULTIMATE_SORTAL_STEREOTYPES}.
   */
  getIdentityProviderAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isIdentityProvider());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are stereotyped with one of {@link ULTIMATE_SORTAL_STEREOTYPES}.
   */
  getIdentityProviderDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isIdentityProvider());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are stereotyped with one of {@link SORTAL_STEREOTYPES}.
   */
  getSortalAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isSortal());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are stereotyped with one of {@link SORTAL_STEREOTYPES}.
   */
  getSortalDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isSortal());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are stereotyped with one of {@link BASE_SORTAL_STEREOTYPES}.
   */
  getBaseSortalAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isBaseSortal());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are stereotyped with one of {@link BASE_SORTAL_STEREOTYPES}.
   */
  getBaseSortalDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isBaseSortal());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are non-sortal.
   */
  getNonSortalAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isNonSortal());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are non-sortal.
   */
  getNonSortalDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isNonSortal());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are rigid.
   */
  getRigidAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isRigid());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are rigid.
   */
  getRigidDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isRigid());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are semi-rigid.
   */
  getSemiRigidAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isSemiRigid());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are semi-rigid.
   */
  getSemiRigidDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isSemiRigid());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect supertypes of the class and are anti-rigid.
   */
  getAntiRigidAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isAntiRigid());
  }

  /**
   *
   * @returns an array of {@link Class} that are direct or indirect subtypes of the class and are anti-rigid.
   */
  getAntiRigidDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isAntiRigid());
  }

  /**
   * @returns an array of attributes ({@link Property}) that are either owned of inherited by the class.
   * */
  getAllAttributes(): Property[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    return thisAndAncestors.flatMap(c => c._properties);
  }

  /** @returns both own and inherited literals */
  getAllLiterals(): Literal[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    return thisAndAncestors.flatMap(c => [...c._literals]);
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
    if (this._container === originalElement) {
      this._container = newElement as Package;
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
