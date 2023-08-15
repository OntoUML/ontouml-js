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
  MultilingualText,
  GeneralizationSet,
  Project
} from '..';

export const ORDERLESS_LEVEL = Infinity;

export function parseOrder(orderString: string): number {
  if (orderString === '*') {
    return ORDERLESS_LEVEL;
  } else {
    return isNaN(Number(orderString)) ? 1 : Number(orderString);
  }
}

export class Class extends Classifier<Class, ClassStereotype> {
  private _restrictedTo: OntologicalNature[];
  private _literals: Literal[];
  private _order: number;
  isPowertype: boolean;
  

  constructor(project: Project, container?: Package) {
    super(project, container);

    this._restrictedTo = [];
    this._literals = [];
    this.isPowertype = false;
    this._order = 1;
  }

  public get restrictedTo(): OntologicalNature[] {
    return [...this._restrictedTo];
  }

  public set restrictedTo(value: OntologicalNature[]) {
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
    if(value < 1){
      throw new Error('The order of a class must be greater or equal to one')
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
    return stereotypeUtils.ClassStereotypes;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.CLASS,
      restrictedTo: this.restrictedTo,
      literals: this.literals.map(l => l.id),
      isPowertype: this.isPowertype,
      order: this.getOrderAsString()
    };

    return {...object, ...super.toJSON()};
  }

  public getOrderAsString(): string {
    if (this.order === ORDERLESS_LEVEL) {
      return '*';
    }

    return this.order.toString();
  }

  createAttribute(propertyType?: Class, name?: string): Property {
    // TODO: Discuss the removal of this code block
    // if (this.hasEnumerationStereotype()) {
    //   throw new Error('Cannot create an attribute on an enumeration class.');
    // }
    let attr = new Property(this, propertyType);
    
    if(name){
      attr.addName(name);
    }
    
    this.addAttribute(attr);
    return attr;
  }

