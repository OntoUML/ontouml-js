import {
  Package,
  ClassifierBuilder,
  RelationStereotype,
  BinaryRelation,
  Classifier,
  AggregationKind
} from '../..';

/**
 * A fluent builder for {@link BinaryRelation} instances.
 *
 * This builder configures the source and target ends of the relation
 * (classifier, cardinality, ordering, read-only status, and aggregation
 * kind), as well as its OntoUML stereotype, offering shortcut methods such
 * as `material()` and `mediation()` that also apply the default
 * meta-property values prescribed for each stereotype.
 *
 * @example
 * ```typescript
 * const marriedTo = project
 *   .binaryRelationBuilder()
 *   .material()
 *   .name('married to')
 *   .source(person)
 *   .target(person)
 *   .build();
 * ```
 */
export class BinaryRelationBuilder extends ClassifierBuilder<
  BinaryRelationBuilder,
  RelationStereotype
> {
  declare _container?: Package;
  declare element?: BinaryRelation;

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
   * Builds an instance of {@link BinaryRelation} with the parameters passed
   * to the builder. Both the source and the target classifiers are required
   * before `build()` is evoked. **WARNING:** the ordering in which methods
   * are evoked may affect the resulting object. When no methods are evoked,
   * the created relation has the following defaults:
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

  /**
   * Sets the {@link Classifier} connected to the source end of the relation.
   *
   * @returns this builder, for method chaining.
   */
  source(classifier: Classifier<any, any>): BinaryRelationBuilder {
    this._source = classifier;
    return this;
  }

  /**
   * Sets the {@link Classifier} connected to the target end of the relation.
   *
   * @returns this builder, for method chaining.
   */
  target(classifier: Classifier<any, any>): BinaryRelationBuilder {
    this._target = classifier;
    return this;
  }

  /**
   * Sets the cardinality of the source end of the relation.
   *
   * @param value - the cardinality expression (e.g., `"1"`, `"0..*"`).
   * @returns this builder, for method chaining.
   */
  sourceCardinality(value: string): BinaryRelationBuilder {
    this._sourceCardinality = value;
    return this;
  }

  /**
   * Sets the cardinality of the target end of the relation.
   *
   * @param value - the cardinality expression (e.g., `"1"`, `"0..*"`).
   * @returns this builder, for method chaining.
   */
  targetCardinality(value: string): BinaryRelationBuilder {
    this._targetCardinality = value;
    return this;
  }

  /**
   * Sets the source end of the relation as read-only, i.e., as an end whose
   * values cannot change once assigned.
   *
   * @returns this builder, for method chaining.
   */
  sourceReadOnly(): BinaryRelationBuilder {
    this._sourceIsReadOnly = true;
    return this;
  }

  /**
   * Sets the target end of the relation as read-only, i.e., as an end whose
   * values cannot change once assigned.
   *
   * @returns this builder, for method chaining.
   */
  targetReadOnly(): BinaryRelationBuilder {
    this._targetIsReadOnly = true;
    return this;
  }

  /**
   * Sets the source end of the relation as ordered, i.e., as an end whose
   * values are arranged in a meaningful sequence.
   *
   * @returns this builder, for method chaining.
   */
  sourceOrdered(): BinaryRelationBuilder {
    this._sourceIsOrdered = true;
    return this;
  }

  /**
   * Sets the target end of the relation as ordered, i.e., as an end whose
   * values are arranged in a meaningful sequence.
   *
   * @returns this builder, for method chaining.
   */
  targetOrdered(): BinaryRelationBuilder {
    this._targetIsOrdered = true;
    return this;
  }

  /**
   * Sets the aggregation kind of the target end of the relation to shared
   * aggregation, marking the relation as a parthood in which parts may be
   * shared among multiple wholes.
   *
   * @returns this builder, for method chaining.
   */
  aggregation(): BinaryRelationBuilder {
    this._aggregationKind = AggregationKind.SHARED;
    return this;
  }

  /**
   * Sets the aggregation kind of the target end of the relation to composite
   * aggregation, marking the relation as a parthood in which parts belong to
   * at most one whole.
   *
   * @returns this builder, for method chaining.
   */
  composition(): BinaryRelationBuilder {
    this._aggregationKind = AggregationKind.COMPOSITE;
    return this;
  }

  /**
   * Sets the stereotype of the relation, delegating to the corresponding
   * shortcut method (e.g., `material()`, `mediation()`) when the value is a
   * known {@link RelationStereotype}, in which case the default meta-property
   * values of the stereotype are also applied.
   *
   * @param stereotype - the stereotype to decorate the relation with.
   * @returns this builder, for method chaining.
   */
  override stereotype(stereotype: string): BinaryRelationBuilder {
    switch (stereotype) {
      case RelationStereotype.MATERIAL:
        return this.material();
      case RelationStereotype.DERIVATION:
        return this.derivation();
      case RelationStereotype.COMPARATIVE:
        return this.comparative();
      case RelationStereotype.MEDIATION:
        return this.mediation();
      case RelationStereotype.CHARACTERIZATION:
        return this.characterization();
      case RelationStereotype.EXTERNAL_DEPENDENCE:
        return this.externalDependence();
      case RelationStereotype.COMPONENT_OF:
        return this.componentOf();
      case RelationStereotype.MEMBER_OF:
        return this.memberOf();
      case RelationStereotype.SUBCOLLECTION_OF:
        return this.subCollectionOf();
      case RelationStereotype.SUBQUANTITY_OF:
        return this.subQuantityOf();
      case RelationStereotype.INSTANTIATION:
        return this.instantiation();
      case RelationStereotype.TERMINATION:
        return this.termination();
      case RelationStereotype.PARTICIPATIONAL:
        return this.participational();
      case RelationStereotype.PARTICIPATION:
        return this.participation();
      case RelationStereotype.HISTORICAL_DEPENDENCE:
        return this.historicalDependence();
      case RelationStereotype.CREATION:
        return this.creation();
      case RelationStereotype.MANIFESTATION:
        return this.manifestation();
      case RelationStereotype.BRINGS_ABOUT:
        return this.bringsAbout();
      case RelationStereotype.TRIGGERS:
        return this.triggers();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype of the relation to «material», which decorates
   * relations between endurants that are founded on relators, such as being
   * married to or being enrolled at. Also applies the following defaults:
   * - `isDerived = true`
   *
   * @returns this builder, for method chaining.
   */
  material(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.MATERIAL;
    this.derived();
    return this;
  }

  /**
   * Sets the stereotype of the relation to «derivation», which decorates
   * relations connecting a derived relation (e.g., a «material» relation) to
   * the class (e.g., a «relator») from which it is derived. Also applies the
   * following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  derivation(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.DERIVATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «comparative», which decorates
   * relations that hold between endurants by virtue of a comparison of their
   * intrinsic aspects, such as being taller than. Also applies the following
   * defaults:
   * - `isDerived = true`
   *
   * @returns this builder, for method chaining.
   */
  comparative(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.COMPARATIVE;
    this.derived();
    return this;
  }

  /**
   * Sets the stereotype of the relation to «mediation», which decorates
   * relations between a relator and an endurant it mediates, such as a
   * marriage and one of its spouses. Also applies the following defaults:
   * - `sourceCardinality = "1..*"`
   * - `targetCardinality = "1"`
   * - `targetEnd.isReadOnly = true`
   *
   * @returns this builder, for method chaining.
   */
  mediation(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.MEDIATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('1');
    this.targetReadOnly();
    return this;
  }

  /**
   * Sets the stereotype of the relation to «characterization», which
   * decorates relations between an intrinsic aspect (a mode or a quality)
   * and the endurant it characterizes, i.e., its bearer. Also applies the
   * following defaults:
   * - `sourceCardinality = "1..*"`
   * - `targetCardinality = "1"`
   * - `targetEnd.isReadOnly = true`
   *
   * @returns this builder, for method chaining.
   */
  characterization(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.CHARACTERIZATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('1');
    this.targetReadOnly();
    return this;
  }

  /**
   * Sets the stereotype of the relation to «externalDependence», which
   * decorates relations between an extrinsic mode and an endurant, other
   * than its bearer, on which it depends, such as one's love for another.
   * Also applies the following defaults:
   * - `sourceCardinality = "0..*"`
   * - `targetCardinality = "1"`
   * - `targetEnd.isReadOnly = true`
   *
   * @returns this builder, for method chaining.
   */
  externalDependence(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.EXTERNAL_DEPENDENCE;
    this.sourceCardinality('0..*');
    this.targetCardinality('1');
    this.targetReadOnly();
    return this;
  }

  /**
   * Sets the stereotype of the relation to «componentOf», which decorates
   * parthood relations between functional complexes, such as an engine being
   * a component of a car. Also applies the following defaults:
   * - `aggregationKind = "COMPOSITE"`
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1..*"`
   *
   * @returns this builder, for method chaining.
   */
  componentOf(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.COMPONENT_OF;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «memberOf», which decorates
   * parthood relations between an entity and the collective of which it is a
   * member, such as a tree being a member of a forest. Also applies the
   * following defaults:
   * - `aggregationKind = "SHARED"`
   * - `sourceCardinality = "1..*"`
   * - `targetCardinality = "1..*"`
   *
   * @returns this builder, for method chaining.
   */
  memberOf(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.MEMBER_OF;
    this.aggregation();
    this.sourceCardinality('1..*');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «subCollectionOf», which decorates
   * parthood relations between collectives, such as the north wing of a
   * forest being a sub-collection of the forest. Also applies the following
   * defaults:
   * - `aggregationKind = "COMPOSITE"`
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1..*"`
   *
   * @returns this builder, for method chaining.
   */
  subCollectionOf(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.SUBCOLLECTION_OF;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «subQuantityOf», which decorates
   * parthood relations between quantities, such as the alcohol in a glass of
   * wine being a sub-quantity of the wine. Also applies the following
   * defaults:
   * - `aggregationKind = "COMPOSITE"`
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  subQuantityOf(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.SUBQUANTITY_OF;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «instantiation», which decorates
   * relations between an entity and the high-order type it instantiates,
   * such as a person and a social role classifying persons. Also applies the
   * following defaults:
   * - `sourceCardinality = "1..*"`
   * - `targetCardinality = "0..*"`
   *
   * @returns this builder, for method chaining.
   */
  instantiation(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.INSTANTIATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('0..*');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «termination», which decorates
   * relations between an event and the endurant whose existence it brings to
   * an end. Also applies the following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  termination(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.TERMINATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «participational», which decorates
   * parthood relations between events, in which the part is the participation
   * of an entity in the whole event. Also applies the following defaults:
   * - `aggregationKind = "COMPOSITE"`
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1..*"`
   *
   * @returns this builder, for method chaining.
   */
  participational(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.PARTICIPATIONAL;
    this.composition();
    this.sourceCardinality('1');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «participation», which decorates
   * relations between an endurant and an event in which it participates,
   * such as a groom and his wedding. Also applies the following defaults:
   * - `sourceCardinality = "1..*"`
   * - `targetCardinality = "1..*"`
   *
   * @returns this builder, for method chaining.
   */
  participation(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.PARTICIPATION;
    this.sourceCardinality('1..*');
    this.targetCardinality('1..*');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «historicalDependence», which
   * decorates relations of historical dependence between entities, i.e.,
   * relations in which an entity depends on the past existence or state of
   * another. Also applies the following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  historicalDependence(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.HISTORICAL_DEPENDENCE;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «creation», which decorates
   * relations between an event and the endurant it brings into existence.
   * Also applies the following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  creation(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.CREATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «manifestation», which decorates
   * relations between an event and the intrinsic aspect (mode or quality) it
   * manifests, such as a symptom and the disease it manifests. Also applies
   * the following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  manifestation(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.MANIFESTATION;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «bringsAbout», which decorates
   * relations between an event and the situation it brings about. Also
   * applies the following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  bringsAbout(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.BRINGS_ABOUT;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }

  /**
   * Sets the stereotype of the relation to «triggers», which decorates
   * relations between a situation and the event it triggers when it obtains.
   * Also applies the following defaults:
   * - `sourceCardinality = "1"`
   * - `targetCardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  triggers(): BinaryRelationBuilder {
    this._stereotype = RelationStereotype.TRIGGERS;
    this.sourceCardinality('1');
    this.targetCardinality('1');
    return this;
  }
}
