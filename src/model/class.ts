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
  GeneralizationSet
} from '..';

export const ORDERLESS_LEVEL = Infinity;

export class Class extends Classifier<Class, ClassStereotype> {
  restrictedTo: OntologicalNature[];
  literals: Literal[];
  isExtensional: boolean;
  isPowertype: boolean;
  order: number;

  constructor(base?: Partial<Class>) {
    super(OntoumlType.CLASS, base);

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
    const object: any = {
      type: OntoumlType.CLASS,
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

    if (object.order === ORDERLESS_LEVEL) {
      object.order =  '*';
    }

    return object;
  }

  createAttribute(propertyType?: Class, name?: string, base?: Partial<Property>): Property {
    // TODO: Discuss the removal of this code block
    // if (this.hasEnumerationStereotype()) {
    //   throw new Error('Cannot create an attribute on an enumeration class.');
    // }
    let attribute = new Property(base);
    
    if(name){
      attribute.name.addText(name);
    }

    if(propertyType){
      attribute.propertyType = propertyType;
    }
    
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
      throw new Error('Cannot add a null attribute');
    }

    attribute.setContainer(this);
    this.properties.push(attribute);
  }

  addLiteral(literal: Literal): void {
    if (!literal) {
      throw new Error('Cannot add a null literal');
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
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isRigid(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.RigidStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isSemiRigid(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.SemiRigidStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isAntiRigid(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.AntiRigidStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isNonSortal(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.NonSortalStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isSortal(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.SortalStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isIdentityProvider(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.UltimateSortalStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «», «», or «».
  */
  isBaseSortal(): boolean {
    return this.stereotypeIsOneOf(stereotypeUtils.BaseSortalStereotypes);
  }

  /**
  * Returns true if the class is stereotyped as «type».
  */
  isType(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.TYPE);
  }

  /**
  * Returns true if the class is stereotyped as «event».
  */
  isEvent(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.EVENT);
  }

  /**
  * Returns true if the class is stereotyped as «situation».
  */
  isSituation(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.SITUATION);
  }

  /** TODO
  * Returns true if the class is stereotyped as «abstract».
  */
  isAbstractAbstract(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.ABSTRACT);
  }

  /**
  * Returns true if the class is stereotyped as «datatype».
  */
  isDatatype(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.DATATYPE);
  }

  isComplexDatatype(): boolean {
    return this.isAbstractType() && this.isDatatype() && this.hasAttributes();
  }

  isPrimitiveDatatype(): boolean {
    return this.isAbstractType() && this.isDatatype() && !this.hasAttributes();
  }
  
  /**
  * Returns true if the class is stereotyped as «enumeration».
  */
  isEnumeration(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.ENUMERATION);
  }
  
  /**
  * Returns true if the class is stereotyped as «kind».
  */
  isKind(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.KIND);
  }

  /**
   * Returns true if the class is stereotyped as «collective».
   */
  isCollective(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.COLLECTIVE);
  }

  /**
   * Returns true if the class is stereotyped as «quantity».
   */
  isQuantity(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.QUANTITY);
  }

  /**
   * Returns true if the class is stereotyped as «relator».
   */
  isRelator(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.RELATOR);
  }

  /**
   * Returns true if the class is stereotyped as «quality».
   */
  isQuality(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.QUALITY);
  }

  /**
   * Returns true if the class is stereotyped as «mode».
   */
  isMode(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.MODE);
  }

  /**
   * Returns true if the class is stereotyped as «subkind».
   */
  isSubkind(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.SUBKIND);
  }

  /**
   * Returns true if the class is stereotyped as «phase».
   */
  isPhase(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.PHASE);
  }

  /**
   * Returns true if the class is stereotyped as «role».
   */
  isRole(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.ROLE);
  }

  /**
   * Returns true if the class is stereotyped as «historicalRole».
   */
  isHistoricalRole(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.HISTORICAL_ROLE);
  }

  /**
   * Returns true if the class is stereotyped as «category».
   */
  isCategory(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.CATEGORY);
  }

  /**
   * Returns true if the class is stereotyped as «phaseMixin».
   */
  isPhaseMixin(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.PHASE_MIXIN);
  }

  /**
   * Returns true if the class is stereotyped as «roleMixin».
   */
  isRoleMixin(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.ROLE_MIXIN);
  }

  /**
   * Returns true if the class is stereotyped as «historicalRoleMixin».
   */
  isHistoricalRoleMixin(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.HISTORICAL_ROLE_MIXIN);
  }

  /**
   * Returns true if the class is stereotyped as «mixin».
   */
  isMixin(): boolean {
    return this.stereotypeIsOneOf(ClassStereotype.MIXIN);
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
   * Returns attributes defined in the class, excluding inherited ones 
   * */
  getAttributes(): Property[] {
    if (this.isEnumeration()) {
      throw new Error('Cannot retrieve attributes from an enumeration.');
    }

    return this.properties ? [...this.properties] : [];
  }

  /** 
   * Returns both own and inherited attributes 
   * */
  getAllAttributes(): Property[] {
    const thisAndAncestors = [this, ...this.getAncestors()];
    const allAttributes = thisAndAncestors.reduce((attributesAcc: Property[], _class: Class) => {
      attributesAcc.push(..._class.getAttributes());
      return attributesAcc;
    }, []);

    return allAttributes;
  }

  /** Returns both own literals, excluding inherited ones */
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

    this.getContents()
        .filter(content => content instanceof ModelElement)
        .map(content => content as ModelElement)
        .forEach(content => content.replace(originalElement, newElement));
  }

  getGeneralizationSetsWhereCategorizer(): GeneralizationSet[] {
    return this.getGeneralizationSets()
               .filter(gs => gs.categorizer === this);
  }

  /**
   * Returns not only ancestors and descendants, but also those reachable through non-disjoint diverging branch in generalization hierarchies
   */
  getUltimateSortalsInReach(): Class[] {
    throw new Error('Method unimplemented!');
  }

  // TODO: investigate TSLint error TS6133 "'filter' is declared but its value is never read"
  getRelations(_filter?: Function): Relation[] {
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
