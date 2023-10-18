import {
  OntoumlType,
  Project,
  Package,
  RelationStereotype,
  Property,
  Class,
  Relation,
  Classifier,
  EXISTENTIAL_DEPENDENCE_STEREOTYPES
} from '..';

export class BinaryRelation extends Relation {
  constructor(
    project: Project,
    source: Classifier<any, any>,
    target: Classifier<any, any>
  ) {
    super(project, [source, target]);
  }

  public get sourceEnd(): Property {
    return this._properties[0];
  }

  public get targetEnd(): Property {
    return this._properties[1];
  }

  public get source(): Classifier<any, any> | undefined {
    return this.sourceEnd.propertyType;
  }

  public get target(): Classifier<any, any> | undefined {
    return this.targetEnd.propertyType;
  }

  assertTypedSource() {
    if (!this.source) {
      throw new Error(
        'The type of the source end of the relation is undefined.'
      );
    }
  }

  assertTargetAsClass() {
    if (!this.isTargetClass()) {
      throw new Error('The target of the relation is not a class.');
    }
  }

  assertTypedTarget() {
    if (!this.target) {
      throw new Error(
        'The type of the target end of the relation is undefined.'
      );
    }
  }

  assertSourceAsClass() {
    if (!this.isSourceClass()) {
      throw new Error('The target of the relation is not a class.');
    }
  }

  assertFromRelationToClass() {
    if (!this.fromRelationToClass()) {
      throw new Error('The relation does not connect a relation to a class.');
    }
  }

  getAllowedStereotypes(): RelationStereotype[] {
    return Object.values(RelationStereotype);
  }

  isSourceClass(): boolean {
    this.assertTypedSource();
    return this.source instanceof Class;
  }

  isTargetClass(): boolean {
    this.assertTypedTarget();
    return this.target instanceof Class;
  }

  getSourceAsClass(): Class {
    this.assertSourceAsClass();
    return this.source as Class;
  }

  getTargetAsClass(): Class {
    this.assertTargetAsClass();
    return this.target as Class;
  }

  isPartWholeRelation(): boolean {
    return (
      this.holdsBetweenClasses() &&
      this.targetEnd.isWholeEnd() &&
      !this.sourceEnd.isWholeEnd()
    );
  }

  fromRelationToClass(): boolean {
    return this.source instanceof Relation && this.target instanceof Class;
  }

  isDerivation(): boolean {
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

  hasDependenceStereotype(): boolean {
    if (!this.stereotype) return false;

    return EXISTENTIAL_DEPENDENCE_STEREOTYPES.includes(this.stereotype);
  }

  isExistentialDependence(): boolean {
    return this.sourceEnd.isReadOnly || this.targetEnd.isReadOnly;
  }

  getDerivedRelation(): Relation {
    return this.getDerivedRelationEnd().propertyType as Relation;
  }

  getDerivedRelationEnd(): Property {
    this.assertFromRelationToClass();

    if (!this.isDerivation()) {
      throw new Error('The relation is not a «derivation».');
    }

    return this.properties[0];
  }

  getTruthmaker(): Class {
    return this.getTruthmakerEnd().propertyType as Class;
  }

  getTruthmakerEnd(): Property {
    this.assertFromRelationToClass();

    if (!this.isDerivation()) {
      throw new Error('The relation is not a «derivation».');
    }

    return this.properties[1];
  }

  getMediatedClass(): Class {
    return this.getMediatedEnd().propertyType as Class;
  }

  getMediatedEnd(): Property {
    if (!this.isMediation()) {
      throw new Error('The relation is not a «mediation».');
    }

    this.assertTargetAsClass();

    return this.targetEnd;
  }

  getRelator(): Class {
    return this.getRelatorEnd().propertyType as Class;
  }

  getRelatorEnd(): Property {
    if (!this.isMediation()) {
      throw new Error('The relation is not a «mediation».');
    }

    if (!this.getSourceAsClass().isRelatorType()) {
      throw new Error('The source of the relation is not a relator type.');
    }

    return this.sourceEnd;
  }

  getBearer(): Class {
    return this.getBearerEnd().propertyType as Class;
  }

  getBearerEnd(): Property {
    if (!this.isCharacterization()) {
      throw new Error('The relation is not a «characterization».');
    }

    this.assertTargetAsClass();

    return this.targetEnd;
  }

  getCharacterizer(): Class {
    return this.getCharacterizerEnd().propertyType as Class;
  }

  getCharacterizerEnd(): Property {
    if (!this.isCharacterization()) {
      throw new Error('The relation is not a «characterization».');
    }

    if (!this.getSourceAsClass().isCharacterizer()) {
      throw new Error(
        'The source of the relation is not a mode or quality type.'
      );
    }

    return this.sourceEnd;
  }

  // All part-whole relations and parthood without stereotype
  // whole is the target. part is the source.
  getPart(): Class {
    return this.getPartEnd().propertyType as Class;
  }

  getPartEnd(): Property {
    if (!this.isPartWholeRelation()) {
      throw new Error('The object is not a part-whole relation.');
    }

    return this.sourceEnd;
  }

  getWholeClass(): Class {
    return this.getWholeEnd().propertyType as Class;
  }

  getWholeEnd(): Property {
    if (!this.isPartWholeRelation()) {
      throw new Error('The object is not a part-whole relation.');
    }

    return this.targetEnd;
  }

  getDependedClass(): Class {
    return this.getDependedEnd().propertyType as Class;
  }

  getDependedEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getDependentClass(): Class {
    return this.getDependentEnd().propertyType as Class;
  }

  getDependentEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getTypeClass(): Class {
    return this.getTypeEnd().propertyType as Class;
  }

  getTypeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getInstanceClass(): Class {
    return this.getInstanceEnd().propertyType as Class;
  }

  getInstanceEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getEventClass(): Class {
    return this.getEventEnd().propertyType as Class;
  }

  getEventEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getEndurantClass(): Class {
    return this.getEndurantEnd().propertyType as Class;
  }

  getEndurantEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getSituationClass(): Class {
    return this.getSituationEnd().propertyType as Class;
  }

  getSituationEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.BINARY_RELATION
    };

    return { ...super.toJSON(), ...object };
  }
}
