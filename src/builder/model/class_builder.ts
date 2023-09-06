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

export class ClassBuilder extends ClassifierBuilder<
  ClassBuilder,
  ClassStereotype
> {
  override element?: Class;

  private _restrictedTo: Nature[] = [];
  private _order: number = 1;
  private _isPowertype: boolean = false;

  /**
   * Builds an instance of {@link Class} with the parameters passed to the builder. **WARNING:** the ordering in which methods are evoked may affect the resulting object. When no methods are evoked, the created class has the following defaults:
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

  order(order: number): ClassBuilder {
    this._order = order;
    return this;
  }

  orderless(): ClassBuilder {
    this._order = ORDERLESS_LEVEL;
    return this;
  }

  powertype(): ClassBuilder {
    this._isPowertype = true;

    if (this._order < 2) this.order(2);

    return this;
  }

  nonPowertype(): ClassBuilder {
    this._isPowertype = false;
    return this;
  }

  /**
   * Sets the stereotype field and set default values in case of a known ClassStereotype.
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
   * Sets the stereotype field to `«kind»` as well as the following default values:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `order = 1`
   */
  kind(): ClassBuilder {
    this._stereotype = KIND;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«collective»` as well as the following default values:
   * - `restrictedTo = [ "collective" ]`
   * - `order = 1`
   */
  collective(): ClassBuilder {
    this._stereotype = COLLECTIVE;
    this.restrictedTo(Nature.COLLECTIVE);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«quantity»` as well as the following default values:
   * - `restrictedTo = [ "quantity" ]`
   * - `order = 1`
   */
  quantity(): ClassBuilder {
    this._stereotype = QUANTITY;
    this.restrictedTo(Nature.QUANTITY);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«relator»` as well as the following default values:
   * - `restrictedTo = [ "relator" ]`
   * - `order = 1`
   */
  relator(): ClassBuilder {
    this._stereotype = RELATOR;
    this.restrictedTo(Nature.RELATOR);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«quality»` as well as the following default values:
   * - `restrictedTo = [ "quality" ]`
   * - `order = 1`
   */
  quality(): ClassBuilder {
    this._stereotype = QUALITY;
    this.restrictedTo(Nature.QUALITY);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«mode»` as well as the following default values:
   * - `restrictedTo = [ "intrinsic-mode" ]`
   * - `order = 1`
   */
  mode(): ClassBuilder {
    this._stereotype = MODE;
    this.restrictedTo(Nature.INTRINSIC_MODE);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«subkind»`.
   */
  subkind(): ClassBuilder {
    this._stereotype = SUBKIND;
    return this;
  }

  /**
   * Sets the stereotype field to `«role»`.
   */
  role(): ClassBuilder {
    this._stereotype = ROLE;
    return this;
  }

  /**
   * Sets the stereotype field to `«phase»`.
   */
  phase(): ClassBuilder {
    this._stereotype = PHASE;
    return this;
  }

  /**
   * Sets the stereotype field to `«category»` as well as the following default values:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   */
  category(): ClassBuilder {
    this._stereotype = CATEGORY;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype field to `«mixin»` as well as the following default values:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   */
  mixin(): ClassBuilder {
    this._stereotype = MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype field to `«roleMixin»` as well as the following default values:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   */
  roleMixin(): ClassBuilder {
    this._stereotype = ROLE_MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype field to `«phaseMixin»` as well as the following default values:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   */
  phaseMixin(): ClassBuilder {
    this._stereotype = PHASE_MIXIN;
    this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype field to `«event»` as well as the following default values:
   * - `restrictedTo = [ "event" ]`
   * - `order = 1`
   */
  event(): ClassBuilder {
    this._stereotype = EVENT;
    this.restrictedTo(Nature.EVENT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«situation»` as well as the following default values:
   * - `restrictedTo = [ "situation" ]`
   * - `order = 1`
   */
  situation(): ClassBuilder {
    this._stereotype = SITUATION;
    this.restrictedTo(Nature.SITUATION);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«historicalRole»`.
   */
  historicalRole(): ClassBuilder {
    this._stereotype = HISTORICAL_ROLE;
    return this;
  }

  /**
   * Sets the stereotype field to `«historicalRoleMixin»` as well as the following default values:
   * - `restrictedTo = [ "functional-complex" ]`
   * - `isAbstract = true`
   */
  historicalRoleMixin(): ClassBuilder {
    this._stereotype = HISTORICAL_ROLE_MIXIN;
    this.restrictedTo(Nature.SITUATION);
    this.abstract();
    return this;
  }

  /**
   * Sets the stereotype field to `«enumeration»` as well as the following default values:
   * - `restrictedTo = [ "abstract" ]`
   * - `order = 1`
   */
  enumeration(): ClassBuilder {
    this._stereotype = ENUMERATION;
    this.restrictedTo(Nature.ABSTRACT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«datatype»` as well as the following default values:
   * - `restrictedTo = [ "abstract" ]`
   * - `order = 1`
   */
  datatype(): ClassBuilder {
    this._stereotype = DATATYPE;
    this.restrictedTo(Nature.ABSTRACT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«abstract»` as well as the following default values:
   * - `restrictedTo = [ "abstract" ]`
   * - `order = 1`
   */
  abstractClass(): ClassBuilder {
    this._stereotype = ABSTRACT;
    this.restrictedTo(Nature.ABSTRACT);
    this.order(1);
    return this;
  }

  /**
   * Sets the stereotype field to `«type»` as well as the following default values:
   * - `restrictedTo = [ "type" ]`
   * - `order = 2`
   */
  type(): ClassBuilder {
    this._stereotype = TYPE;
    this.restrictedTo(Nature.TYPE);
    this.order(2);
    return this;
  }

  restrictedTo(natures: Nature | Nature[] = []): ClassBuilder {
    this._restrictedTo = utils.arrayFrom(natures);
    return this;
  }

  functionalComplexType(): ClassBuilder {
    this._restrictedTo.push(Nature.FUNCTIONAL_COMPLEX);
    return this;
  }

  collectiveType(): ClassBuilder {
    this._restrictedTo.push(Nature.COLLECTIVE);
    return this;
  }

  quantityType(): ClassBuilder {
    this._restrictedTo.push(Nature.QUANTITY);
    return this;
  }

  qualityType(): ClassBuilder {
    this._restrictedTo.push(Nature.QUALITY);
    return this;
  }

  intrinsicModeType(): ClassBuilder {
    this._restrictedTo.push(Nature.INTRINSIC_MODE);
    return this;
  }

  extrinsicModeType(): ClassBuilder {
    this._restrictedTo.push(Nature.EXTRINSIC_MODE);
    return this;
  }

  relatorType(): ClassBuilder {
    this._restrictedTo.push(Nature.RELATOR);
    return this;
  }

  eventType(): ClassBuilder {
    this._restrictedTo.push(Nature.EVENT);
    return this;
  }

  situationType(): ClassBuilder {
    this._restrictedTo.push(Nature.SITUATION);
    return this;
  }

  highOrderType(): ClassBuilder {
    this._restrictedTo.push(Nature.TYPE);

    if (this.order === undefined) {
      if (this._restrictedTo) this.order(2);
    }

    return this;
  }

  abstractType(): ClassBuilder {
    this._restrictedTo.push(Nature.ABSTRACT);
    return this;
  }

  substantialType(): ClassBuilder {
    this.functionalComplexType();
    this.collectiveType();
    this.quantityType();

    return this;
  }

  intrinsicMomentType(): ClassBuilder {
    this.qualityType();
    this.intrinsicModeType();
    return this;
  }

  extrinsicMomentType(): ClassBuilder {
    this.relatorType();
    this.extrinsicModeType();
    return this;
  }

  momentType(): ClassBuilder {
    this.intrinsicMomentType();
    this.extrinsicMomentType();
    return this;
  }

  endurantIndividualType(): ClassBuilder {
    this.substantialType();
    this.momentType();
    return this;
  }

  endurantType(): ClassBuilder {
    this.endurantIndividualType();
    this.highOrderType();
    this.orderless();
    return this;
  }

  concreteIndividualType(): ClassBuilder {
    this.endurantIndividualType();
    this.eventType();
    this.situationType();
    return this;
  }

  individualType(): ClassBuilder {
    this.concreteIndividualType();
    this.abstract();
    this.order(1);
    return this;
  }

  anyType(): ClassBuilder {
    this.concreteIndividualType();
    this.highOrderType();
    this.abstract();
    this.orderless();
    return this;
  }
}
