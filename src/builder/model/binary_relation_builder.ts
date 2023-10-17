import {
  Package,
  ClassifierBuilder,
  RelationStereotype,
  Relation,
  BinaryRelation,
  Classifier,
  MATERIAL,
  DERIVATION,
  COMPARATIVE,
  MEDIATION,
  CHARACTERIZATION,
  EXTERNAL_DEPENDENCE,
  COMPONENT_OF,
  MEMBER_OF,
  SUBCOLLECTION_OF,
  SUBQUANTITY_OF,
  INSTANTIATION,
  TERMINATION,
  PARTICIPATIONAL,
  PARTICIPATION,
  HISTORICAL_DEPENDENCE,
  CREATION,
  MANIFESTATION,
  BRINGS_ABOUT,
  TRIGGERS,
  AggregationKind
} from '../..';

export class BinaryRelationBuilder extends ClassifierBuilder<
  BinaryRelationBuilder,
  RelationStereotype
> {
  override _container?: Package;
  override element?: BinaryRelation;

  _source?: Classifier<any, any>;
  _target?: Classifier<any, any>;
  _sourceCardinality: string = '0..*';
  _targetCardinality: string = '0..*';
  _sourceIsReadOnly: boolean = false;
  _targetIsReadOnly: boolean = false;
  _sourceIsOrdered: boolean = false;
  _targetIsOrdered: boolean = false;
  _aggregationKind: AggregationKind = AggregationKind.NONE;

  /**
   * Builds an instance of {@link Relation} with the parameters passed to the builder. **WARNING:** the ordering in which methods are evoked may affect the resulting object. When no methods are evoked, the created class has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `isAbstract: false,`
   * - `isDerived: false,`
   */
  override build(): BinaryRelation {
    if (!this._source) {
      throw new Error('Cannot build a relation without a source.');
    }

    if (!this._target) {
      throw new Error('Cannot build a relation without a target.');
    }

    this.element = new BinaryRelation(
      this.project,
      this._source!,
      this._target!
    );

    const sourceEnd = this.element.sourceEnd;
    sourceEnd.cardinality.value = this._sourceCardinality;
    sourceEnd.isReadOnly = this._sourceIsReadOnly;
    sourceEnd.isOrdered = this._sourceIsOrdered;
    sourceEnd.aggregationKind = AggregationKind.NONE;
    this.project.add(sourceEnd);

    const targetEnd = this.element.targetEnd;
    targetEnd.cardinality.value = this._targetCardinality;
    targetEnd.isReadOnly = this._targetIsReadOnly;
    targetEnd.isOrdered = this._targetIsOrdered;
    targetEnd.aggregationKind = this._aggregationKind;
    this.project.add(targetEnd);

    super.build();
    return this.element;
  }

  source(classifier: Classifier<any, any>): BinaryRelationBuilder {
    this._source = classifier;
    return this;
  }

  target(classifier: Classifier<any, any>): BinaryRelationBuilder {
    this._target = classifier;
    return this;
  }

  sourceCardinality(value: string): BinaryRelationBuilder {
    this._sourceCardinality = value;
    return this;
  }

  targetCardinality(value: string): BinaryRelationBuilder {
    this._targetCardinality = value;
    return this;
  }

  sourceReadOnly(): BinaryRelationBuilder {
    this._sourceIsReadOnly = true;
    return this;
  }

  targetReadOnly(): BinaryRelationBuilder {
    this._targetIsReadOnly = true;
    return this;
  }

  sourceOrdered(): BinaryRelationBuilder {
    this._sourceIsOrdered = true;
    return this;
  }

  targetOrdered(): BinaryRelationBuilder {
    this._targetIsOrdered = true;
    return this;
  }

  aggregation(): BinaryRelationBuilder {
    this._aggregationKind = AggregationKind.SHARED;
    return this;
  }

  composition(): BinaryRelationBuilder {
    this._aggregationKind = AggregationKind.COMPOSITE;
    return this;
  }

  /**
   * Sets the stereotype field and set default values in case of a known ClassStereotype.
   */
  override stereotype(stereotype: string): BinaryRelationBuilder {
    switch (stereotype) {
      case MATERIAL:
        return this.material();
      case DERIVATION:
        return this.derivation();
      case COMPARATIVE:
        return this.comparative();
      case MEDIATION:
        return this.mediation();
      case CHARACTERIZATION:
        return this.characterization();
      case EXTERNAL_DEPENDENCE:
        return this.externalDependence();
      case COMPONENT_OF:
        return this.componentOf();
      case MEMBER_OF:
        return this.memberOf();
      case SUBCOLLECTION_OF:
        return this.subCollectionOf();
      case SUBQUANTITY_OF:
        return this.subQuantityOf();
      case INSTANTIATION:
        return this.instantiation();
      case TERMINATION:
        return this.termination();
      case PARTICIPATIONAL:
        return this.participational();
      case PARTICIPATION:
        return this.participation();
      case HISTORICAL_DEPENDENCE:
        return this.historicalDependence();
      case CREATION:
        return this.creation();
      case MANIFESTATION:
        return this.manifestation();
      case BRINGS_ABOUT:
        return this.bringsAbout();
      case TRIGGERS:
        return this.triggers();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype of the binary relation to «material» and default values:
   * - isDerived = true
   *
   * The values assigned to the source and target end are:
   * - isReadOnly = false
   * - isOrdered = false
   * - multiplicty = 0..*
   * - aggregationKind = NONE
   */
  material(): BinaryRelationBuilder {
    this._stereotype = MATERIAL;
    this.derived();
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «derivation» and default values:
   * - isDerived = false
   *
   * The values assigned to the source and target end are:
   * - isReadOnly = false
   * - isOrdered = false
   * - multiplicty = 1
   * - aggregationKind = NONE
   */
  derivation(): BinaryRelationBuilder {
    this._stereotype = DERIVATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «comparative» and default values:
   * - isDerived = true
   *
   * The values assigned to the source and target end are:
   * - isReadOnly = false
   * - isOrdered = false
   * - multiplicty = 0..*
   * - aggregationKind = NONE
   */
  comparative(): BinaryRelationBuilder {
    this._stereotype = COMPARATIVE;
    this.derived();
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «mediation» and some default values for its meta-properties.
   */
  mediation(): BinaryRelationBuilder {
    this._stereotype = MEDIATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('1');
    this.targetReadOnly();
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «characterization» and some default values for its meta-properties.
   */
  characterization(): BinaryRelationBuilder {
    this._stereotype = CHARACTERIZATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('1');
    this.targetReadOnly();
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «externalDependence» and some default values for its meta-properties.
   */
  externalDependence(): BinaryRelationBuilder {
    this._stereotype = EXTERNAL_DEPENDENCE;
    this.sourceCardinality('0..*');
    this.targetCardinality('1');
    this.targetReadOnly();
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «componentOf» and some default values for its meta-properties.
   */
  componentOf(): BinaryRelationBuilder {
    this._stereotype = COMPONENT_OF;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «memberOf» and some default values for its meta-properties.
   */
  memberOf(): BinaryRelationBuilder {
    this._stereotype = MEMBER_OF;
    this.aggregation();
    this.sourceCardinality('1..*');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «subCollectionOf» and some default values for its meta-properties.
   */
  subCollectionOf(): BinaryRelationBuilder {
    this._stereotype = SUBCOLLECTION_OF;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «subQuantityOf» and some default values for its meta-properties.
   */
  subQuantityOf(): BinaryRelationBuilder {
    this._stereotype = SUBQUANTITY_OF;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «instantiation» and some default values for its meta-properties.
   */
  instantiation(): BinaryRelationBuilder {
    this._stereotype = INSTANTIATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('0..*');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «termination» and some default values for its meta-properties.
   */
  termination(): BinaryRelationBuilder {
    this._stereotype = TERMINATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «participational» and some default values for its meta-properties.
   */
  participational(): BinaryRelationBuilder {
    this._stereotype = PARTICIPATIONAL;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «participation» and some default values for its meta-properties.
   */
  participation(): BinaryRelationBuilder {
    this._stereotype = PARTICIPATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «historicalDependence» and some default values for its meta-properties.
   */
  historicalDependence(): BinaryRelationBuilder {
    this._stereotype = HISTORICAL_DEPENDENCE;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «creation» and some default values for its meta-properties.
   */
  creation(): BinaryRelationBuilder {
    this._stereotype = CREATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «manifestation» and some default values for its meta-properties.
   */
  manifestation(): BinaryRelationBuilder {
    this._stereotype = MANIFESTATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «bringsAbout» and some default values for its meta-properties.
   */
  bringsAbout(): BinaryRelationBuilder {
    this._stereotype = BRINGS_ABOUT;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «triggers» and some default values for its meta-properties.
   */
  triggers(): BinaryRelationBuilder {
    this._stereotype = TRIGGERS;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }
}
