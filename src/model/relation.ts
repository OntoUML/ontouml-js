import {
  OntoumlElement,
  OntoumlType,
  Class,
  Classifier,
  ClassStereotype,
  RelationStereotype,
  ModelElement,
  Package,
  Property,
  stereotypeUtils,
  Stereotype
} from '..';

export class Relation extends Classifier<Relation, RelationStereotype> {
  constructor(base?: Partial<Relation>) {
    super(OntoumlType.RELATION, base);
  }

  getContents(): OntoumlElement[] {
    return [...this.properties];
  }

  getAllowedStereotypes(): RelationStereotype[] {
    return stereotypeUtils.RelationStereotypes;
  }

  hasValidStereotype(allowsNone: boolean = true): boolean {
    return super.hasValidStereotype(allowsNone);
  }

  toJSON(): any {
    const relationSerialization = {
      type: OntoumlType.RELATION,
      stereotype: null,
      properties: null,
      isAbstract: false,
      isDerived: false
    };

    Object.assign(relationSerialization, super.toJSON());

    return relationSerialization;
  }

  createSourceEnd(base?: Partial<Property>): Property {
    this.properties = this.properties || [];

    if (this.properties[0]) {
      throw new Error('Source already defined');
    }

    const sourceEnd = new Property({ ...base, container: this, project: this.project });

    this.properties[0] = sourceEnd;

    return sourceEnd;
  }

  createTargetEnd(base?: Partial<Property>): Property {
    this.properties = this.properties || [];

    if (this.properties[1]) {
      throw new Error('Target already defined');
    }

    const targetEnd = new Property({ ...base, container: this, project: this.project });

    this.properties[1] = targetEnd;

    return targetEnd;
  }

  /**
   * Create member end at designated position. If no position is informed, append the member end at the last position.
   *
   * @param position - position to place the member end; optional
   * @param base - partial property object to base the new member end; optional
   * */
  createMemberEnd(position?: number, base?: Partial<Property>): Property {
    this.properties = this.properties || [];
    position = position || position === 0 ? position : this.properties.length;

    if (typeof position !== 'number' || position < 0) {
      throw new Error(`Invalid position value: ${position}`);
    }

    if (this.properties[position]) {
      throw new Error('Member already defined in this position');
    }

    const memberEnd = new Property({ ...base, container: this, project: this.project });
    position = position;

    this.properties[position] = memberEnd;

    return memberEnd;
  }

