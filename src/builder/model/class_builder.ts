import {
  ABSTRACT,
  CATEGORY,
  COLLECTIVE,
  ClassStereotype,
  DATATYPE,
  ENUMERATION,
  EVENT,
  HISTORICAL_ROLE,
  HISTORICAL_ROLE_MIXIN,
  KIND,
  MIXIN,
  MODE,
  PHASE,
  PHASE_MIXIN,
  QUALITY,
  QUANTITY,
  RELATOR,
  ROLE,
  ROLE_MIXIN,
  SITUATION,
  SUBKIND,
  TYPE,
  Nature,
  Class,
  ORDERLESS_LEVEL,
  Package,
  ClassifierBuilder,
  Project,
  utils
} from '../..';

/**
 * A fluent builder for {@link Class} instances.
 *
 * This builder configures the OntoUML stereotype of the class, the
 * ontological natures its instances may have (`restrictedTo`), its order,
 * and whether it is a powertype, offering shortcut methods such as `kind()`
 * and `role()` that also apply the default values prescribed for each
 * stereotype.
 *
 * @example
 * ```typescript
 * const person = project
 *   .classBuilder()
 *   .kind()
 *   .name('Person')
 *   .build();
 * ```
 */
export class ClassBuilder extends ClassifierBuilder<
  ClassBuilder,
  ClassStereotype