  createLiteral(name?: string): Literal {
    let literal = new Literal(this);
    this.addLiteral(literal);
    
    if(name){
      this.setName(name);
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

  allowsSome(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return utils.intersects(this.restrictedTo, naturesArray);
  }

  allowsOnly(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return !_.isEmpty(this.restrictedTo) && !_.isEmpty(naturesArray) && utils.includesAll(naturesArray, this.restrictedTo);
  }

  allowsAll(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return !_.isEmpty(this.restrictedTo) && !_.isEmpty(naturesArray) && utils.includesAll(this.restrictedTo, naturesArray);
  }

  allowsExactly(natures: OntologicalNature | OntologicalNature[]): boolean {
    const naturesArray = utils.arrayFrom(natures);
    return utils.equalContents(this.restrictedTo, naturesArray);
  }

  isEndurantType(): boolean {
    return this.allowsOnly(natureUtils.EndurantNatures);
  }

  isSubstantialType(): boolean {
    return this.allowsOnly(natureUtils.SubstantialNatures);
  }

  isMomentType(): boolean {
    return this.allowsOnly(natureUtils.MomentNatures);
  }

  isFunctionalComplexType(): boolean {
    return this.allowsExactly(OntologicalNature.functional_complex);
  }

  isCollectiveType(): boolean {
    return this.allowsExactly(OntologicalNature.collective);
  }

  isQuantityType(): boolean {
    return this.allowsExactly(OntologicalNature.quantity);
  }

  isIntrinsicMomentType(): boolean {
    return this.allowsOnly(natureUtils.IntrinsicMomentNatures);
  }

  isExtrinsicMomentType(): boolean {
    return this.allowsOnly(natureUtils.ExtrinsicMomentNatures);
  }

  isCharacterizer(): boolean {
    return this.allowsOnly([OntologicalNature.extrinsic_mode, OntologicalNature.intrinsic_mode, OntologicalNature.quality])
  }

  isRelatorType(): boolean {
    return this.allowsExactly(OntologicalNature.relator);
  }

  isIntrinsicModeType(): boolean {
    return this.allowsExactly(OntologicalNature.intrinsic_mode);
  }

  isExtrinsicModeType(): boolean {
    return this.allowsExactly(OntologicalNature.extrinsic_mode);
  }

  isQualityType(): boolean {
    return this.allowsExactly(OntologicalNature.quality);
  }

  isEventType(): boolean {
    return this.allowsExactly(OntologicalNature.event);
  }

  isSituationType(): boolean {
    return this.allowsExactly(OntologicalNature.situation);
  }

  isHighOrderType(): boolean {
    return this.allowsExactly(OntologicalNature.type);
  }

  isAbstractType(): boolean {
    return this.allowsExactly(OntologicalNature.abstract);
  }

  /**
  * @returns true if the class is decorated with a rigid stereotype.
  * @see stereotypeUtils.RigidStereotypes
  */
  isRigid(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.RigidStereotypes);
  }

  /**
  * @returns true if the class is decorated with a semi-rigid stereotype.
  * @see stereotypeUtils.SemiRigidStereotypes
  */
  isSemiRigid(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.SemiRigidStereotypes);
  }
  /**
  * @returns true if the class is decorated with an anti-rigid stereotype.
  * @see stereotypeUtils.AntiRigidStereotypes
  */
  isAntiRigid(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.AntiRigidStereotypes);
  }

  /**
  * @returns true if the class is decorated with a non-sortal stereotype.
  * @see stereotypeUtils.NonSortalStereotypes
  */
  isNonSortal(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.NonSortalStereotypes);
  }

  /**
  * @returns true if the class is decorated with a sortal stereotype.
  * @see stereotypeUtils.SortalStereotypes
  */
  isSortal(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.SortalStereotypes);
  }

  /**
  * @returns true if the class is decorated with an ultimate sortal stereotype, i.e. a stereotype that indicates that the class provides an identity principle to its instances.
  * @see stereotypeUtils.UltimateSortalStereotypes
  */
  isIdentityProvider(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.UltimateSortalStereotypes);
  }

  /**
  * @returns true if the class is decorated with a base sortal stereotype.
  * @see stereotypeUtils.UltimateSortalStereotypes
  */
  isBaseSortal(): boolean {
    return this.isStereotypeOneOf(stereotypeUtils.BaseSortalStereotypes);
  }

  /**
  * @returns true if the class is stereotyped as «type».
  */
  isType(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.TYPE);
  }

  /**
  * @returns true if the class is stereotyped as «event».
  */
  isEvent(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.EVENT);
  }

  /**
  * @returns true if the class is stereotyped as «situation».
  */
  isSituation(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.SITUATION);
  }

  /** TODO
  * @returns true if the class is stereotyped as «abstract».
  */
  isAbstractAbstract(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.ABSTRACT);
  }

  /**
  * @returns true if the class is stereotyped as «datatype».
  */
  isDatatype(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.DATATYPE);
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
    return this.isStereotypeOneOf(ClassStereotype.ENUMERATION);
  }
  
  /**
  * @returns true if the class is stereotyped as «kind».
  */
  isKind(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.KIND);
  }

  /**
   * @returns true if the class is stereotyped as «collective».
   */
  isCollective(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.COLLECTIVE);
  }

  /**
   * @returns true if the class is stereotyped as «quantity».
   */
  isQuantity(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.QUANTITY);
  }

  /**
   * @returns true if the class is stereotyped as «relator».
   */
  isRelator(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.RELATOR);
  }

  /**
   * @returns true if the class is stereotyped as «quality».
   */
  isQuality(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.QUALITY);
  }

  /**
   * @returns true if the class is stereotyped as «mode».
   */
  isMode(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.MODE);
  }

  /**
   * @returns true if the class is stereotyped as «subkind».
   */
  isSubkind(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.SUBKIND);
  }

  /**
   * @returns true if the class is stereotyped as «phase».
   */
  isPhase(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.PHASE);
  }

  /**
   * @returns true if the class is stereotyped as «role».
   */
  isRole(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.ROLE);
  }

  /**
   * @returns true if the class is stereotyped as «historicalRole».
   */
  isHistoricalRole(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.HISTORICAL_ROLE);
  }

  /**
   * @returns true if the class is stereotyped as «category».
   */
  isCategory(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.CATEGORY);
  }

  /**
   * @returns true if the class is stereotyped as «phaseMixin».
   */
  isPhaseMixin(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.PHASE_MIXIN);
  }

  /**
   * @returns true if the class is stereotyped as «roleMixin».
   */
  isRoleMixin(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.ROLE_MIXIN);
  }

  /**
   * @returns true if the class is stereotyped as «historicalRoleMixin».
   */
  isHistoricalRoleMixin(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.HISTORICAL_ROLE_MIXIN);
  }

  /**
   * @returns true if the class is stereotyped as «mixin».
   */
  isMixin(): boolean {
    return this.isStereotypeOneOf(ClassStereotype.MIXIN);
  }

  getUltimateSortalAncestors(): Class[] {
    return this.getFilteredAncestors(ancestor => ancestor.isIdentityProvider());
  }

  getUltimateSortalsDescendants(): Class[] {
    return this.getFilteredDescendants(descendent => descendent.isIdentityProvider());
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
    const allAttributes = thisAndAncestors.reduce((attributesAcc: Property[], _class: Class) => {
      attributesAcc.push(..._class.getAttributes());
      return attributesAcc;
    }, []);

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
    const allLiterals = thisAndAncestors.reduce((literalsAcc: Literal[], _class: Class) => {
      literalsAcc.push(..._class.getLiterals());
      return literalsAcc;
    }, []);

    return allLiterals;
  }

  clone(): Class {
    const clone = { ...this };

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

    this.getContents()
        .filter(content => content instanceof ModelElement)
        .map(content => content as ModelElement)
        .forEach(content => content.replace(originalElement, newElement));
  }

  getGeneralizationSetsWhereCategorizer(): GeneralizationSet[] {
    return this.getGeneralizationSets()
               .filter(gs => gs.categorizer === this);
  }

  
}
