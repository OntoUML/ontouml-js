import _ from 'lodash';
import {
  ClassStereotype,
  Nature,
  OntoumlType,
  utils,
  Literal,
  ModelElement,
  Property,
  GeneralizationSet,
  Project,
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

/**
 * A class in an OntoUML model, i.e., a type whose instances share common
 * properties, such as `Person`, `Marriage`, or `Color`. Classes are
 * typically decorated with a {@link ClassStereotype} that captures the
 * ontological micro-theory governing the type (e.g., «kind», «role»,
 * «relator»), and are restricted to the ontological natures their instances
 * may have (see {@link restrictedTo}).
 *
 * A class may own attributes (see {@link Property}), and, when decorated
 * with «enumeration», it may own literals (see {@link Literal}). High-order
 * classes — whose instances are themselves types — are supported via
 * {@link order} and {@link isPowertype}.
 */
export class Class extends Classifier<Class, ClassStereotype> {
  private _restrictedTo: Nature[] = [];
  private _literals: Set<Literal> = new Set();
  private _order: number = 1;

  /**
   * Indicates whether the class is a powertype, i.e., a high-order type
   * whose instances are all the possible specializations of a given base
   * type.
   */
  isPowertype: boolean = false;

  constructor(project: Project) {
    super(project);
  }

  /** Creates a builder for a {@link Property} owned by this class. */
  propertyBuilder(): PropertyBuilder {
    return new PropertyBuilder(this);
  }

  /**
   * Creates a builder for a {@link Literal} owned by this class.
   *
   * @throws an error if the class is not decorated with «enumeration».
   */
  literalBuilder(): LiteralBuilder {
    this.assertEnumeration();
    return new LiteralBuilder(this);
  }

  /**
   * Asserts that this class is not decorated with «enumeration».
   *
   * @throws an error if the class is an enumeration.
   */
  assertNonEnumeration(): void {
    if (this.stereotype === ClassStereotype.ENUMERATION)
      throw new Error(
        `Prohibited method call on class decorated with «${ClassStereotype.ENUMERATION}».`
      );
  }

  /**
   * Asserts that this class is decorated with «enumeration».
   *
   * @throws an error if the class is not an enumeration.
   */
  assertEnumeration(): void {
    if (this.stereotype !== ClassStereotype.ENUMERATION)
      throw new Error(
        `Prohibited method call on class that is not decorated with «${ClassStereotype.ENUMERATION}».`
      );
  }

  /**
   * The ontological natures that instances of this class may have. For
   * example, a class `Person` decorated with «kind» is restricted to the
   * functional complex nature, while a class `Insurable` may admit
   * instances of multiple natures.
   */
  public get restrictedTo(): Nature[] {
    return [...this._restrictedTo];
  }

  /**
   * Sets the ontological natures that instances of this class may have,
   * discarding duplicates.
   */
  public set restrictedTo(value: Nature[]) {
    this._restrictedTo = [...new Set(value)];
  }

  /** The attributes defined in this class, excluding inherited ones. */
  public get attributes(): Property[] {
    return this.properties;
  }

  /** The literals defined in this class, excluding inherited ones. */
  public get literals(): Literal[] {
    return [...this._literals];
  }

  /**
   * Sets the literals defined in this class, detaching any previously owned
   * literals.
   */
  public set literals(literals: Literal[]) {
    this._literals.forEach(l => this.deleteLiteral(l));
    literals.forEach(l => this.addLiteral(l));
  }

  /**
   * The type order of this class: 1 for first-order classes (whose
   * instances are individuals), 2 for second-order classes (whose instances
   * are first-order types), and so on. Orderless classes are represented by
   * {@link ORDERLESS_LEVEL}.
   */
  public get order(): number {
    return this._order;
  }

  /**
   * Sets the type order of this class.
   *
   * @throws an error if the value is not an integer greater than or equal
   *         to one or {@link ORDERLESS_LEVEL}.
   */
  public set order(value: number) {
    if (
      Number.isNaN(value) ||
      value < 1 ||
      (!Number.isInteger(value) && value !== ORDERLESS_LEVEL)
    ) {
      throw new Error('The order of a class must be greater or equal to one');
    }

    this._order = value;
  }

  /** The attributes and literals owned by this class. */
  override get contents(): ModelElement[] {
    return [...this._properties, ...this._literals];
  }

  /**
   * Lists the stereotypes that OntoUML allows on classes, i.e., all values
   * of {@link ClassStereotype}.
   */
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

    return { type: OntoumlType.CLASS, ...super.toJSON(), ...object };
  }

  /**
   * Retrieves the type order of this class as a string, where orderless
   * classes are represented as `"*"`.
   */
  public getOrderAsString(): string {
    if (this.order === ORDERLESS_LEVEL) {
      return '*';
    }

    return this.order.toString();
  }

  /**
   * Adds an attribute to this class, setting the class as the attribute's
   * container.
   */
  addAttribute(attribute: Property): void {
    this._properties.push(attribute);
    attribute._container = this;
  }

  /**
   * Adds a literal to this enumeration, removing it from its previous
   * enumeration, if any.
   *
   * @throws an error if the class is not an enumeration, the literal is
   *         undefined, or the literal is already contained by the class.
   */
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

  /**
   * Removes a literal from this enumeration, clearing the literal's
   * container.
   *
   * @throws an error if the class is not an enumeration, the literal is
   *         undefined, or the literal is not contained by the class.
   */
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

  /**
   * Deletes the literals owned by this class, in addition to the
   * dependents deleted for every classifier (relations, generalizations,
   * properties, anchors, and views).
   */
  protected override deleteDependents(): void {
    this.literals.forEach(l => l.delete());
    super.deleteDependents();
  }

  /**
   * Clears the categorizer field of the generalization sets categorized by
   * this class, in addition to the reference clean-up performed for every
   * classifier.
   */
  protected override removeReferences(): void {
    this.project.generalizationSets
      .filter(gs => gs.categorizer === this)
      .forEach(gs => (gs.categorizer = undefined));

    super.removeReferences();
  }

  /** Checks whether this class owns at least one attribute. */
  hasAttributes(): boolean {
    return !_.isEmpty(this._properties);
  }

  /** Checks whether this class owns at least one literal. */
  hasLiterals(): boolean {
    return !_.isEmpty(this._literals);
  }

  /**
   * Checks whether this class allows instances of at least one of the given
   * natures, i.e., whether {@link restrictedTo} intersects the given
   * natures.
   */
  allowsSome(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return utils.intersects(this.restrictedTo, naturesArray);
  }

  /**
   * Checks whether this class only allows instances of the given natures,
   * i.e., whether {@link restrictedTo} is a non-empty subset of the given
   * natures.
   */
  allowsOnly(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return (
      !_.isEmpty(this.restrictedTo) &&
      !_.isEmpty(naturesArray) &&
      utils.includesAll(naturesArray, this.restrictedTo)
    );
  }

  /**
   * Checks whether this class allows instances of all of the given natures,
   * i.e., whether {@link restrictedTo} is a non-empty superset of the given
   * natures.
   */
  allowsAll(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return (
      !_.isEmpty(this.restrictedTo) &&
      !_.isEmpty(naturesArray) &&
      utils.includesAll(this.restrictedTo, naturesArray)
    );
  }

  /**
   * Checks whether this class allows instances of exactly the given
   * natures, i.e., whether {@link restrictedTo} has the same contents as
   * the given natures.
   */
  allowsExactly(natures: Nature | readonly Nature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return utils.equalContents(this.restrictedTo, naturesArray);
  }

  /**
   * Checks whether the instances of this class are restricted to endurant
   * natures (see {@link EndurantNatures}).
   */
  isEndurantType(): boolean {
    return this.allowsOnly(EndurantNatures);
  }

  /**
   * Checks whether the instances of this class are restricted to
   * substantial natures (see {@link SubstantialNatures}).
   */
  isSubstantialType(): boolean {
    return this.allowsOnly(SubstantialNatures);
  }

  /**
   * Checks whether the instances of this class are restricted to moment
   * natures (see {@link MomentNatures}).
   */
  isMomentType(): boolean {
    return this.allowsOnly(MomentNatures);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * functional complex nature.
   */
  isFunctionalComplexType(): boolean {
    return this.allowsExactly(Nature.FUNCTIONAL_COMPLEX);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * collective nature.
   */
  isCollectiveType(): boolean {
    return this.allowsExactly(Nature.COLLECTIVE);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * quantity nature.
   */
  isQuantityType(): boolean {
    return this.allowsExactly(Nature.QUANTITY);
  }

  /**
   * Checks whether the instances of this class are restricted to intrinsic
   * moment natures (see {@link IntrinsicMomentNatures}).
   */
  isIntrinsicMomentType(): boolean {
    return this.allowsOnly(IntrinsicMomentNatures);
  }

  /**
   * Checks whether the instances of this class are restricted to extrinsic
   * moment natures (see {@link ExtrinsicMomentNatures}).
   */
  isExtrinsicMomentType(): boolean {
    return this.allowsOnly(ExtrinsicMomentNatures);
  }

  /**
   * Checks whether this class can characterize other types, i.e., whether
   * its instances are restricted to mode and quality natures.
   */
  isCharacterizer(): boolean {
    return this.allowsOnly([
      Nature.EXTRINSIC_MODE,
      Nature.INTRINSIC_MODE,
      Nature.QUALITY
    ]);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * relator nature.
   */
  isRelatorType(): boolean {
    return this.allowsExactly(Nature.RELATOR);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * intrinsic mode nature.
   */
  isIntrinsicModeType(): boolean {
    return this.allowsExactly(Nature.INTRINSIC_MODE);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * extrinsic mode nature.
   */
  isExtrinsicModeType(): boolean {
    return this.allowsExactly(Nature.EXTRINSIC_MODE);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * quality nature.
   */
  isQualityType(): boolean {
    return this.allowsExactly(Nature.QUALITY);
  }

  /**
   * Checks whether the instances of this class are restricted to the event
   * nature.
   */
  isEventType(): boolean {
    return this.allowsExactly(Nature.EVENT);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * situation nature.
   */
  isSituationType(): boolean {
    return this.allowsExactly(Nature.SITUATION);
  }

  /**
   * Checks whether the instances of this class are restricted to the type
   * nature, i.e., whether its instances are themselves types.
   */
  isHighOrderType(): boolean {
    return this.allowsExactly(Nature.TYPE);
  }

  /**
   * Checks whether the instances of this class are restricted to the
   * abstract nature.
   */
  isAbstractType(): boolean {
    return this.allowsExactly(Nature.ABSTRACT);
  }

  /**
   * Checks whether this class is rigid, i.e., whether it necessarily
   * applies to its instances in every world in which they exist.
   *
   * @see RIGID_STEREOTYPES
   */
  isRigid(): boolean {
    return this.isStereotypeOneOf(RIGID_STEREOTYPES);
  }

  /**
   * Checks whether this class is semi-rigid, i.e., whether it applies
   * necessarily to some of its instances and contingently to others.
   *
   * @see SEMI_RIGID_STEREOTYPES
   */
  isSemiRigid(): boolean {
    return this.isStereotypeOneOf(SEMI_RIGID_STEREOTYPES);
  }

  /**
   * Checks whether this class is anti-rigid, i.e., whether every instance
   * can cease to be classified by it without ceasing to exist.
   *
   * @see ANTI_RIGID_STEREOTYPES
   */
  isAntiRigid(): boolean {
    return this.isStereotypeOneOf(ANTI_RIGID_STEREOTYPES);
  }

  /**
   * Checks whether this class is a non-sortal, i.e., whether it classifies
   * entities that follow different identity principles.
   *
   * @see NON_SORTAL_STEREOTYPES
   */
  isNonSortal(): boolean {
    return this.isStereotypeOneOf(NON_SORTAL_STEREOTYPES);
  }

  /**
   * Checks whether this class is a sortal, i.e., whether all of its
   * instances follow the same identity principle.
   *
   * @see SORTAL_STEREOTYPES
   */
  isSortal(): boolean {
    return this.isStereotypeOneOf(SORTAL_STEREOTYPES);
  }

  /**
   * Checks whether this class is an ultimate sortal, i.e., whether it
   * provides the identity principle followed by its instances.
   *
   * @see ULTIMATE_SORTAL_STEREOTYPES
   */
  isIdentityProvider(): boolean {
    return this.isStereotypeOneOf(ULTIMATE_SORTAL_STEREOTYPES);
  }

  /**
   * Checks whether this class is a base sortal, i.e., a sortal that
   * inherits its identity principle from the ultimate sortal it
   * specializes.
   *
   * @see BASE_SORTAL_STEREOTYPES
   */
  isBaseSortal(): boolean {
    return this.isStereotypeOneOf(BASE_SORTAL_STEREOTYPES);
  }

  /** Checks whether this class is stereotyped as «type». */
  isType(): boolean {
    return this.stereotype === ClassStereotype.TYPE;
  }

  /** Checks whether this class is stereotyped as «event». */
  isEvent(): boolean {
    return this.stereotype === ClassStereotype.EVENT;
  }

  /** Checks whether this class is stereotyped as «situation». */
  isSituation(): boolean {
    return this.stereotype === ClassStereotype.SITUATION;
  }

  /** Checks whether this class is stereotyped as «abstract». */
  isAbstractStereotype(): boolean {
    return this.stereotype === ClassStereotype.ABSTRACT;
  }

  /** Checks whether this class is stereotyped as «datatype». */
  isDatatype(): boolean {
    return this.stereotype === ClassStereotype.DATATYPE;
  }

  /**
   * Checks whether this class is a complex datatype, i.e., a «datatype»
   * restricted to the abstract nature that owns attributes.
   */
  isComplexDatatype(): boolean {
    return this.isAbstractType() && this.isDatatype() && this.hasAttributes();
  }

  /**
   * Checks whether this class is a primitive datatype, i.e., a «datatype»
   * restricted to the abstract nature that owns no attributes.
   */
  isPrimitiveDatatype(): boolean {
    return this.isAbstractType() && this.isDatatype() && !this.hasAttributes();
  }

  /** Checks whether this class is stereotyped as «enumeration». */
  isEnumeration(): boolean {
    return this.stereotype === ClassStereotype.ENUMERATION;
  }

  /** Checks whether this class is stereotyped as «kind». */
  isKind(): boolean {
    return this.stereotype === ClassStereotype.KIND;
  }

  /** Checks whether this class is stereotyped as «collective». */
  isCollective(): boolean {
    return this.stereotype === ClassStereotype.COLLECTIVE;
  }

  /** Checks whether this class is stereotyped as «quantity». */
  isQuantity(): boolean {
    return this.stereotype === ClassStereotype.QUANTITY;
  }

  /** Checks whether this class is stereotyped as «relator». */
  isRelator(): boolean {
    return this.stereotype === ClassStereotype.RELATOR;
  }

  /** Checks whether this class is stereotyped as «quality». */
  isQuality(): boolean {
    return this.stereotype === ClassStereotype.QUALITY;
  }

  /** Checks whether this class is stereotyped as «mode». */
  isMode(): boolean {
    return this.stereotype === ClassStereotype.MODE;
  }

  /** Checks whether this class is stereotyped as «subkind». */
  isSubkind(): boolean {
    return this.stereotype === ClassStereotype.SUBKIND;
  }

  /** Checks whether this class is stereotyped as «phase». */
  isPhase(): boolean {
    return this.stereotype === ClassStereotype.PHASE;
  }

  /** Checks whether this class is stereotyped as «role». */
  isRole(): boolean {
    return this.stereotype === ClassStereotype.ROLE;
  }

  /** Checks whether this class is stereotyped as «historicalRole». */
  isHistoricalRole(): boolean {
    return this.stereotype === ClassStereotype.HISTORICAL_ROLE;
  }

  /** Checks whether this class is stereotyped as «category». */
  isCategory(): boolean {
    return this.stereotype === ClassStereotype.CATEGORY;
  }

  /** Checks whether this class is stereotyped as «phaseMixin». */
  isPhaseMixin(): boolean {
    return this.stereotype === ClassStereotype.PHASE_MIXIN;
  }

  /** Checks whether this class is stereotyped as «roleMixin». */
  isRoleMixin(): boolean {
    return this.stereotype === ClassStereotype.ROLE_MIXIN;
  }

  /** Checks whether this class is stereotyped as «historicalRoleMixin». */
  isHistoricalRoleMixin(): boolean {
    return this.stereotype === ClassStereotype.HISTORICAL_ROLE_MIXIN;
  }

  /** Checks whether this class is stereotyped as «mixin». */
  isMixin(): boolean {
    return this.stereotype === ClassStereotype.MIXIN;
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * ultimate sortals (see {@link ULTIMATE_SORTAL_STEREOTYPES}).
   */
  getIdentityProviderAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isIdentityProvider());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are
   * ultimate sortals (see {@link ULTIMATE_SORTAL_STEREOTYPES}).
   */
  getIdentityProviderDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isIdentityProvider());
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * sortals (see {@link SORTAL_STEREOTYPES}).
   */
  getSortalAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isSortal());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are
   * sortals (see {@link SORTAL_STEREOTYPES}).
   */
  getSortalDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isSortal());
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * base sortals (see {@link BASE_SORTAL_STEREOTYPES}).
   */
  getBaseSortalAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isBaseSortal());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are base
   * sortals (see {@link BASE_SORTAL_STEREOTYPES}).
   */
  getBaseSortalDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isBaseSortal());
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * non-sortals (see {@link NON_SORTAL_STEREOTYPES}).
   */
  getNonSortalAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isNonSortal());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are
   * non-sortals (see {@link NON_SORTAL_STEREOTYPES}).
   */
  getNonSortalDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isNonSortal());
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * rigid (see {@link RIGID_STEREOTYPES}).
   */
  getRigidAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isRigid());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are rigid
   * (see {@link RIGID_STEREOTYPES}).
   */
  getRigidDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isRigid());
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * semi-rigid (see {@link SEMI_RIGID_STEREOTYPES}).
   */
  getSemiRigidAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isSemiRigid());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are
   * semi-rigid (see {@link SEMI_RIGID_STEREOTYPES}).
   */
  getSemiRigidDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isSemiRigid());
  }

  /**
   * Retrieves the direct and indirect supertypes of this class that are
   * anti-rigid (see {@link ANTI_RIGID_STEREOTYPES}).
   */
  getAntiRigidAncestors(): Class[] {
    return this.getAncestors().filter(a => a.isAntiRigid());
  }

  /**
   * Retrieves the direct and indirect subtypes of this class that are
   * anti-rigid (see {@link ANTI_RIGID_STEREOTYPES}).
   */
  getAntiRigidDescendants(): Class[] {
    return this.getDescendants().filter(d => d.isAntiRigid());
  }

  /**
   * Retrieves the attributes that are either owned or inherited by this
   * class.
   */
  getAllAttributes(): Property[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    return thisAndAncestors.flatMap(c => c._properties);
  }

  /**
   * Retrieves the literals that are either owned or inherited by this
   * class.
   */
  getAllLiterals(): Literal[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    return thisAndAncestors.flatMap(c => [...c._literals]);
  }

  /**
   * Retrieves the generalization sets in which this class is the
   * categorizer.
   */
  getGeneralizationSetsWhereCategorizer(): GeneralizationSet[] {
    return this.getGeneralizationSets().filter(gs => gs.categorizer === this);
  }
}

/** The value of {@link Class.order} that denotes an orderless class. */
export const ORDERLESS_LEVEL = Infinity;

/**
 * Parses the string representation of a type order (see
 * {@link Class.getOrderAsString}) into a number, mapping `"*"` to
 * {@link ORDERLESS_LEVEL} and invalid numbers to `1`.
 */
export function parseOrder(orderString: string): number {
  if (orderString === '*') {
    return ORDERLESS_LEVEL;
  }

  const order = Number(orderString);
  return Number.isInteger(order) && order >= 1 ? order : 1;
}