> {
  declare element?: Class;

  private _restrictedTo: Nature[] = [];
  private _order: number = 1;
  private _isPowertype: boolean = false;

  /**
   * Builds an instance of {@link Class} with the parameters passed to the
   * builder. **WARNING:** the ordering in which methods are evoked may
   * affect the resulting object. When no methods are evoked, the created
   * class has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `isAbstract: false,`
   * - `isDerived: false,`
   * - `order: 1,`
   * - `isPowertype: false,`
   */
  override build(): Class {
    this.element = new Class(this.project);
    this.element.order = this._order;
    this.element.isPowertype = this._isPowertype;
    this.element.restrictedTo = this._restrictedTo;

    super.build();
    return this.element;
  }

  /**
   * Sets the order of the class, i.e., the type level of its instances: `1`
   * for classes of individuals, `2` for classes of first-order types, and so
   * on.
   *
   * @returns this builder, for method chaining.
   */
  order(order: number): ClassBuilder {
    this._order = order;
    return this;
  }

  /**
   * Sets the class as orderless, i.e., as a class whose instances may be
   * types of any order.
   *
   * @returns this builder, for method chaining.
   */
  orderless(): ClassBuilder {
    this._order = ORDERLESS_LEVEL;
    return this;
  }

  /**
   * Sets the class as a powertype, i.e., as a high-order class whose
   * instances are all the possible specializations of another class. Raises
   * the order of the class to `2` when it is lower than that.
   *
   * @returns this builder, for method chaining.
   */
  powertype(): ClassBuilder {
    this._isPowertype = true;

    if (this._order < 2) this.order(2);

    return this;
  }

  /**
   * Sets the class as a regular (non-powertype) class, reverting a previous
   * call to `powertype()`.
   *
   * @returns this builder, for method chaining.
   */
  nonPowertype(): ClassBuilder {
    this._isPowertype = false;
    return this;
  }

  /**
   * Sets the stereotype of the class, delegating to the corresponding
   * shortcut method (e.g., `kind()`, `role()`) when the value is a known
   * {@link ClassStereotype}, in which case the default values of the
   * stereotype are also applied.
   *
   * @param stereotype - the stereotype to decorate the class with.
   * @returns this builder, for method chaining.
   */
  override stereotype(stereotype: string): ClassBuilder {
    switch (stereotype) {
      case KIND:
        return this.kind();
      case COLLECTIVE:
        return this.collective();
      case QUANTITY:
        return this.quantity();
      case RELATOR:
        return this.relator();
      case QUALITY:
        return this.quality();
      case MODE:
        return this.mode();
      case SUBKIND:
        return this.subkind();
      case ROLE:
        return this.role();
      case PHASE:
        return this.phase();
      case CATEGORY:
        return this.category();
      case MIXIN:
        return this.mixin();
      case ROLE_MIXIN:
        return this.roleMixin();
      case PHASE_MIXIN:
        return this.phaseMixin();
      case EVENT:
        return this.event();
      case SITUATION:
        return this.situation();
      case HISTORICAL_ROLE:
        return this.historicalRole();
      case HISTORICAL_ROLE_MIXIN:
        return this.historicalRoleMixin();
      case ENUMERATION:
        return this.enumeration();
      case DATATYPE:
        return this.datatype();
      case ABSTRACT:
        return this.abstractClass();
      case TYPE:
        return this.type();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype of the class to «kind», which decorates rigid
   * classes that provide an identity principle to their instances, which are
   * functional complexes (e.g., `Person`, `Car`). Also applies the following
   * defaults:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  kind(): ClassBuilder {
    this._stereotype = KIND;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «collective», which decorates rigid
   * classes that provide an identity principle to their instances, which are
   * collectives, i.e., wholes whose parts play the same role (e.g., `Forest`,
   * `Crowd`). Also applies the following defaults:
   * - `restrictedTo = [ "collective" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  collective(): ClassBuilder {
    this._stereotype = COLLECTIVE;
    this.restrictedTo(Nature.COLLECTIVE);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «quantity», which decorates rigid
   * classes that provide an identity principle to their instances, which are
   * amounts of matter (e.g., `Water`, `Sand`). Also applies the following
   * defaults:
   * - `restrictedTo = [ "quantity" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  quantity(): ClassBuilder {
    this._stereotype = QUANTITY;
    this.restrictedTo(Nature.QUANTITY);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «relator», which decorates rigid
   * classes whose instances are relators, i.e., entities that mediate other
   * entities and are the truthmakers of material relations (e.g.,
   * `Marriage`, `Enrollment`). Also applies the following defaults:
   * - `restrictedTo = [ "relator" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  relator(): ClassBuilder {
    this._stereotype = RELATOR;
    this.restrictedTo(Nature.RELATOR);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «quality», which decorates rigid
   * classes whose instances are qualities, i.e., intrinsic aspects of
   * entities that are measurable on quality structures (e.g., `Weight`,
   * `Color`). Also applies the following defaults:
   * - `restrictedTo = [ "quality" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  quality(): ClassBuilder {
    this._stereotype = QUALITY;
    this.restrictedTo(Nature.QUALITY);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «mode», which decorates rigid
   * classes whose instances are intrinsic modes, i.e., aspects of entities
   * that are not measurable on quality structures (e.g., `Skill`, `Belief`).
   * Also applies the following defaults:
   * - `restrictedTo = [ "intrinsic-mode" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  mode(): ClassBuilder {
    this._stereotype = MODE;
    this.restrictedTo(Nature.INTRINSIC_MODE);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «subkind», which decorates rigid
   * classes that specialize a kind, inheriting its identity principle (e.g.,
   * `Man` as a subkind of `Person`).
   *
   * @returns this builder, for method chaining.
   */
  subkind(): ClassBuilder {
    this._stereotype = SUBKIND;
    return this;
  }

  /**
   * Sets the stereotype of the class to «role», which decorates anti-rigid
   * classes whose instances are contingently classified by virtue of a
   * relational condition (e.g., `Student`, `Employee`).
   *
   * @returns this builder, for method chaining.
   */
  role(): ClassBuilder {
    this._stereotype = ROLE;
    return this;
  }

  /**
   * Sets the stereotype of the class to «phase», which decorates anti-rigid
   * classes whose instances are contingently classified by virtue of an
   * intrinsic condition (e.g., `Child`, `LivingPerson`).
   *
   * @returns this builder, for method chaining.
   */
  phase(): ClassBuilder {
    this._stereotype = PHASE;
    return this;
  }

  /**
   * Sets the stereotype of the class to «category», which decorates rigid
   * non-sortal classes that aggregate essential properties common to
   * instances of different kinds (e.g., `PhysicalObject`). Also applies the
   * following defaults:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   *
   * @returns this builder, for method chaining.
   */
  category(): ClassBuilder {
    this._stereotype = CATEGORY;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype of the class to «mixin», which decorates semi-rigid
   * non-sortal classes that aggregate properties that are essential to some
   * of their instances and accidental to others (e.g., `Insurable`). Also
   * applies the following defaults:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   *
   * @returns this builder, for method chaining.
   */
  mixin(): ClassBuilder {
    this._stereotype = MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype of the class to «roleMixin», which decorates
   * anti-rigid non-sortal classes that aggregate contingent relational
   * properties common to roles of different kinds (e.g., `Customer`). Also
   * applies the following defaults:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   *
   * @returns this builder, for method chaining.
   */
  roleMixin(): ClassBuilder {
    this._stereotype = ROLE_MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype of the class to «phaseMixin», which decorates
   * anti-rigid non-sortal classes that aggregate contingent intrinsic
   * properties common to phases of different kinds (e.g., `LivingBeing`).
   * Also applies the following defaults:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   *
   * @returns this builder, for method chaining.
   */
  phaseMixin(): ClassBuilder {
    this._stereotype = PHASE_MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype of the class to «event», which decorates classes
   * whose instances are events, i.e., occurrents that unfold in time (e.g.,
   * `Wedding`, `Purchase`). Also applies the following defaults:
   * - `restrictedTo = [ "event" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  event(): ClassBuilder {
    this._stereotype = EVENT;
    this.restrictedTo(Nature.EVENT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «situation», which decorates classes
   * whose instances are situations, i.e., particular configurations of
   * entities that can trigger events (e.g., `Hazard`). Also applies the
   * following defaults:
   * - `restrictedTo = [ "situation" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  situation(): ClassBuilder {
    this._stereotype = SITUATION;
    this.restrictedTo(Nature.SITUATION);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «historicalRole», which decorates
   * anti-rigid classes whose instances are classified by virtue of their
   * participation in past events (e.g., `ExPresident`).
   *
   * @returns this builder, for method chaining.
   */
  historicalRole(): ClassBuilder {
    this._stereotype = HISTORICAL_ROLE;
    return this;
  }

  /**
   * Sets the stereotype of the class to «historicalRoleMixin», which
   * decorates anti-rigid non-sortal classes that aggregate historical role
   * properties common to instances of different kinds. Also applies the
   * following defaults:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   *
   * @returns this builder, for method chaining.
   */
  historicalRoleMixin(): ClassBuilder {
    this._stereotype = HISTORICAL_ROLE_MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype of the class to «enumeration», which decorates
   * classes whose instances form a fixed set of literals (e.g., `Color` with
   * the literals `Red`, `Green`, and `Blue`). Also applies the following
   * defaults:
   * - `restrictedTo = [ "abstract" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  enumeration(): ClassBuilder {
    this._stereotype = ENUMERATION;
    this.restrictedTo(Nature.ABSTRACT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «datatype», which decorates classes
   * whose instances are values of a (possibly structured) value space (e.g.,
   * `Date`, `Address`). Also applies the following defaults:
   * - `restrictedTo = [ "abstract" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  datatype(): ClassBuilder {
    this._stereotype = DATATYPE;
    this.restrictedTo(Nature.ABSTRACT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «abstract», which decorates classes
   * whose instances are abstract individuals, i.e., entities that are
   * outside space-time (e.g., `Number`, `Proposition`). Also applies the
   * following defaults:
   * - `restrictedTo = [ "abstract" ]`
   * - `order = 1`
   *
   * @returns this builder, for method chaining.
   */
  abstractClass(): ClassBuilder {
    this._stereotype = ABSTRACT;
    this.restrictedTo(Nature.ABSTRACT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype of the class to «type», which decorates high-order
   * classes whose instances are types themselves (e.g., `AnimalSpecies`).
   * Also applies the following defaults:
   * - `restrictedTo = [ "type" ]`
   * - `order = 2`
   *
   * @returns this builder, for method chaining.
   */
  type(): ClassBuilder {
    this._stereotype = TYPE;
    this.restrictedTo(Nature.TYPE);
    this.order(2);
    return this;
  }

  /**
   * Sets the ontological natures that the instances of the class may have,
   * replacing any previously set natures.
   *
   * @param natures - the nature or natures allowed for instances of the
   *        class.
   * @returns this builder, for method chaining.
   */
  restrictedTo(natures: Nature | Nature[] = []): ClassBuilder {
    this._restrictedTo = utils.arrayFrom(natures);
    return this;
  }

  /**
   * Adds the `functional-complex` nature to the natures allowed for
   * instances of the class.
   *
   * @returns this builder, for method chaining.
   */
  functionalComplexType(): ClassBuilder {
    this._restrictedTo.push(Nature.FUNCTIONAL_COMPLEX);
    return this;
  }

  /**
   * Adds the `collective` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  collectiveType(): ClassBuilder {
    this._restrictedTo.push(Nature.COLLECTIVE);
    return this;
  }

  /**
   * Adds the `quantity` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  quantityType(): ClassBuilder {
    this._restrictedTo.push(Nature.QUANTITY);
    return this;
  }

  /**
   * Adds the `quality` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  qualityType(): ClassBuilder {
    this._restrictedTo.push(Nature.QUALITY);
    return this;
  }

  /**
   * Adds the `intrinsic-mode` nature to the natures allowed for instances of
   * the class.
   *
   * @returns this builder, for method chaining.
   */
  intrinsicModeType(): ClassBuilder {
    this._restrictedTo.push(Nature.INTRINSIC_MODE);
    return this;
  }

  /**
   * Adds the `extrinsic-mode` nature to the natures allowed for instances of
   * the class.
   *
   * @returns this builder, for method chaining.
   */
  extrinsicModeType(): ClassBuilder {
    this._restrictedTo.push(Nature.EXTRINSIC_MODE);
    return this;
  }

  /**
   * Adds the `relator` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  relatorType(): ClassBuilder {
    this._restrictedTo.push(Nature.RELATOR);
    return this;
  }

  /**
   * Adds the `event` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  eventType(): ClassBuilder {
    this._restrictedTo.push(Nature.EVENT);
    return this;
  }

  /**
   * Adds the `situation` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  situationType(): ClassBuilder {
    this._restrictedTo.push(Nature.SITUATION);
    return this;
  }

  /**
   * Adds the `type` nature to the natures allowed for instances of the
   * class, i.e., allows its instances to be high-order types.
   *
   * @returns this builder, for method chaining.
   */
  highOrderType(): ClassBuilder {
    this._restrictedTo.push(Nature.TYPE);

    if (this.order === undefined) {
      if (this._restrictedTo) this.order(2);
    }

    return this;
  }

  /**
   * Adds the `abstract` nature to the natures allowed for instances of the
   * class.
   *
   * @returns this builder, for method chaining.
   */
  abstractType(): ClassBuilder {
    this._restrictedTo.push(Nature.ABSTRACT);
    return this;
  }

  /**
   * Adds the natures of substantials (`functional-complex`, `collective`,
   * and `quantity`) to the natures allowed for instances of the class.
   *
   * @returns this builder, for method chaining.
   */
  substantialType(): ClassBuilder {
    this.functionalComplexType();
    this.collectiveType();
    this.quantityType();

    return this;
  }

  /**
   * Adds the natures of intrinsic moments (`quality` and `intrinsic-mode`)
   * to the natures allowed for instances of the class.
   *
   * @returns this builder, for method chaining.
   */
  intrinsicMomentType(): ClassBuilder {
    this.qualityType();
    this.intrinsicModeType();
    return this;
  }

  /**
   * Adds the natures of extrinsic moments (`relator` and `extrinsic-mode`)
   * to the natures allowed for instances of the class.
   *
   * @returns this builder, for method chaining.
   */
  extrinsicMomentType(): ClassBuilder {
    this.relatorType();
    this.extrinsicModeType();
    return this;
  }

  /**
   * Adds the natures of moments (`quality`, `intrinsic-mode`, `relator`, and
   * `extrinsic-mode`) to the natures allowed for instances of the class.
   *
   * @returns this builder, for method chaining.
   */
  momentType(): ClassBuilder {
    this.intrinsicMomentType();
    this.extrinsicMomentType();
    return this;
  }

  /**
   * Adds the natures of endurant individuals (those of substantials and
   * moments) to the natures allowed for instances of the class.
   *
   * @returns this builder, for method chaining.
   */
  endurantIndividualType(): ClassBuilder {
    this.substantialType();
    this.momentType();
    return this;
  }

  /**
   * Adds the natures of endurants (those of endurant individuals plus
   * `type`) to the natures allowed for instances of the class, and sets the
   * class as orderless.
   *
   * @returns this builder, for method chaining.
   */
  endurantType(): ClassBuilder {
    this.endurantIndividualType();
    this.highOrderType();
    this.orderless();
    return this;
  }

  /**
   * Adds the natures of concrete individuals (those of endurant individuals
   * plus `event` and `situation`) to the natures allowed for instances of
   * the class.
   *
   * @returns this builder, for method chaining.
   */
  concreteIndividualType(): ClassBuilder {
    this.endurantIndividualType();
    this.eventType();
    this.situationType();
    return this;
  }

  /**
   * Adds the natures of all individuals (those of concrete individuals) to
   * the natures allowed for instances of the class, and sets the class as
   * abstract and first-order.
   *
   * @returns this builder, for method chaining.
   */
  individualType(): ClassBuilder {
    this.concreteIndividualType();
    this.abstract();
    this.order(1);
    return this;
  }

  /**
   * Adds all ontological natures (those of concrete individuals plus `type`)
   * to the natures allowed for instances of the class, and sets the class as
   * abstract and orderless.
   *
   * @returns this builder, for method chaining.
   */
  anyType(): ClassBuilder {
    this.concreteIndividualType();
    this.highOrderType();
    this.abstract();
    this.orderless();
    return this;
  }
}