  getSourceEnd(): Property {
    if (!this.isBinary()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getTargetEnd(): Property {
    if (!this.isBinary()) {
      throw new Error('Unable to retrieve target end on a non-binary relation');
    }
    return this.properties[1];
  }

  getMemberEnd(position: number): Property {
    this.assertDefinedProperties()
    
    if(position < 0 || position >= this.properties.length){
      throw new Error('Position out of bonds. Position should be greater than 0 and less than '+this.properties.length);
    }
    
    return this.properties[position];
  }

  getDerivingRelationEnd(): Property {
    if (!this.fromRelationToClass()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getDerivedClassEnd(): Property {
    if (!this.fromRelationToClass()) {
      throw new Error('Unable to retrieve target end on a non-binary relation');
    }
    return this.properties[1];
  }

  getSource(): Classifier<any, any> | undefined {
    return this.getSourceEnd().propertyType;
  }

  getTarget(): Classifier<any, any> | undefined {
    return this.getTargetEnd().propertyType;
  }

  getMember(position: number): Classifier<any, any> | undefined {
    return this.getMemberEnd(position).propertyType;
  }

  getMembers(): Classifier<any, any>[] {
    this.assertTypedProperties();
    let members = this.properties.map(prop => prop.propertyType!) || [];
    return [...new Set(members)];
  }

  assertDefinedProperties() {
    if (!this.properties) {
      throw new Error("The `properties` field is null or undefined.");
    }
  }

  assertTypedSource() {
    const source = this.getSource();
    
    if(!source) {
      throw new Error('The type of the source end of the relation is undefined.')
    }
  }

  assertTypedTarget() {
    const target = this.getTarget();
    
    if(!target) {
      throw new Error('The type of the target end of the relation is undefined.')
    }
  }

  private assertTypedMember(position: number) {
    const member = this.getMember(position);
    
    if(!member) {
      throw new Error(`The type of member end ${position} of the relation is undefined.`)
    }
  }

  private assertTypedProperties() {
    this.assertDefinedProperties();

    const typeLessProperty = this.properties.find(p => !p.propertyType);
    
    if(typeLessProperty){
      throw new Error("A property of the relation does not have a propertyType: " + typeLessProperty);
    }
  }

  isSourceClass(): boolean {
    this.assertTypedSource();
    return this.getSource() instanceof Class;
  }

  isTargetClass(): boolean {
    this.assertTypedTarget();
    return this.getTarget() instanceof Class;
  }

  isMemberClass(position: number): boolean {
    this.assertTypedMember(position);
    return this.getMember(position) instanceof Class;
  }

  getSourceAsClass(): Class {
    if(!this.isSourceClass()){
      throw new Error('The source of the relation is not a class.')
    }

    return this.getSource() as Class;
  }

  getTargetAsClass(): Class {
    if(!this.isTargetClass()){
      throw new Error('The target of the relation is not a class.')
    }

    return this.getTarget() as Class;
  }

  getMemberAsClass(position: number): Class {
    if(!this.isMemberClass(position)){
      throw new Error(`The member ${position} of the relation is not a class.`)
    }

    return this.getMember(position) as Class;
  }

  getDerivingRelation(): Relation {
    if (!this.fromRelationToClass()) {
      throw new Error('Unable to retrieve deriving relation from non-derivation relation');
    }
    return this.getDerivingRelationEnd().propertyType as Relation;
  }

  getDerivedClass(): Class {
    if (!this.fromRelationToClass()) {
      throw new Error('Unable to retrieve derived class from non-derivation relation');
    }
    return this.getDerivedClassEnd().propertyType as Class;
  }

  getSourceStereotype(): Stereotype | undefined{
    this.assertTypedSource();
    return this.getSource()?.stereotype;
  }
  
  getTargetStereotype(): Stereotype | undefined{
    this.assertTypedTarget();
    return this.getTarget()?.stereotype;
  }

  getSourceClassStereotype(): ClassStereotype | undefined{
    return this.getSourceAsClass().stereotype;
  }

  getTargetClassStereotype(): ClassStereotype | undefined{
    return this.getTargetAsClass().stereotype;
  }

  getMemberClassStereotype(position: number): ClassStereotype | undefined{
    return this.getMemberAsClass(position).stereotype;
  }

  getDerivingRelationStereotype(): RelationStereotype | undefined{
    return this.getDerivingRelation().stereotype;
  }

  getDerivedClassStereotype(): ClassStereotype | undefined{
    return this.getDerivedClass().stereotype;
  }

  // TODO: check whether isBinaryRelation() is a better name
  isBinary(): boolean {
    this.assertDefinedProperties();
    return this.properties?.length === 2;
  }

  // TODO: check whether isTernaryRelation() is a better name
  isHighArity(): boolean {
    this.assertDefinedProperties();
    return this.properties?.length > 2;
  }

  isBinaryClassRelation(): boolean {
    return this.isBinary() && this.holdsBetweenClasses();
  }

  holdsBetweenClasses(): boolean {
    this.assertTypedProperties();
    return this.getMembers().every(c => c instanceof Class)
  }

  fromRelationToClass(): boolean {
    return (
      this.isBinary() && this.properties[0].propertyType instanceof Relation && this.properties[1].propertyType instanceof Class
    );
  }

  isHighArityClassRelation(): boolean {
    return this.isHighArity() && this.holdsBetweenClasses();
  }

  isPartWholeRelation(): boolean {
    return this.isBinaryClassRelation() && this.getTargetEnd().isAggregationEnd();
  }

  // TODO: check weather ternary relations may denote existential dependencies
  isExistentialDependency(): boolean {
    if(this.isHighArity()){
      return false;
    }

    return this.getSourceEnd().isReadOnly || this.getTargetEnd().isReadOnly;
  }

  isSourceExistentiallyDependent(): boolean {
    return this.getTargetEnd().isReadOnly;
  }

  isTargetExistentiallyDependent(): boolean {
    return this.getSourceEnd().isReadOnly;
  }

  isBinaryExistentialDependency(): boolean {
    return this.isSourceExistentiallyDependent() || this.isTargetExistentiallyDependent();
  }

  hasExistentialDependencyStereotype(): boolean {
    if(!this.stereotype)
      return false;

    return stereotypeUtils.ExistentialDependencyRelationStereotypes.includes(this.stereotype);
  }

  isMaterial(): boolean {
    return this.stereotype === RelationStereotype.MATERIAL;
  }

  isDerivation2(): boolean {
    return this.stereotype === RelationStereotype.DERIVATION;
  }

  isComparative(): boolean {
    return this.stereotype === RelationStereotype.COMPARATIVE;
  }

  isMediation(): boolean {
    return this.stereotype === RelationStereotype.MEDIATION;
  }

  isCharacterization(): boolean {
    return this.stereotype === RelationStereotype.CHARACTERIZATION;
  }

  isExternalDependence(): boolean {
    return this.stereotype === RelationStereotype.EXTERNAL_DEPENDENCE;
  }

  isComponentOf(): boolean {
    return this.stereotype === RelationStereotype.COMPONENT_OF;
  }

  isMemberOf(): boolean {
    return this.stereotype === RelationStereotype.MEMBER_OF;
  }

  isSubCollectionOf(): boolean {
    return this.stereotype === RelationStereotype.SUBCOLLECTION_OF;
  }

  isSubQuantityOf(): boolean {
    return this.stereotype === RelationStereotype.SUBQUANTITY_OF;
  }

  isInstantiation(): boolean {
    return this.stereotype === RelationStereotype.INSTANTIATION;
  }

  isTermination(): boolean {
    return this.stereotype === RelationStereotype.TERMINATION;
  }

  isParticipational(): boolean {
    return this.stereotype === RelationStereotype.PARTICIPATIONAL;
  }

  isParticipation(): boolean {
    return this.stereotype === RelationStereotype.PARTICIPATION;
  }

  isHistoricalDependence(): boolean {
    return this.stereotype === RelationStereotype.HISTORICAL_DEPENDENCE;
  }

  isCreation(): boolean {
    return this.stereotype === RelationStereotype.CREATION;
  }

  isManifestation(): boolean {
    return this.stereotype === RelationStereotype.MANIFESTATION;
  }

  isBringsAbout(): boolean {
    return this.stereotype === RelationStereotype.BRINGS_ABOUT;
  }

  isTriggers(): boolean {
    return this.stereotype === RelationStereotype.TRIGGERS;
  }

  holdsBetween(...conditions: ((relationEnd: Property) => boolean)[]): boolean {
    if (this.properties.length !== conditions.length) {
      throw new Error('Method requires a same number conditions and relation ends');
    }
    return this.properties.every((relationEnd: Property, relationEndIndex: number) => conditions[relationEndIndex](relationEnd));
  }

  holdsBetweenEvents(): boolean {
    // TODO: Check second condition. It may be useless.
    if (!this.isBinaryClassRelation() || this.fromRelationToClass()) {
      return false;
    }

    const isEndTypeAnEvent = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isEventType();
    return this.holdsBetween(isEndTypeAnEvent, isEndTypeAnEvent);
  }

  holdsBetweenMoments(): boolean {
    if (!this.isBinaryClassRelation() || this.fromRelationToClass()) {
      return false;
    }

    const isEndTypeAMoment = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isMomentType();
    return this.holdsBetween(isEndTypeAMoment, isEndTypeAMoment);
  }

  holdsBetweenSubstantials(): boolean {
    if (!this.isBinaryClassRelation() || this.fromRelationToClass()) {
      return false;
    }

    const isEndTypeASubstantial = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isSubstantialType();
    return this.holdsBetween(isEndTypeASubstantial, isEndTypeASubstantial);
  }

  clone(): Relation {
    const clone = new Relation(this);

    if (clone.properties) {
      clone.properties = clone.properties.map((attribute: Property) => attribute.clone());
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    this.getContents()
        .map(content => content as ModelElement)
        .forEach(content => content.replace(originalElement, newElement));
  }

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is a derivation relation (see `isDerivation()`).
   */
  // getTruthmakerClass(): Class {
  //   throw new Error('Method unimplemented!');
  // }

  // TODO: support specific methods for binary, nary, and derivations, throwing exception when otherwise

  getMediatedClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getMediatedEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getRelatorClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getRelatorEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  // Applies only to characterization
  getBearerClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getBearerEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getInheringClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getInheringEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  // All part-whole relations and parthood without stereotype
  getPartClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getPartEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getWholeClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getWholeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getDependedClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getDependedEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getDependentClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getDependentEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getTypeClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getTypeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getInstanceClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getInstanceEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getEventClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getEventEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getEndurantClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getEndurantEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getSituationClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getSituationEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Verify is a class participates in relation
   * @param _class The classe to be verified
   */
   involves(_class: Class): boolean {
     if (!this.fromRelationToClass()){
      if (_class == this.getSourceAsClass() || _class == this.getTargetAsClass()) {
        return true;
      } else return false;
     }else{
       if (_class == this.getDerivedClass())
       return true;
     }

     return false;
    
  }
  // TODO: Bring in the relevant relations from Class
}
