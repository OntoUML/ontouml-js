import _ from 'lodash';

/**
 * The union of all OntoUML stereotypes, applicable to classes, relations,
 * and properties.
 */
export type Stereotype =
  | ClassStereotype
  | RelationStereotype
  | PropertyStereotype;

/**
 * The OntoUML stereotypes applicable to a {@link Class}. Each stereotype
 * identifies the micro-theory of UFO that governs the class, constraining,
 * among other things, the ontological natures of its instances (see
 * {@link Nature}), its rigidity, and the specializations in which it can
 * participate.
 */
export enum ClassStereotype {
  /**
   * A rigid sortal that provides an identity principle to its instances,
   * which are functional complexes, e.g., `Person`, `Car`, `Organization`.
   */
  KIND = 'kind',

  /**
   * A rigid sortal that provides an identity principle to its instances,
   * which are collectives, e.g., `Forest`, `Crowd`, `Fleet`.
   */
  COLLECTIVE = 'collective',

  /**
   * A rigid sortal that provides an identity principle to its instances,
   * which are quantities (amounts of matter), e.g., `Water`, `Gold`.
   */
  QUANTITY = 'quantity',

  /**
   * A rigid sortal that provides an identity principle to its instances,
   * which are relators — moments that connect other endurants and serve as
   * truthmakers of material relations, e.g., `Marriage`, `Enrollment`.
   */
  RELATOR = 'relator',

  /**
   * A rigid sortal that provides an identity principle to its instances,
   * which are qualities — intrinsic moments measurable in a quality space,
   * e.g., `Weight`, `Color`.
   */
  QUALITY = 'quality',

  /**
   * A rigid sortal that provides an identity principle to its instances,
   * which are modes — moments not associated with quality spaces, e.g.,
   * `Skill`, `Belief`, `Intention`.
   */
  MODE = 'mode',

  /**
   * A rigid sortal that specializes a kind (or another ultimate sortal),
   * inheriting its identity principle, e.g., `Man` as a subkind of `Person`.
   */
  SUBKIND = 'subkind',

  /**
   * An anti-rigid sortal whose instantiation depends on a relational
   * (extrinsic) condition, e.g., `Student` — a role played by persons while
   * enrolled in a school.
   */
  ROLE = 'role',

  /**
   * An anti-rigid sortal whose instantiation depends on an intrinsic
   * condition of its instances, e.g., `Child` and `Adult` as phases of
   * `Person` defined by age.
   */
  PHASE = 'phase',

  /**
   * A rigid non-sortal that aggregates essential properties of instances of
   * distinct kinds, e.g., `PhysicalObject` generalizing `Person` and `Car`.
   */
  CATEGORY = 'category',

  /**
   * A semi-rigid non-sortal that aggregates properties that are essential to
   * some of its instances and accidental to others, e.g., `Insurable`.
   */
  MIXIN = 'mixin',

  /**
   * An anti-rigid non-sortal that aggregates roles played by instances of
   * distinct kinds, e.g., `Customer` generalizing `PersonalCustomer` and
   * `CorporateCustomer`.
   */
  ROLE_MIXIN = 'roleMixin',

  /**
   * An anti-rigid non-sortal that aggregates phases of instances of distinct
   * kinds, e.g., `LivingBeing` generalizing living persons and animals.
   */
  PHASE_MIXIN = 'phaseMixin',

  /**
   * A type whose instances are events — perdurants that unfold in time,
   * e.g., `Wedding`, `Purchase`.
   */
  EVENT = 'event',

  /**
   * A type whose instances are situations — configurations of entities that
   * can be factual, e.g., `Hazard`, `JohnBeingSick`.
   */
  SITUATION = 'situation',

  /**
   * An anti-rigid sortal defined by a relational condition that held in the
   * past, e.g., `ExHusband` as a historical role played by persons.
   */
  HISTORICAL_ROLE = 'historicalRole',

  /**
   * An anti-rigid non-sortal that aggregates historical roles played by
   * instances of distinct kinds, e.g., `FormerCustomer`.
   */
  HISTORICAL_ROLE_MIXIN = 'historicalRoleMixin',

  /**
   * A type whose instances are abstract values drawn from a fixed set of
   * named literals, e.g., `Color` with literals `red`, `green`, and `blue`.
   */
  ENUMERATION = 'enumeration',

  /**
   * A type whose instances are abstract values, such as numbers or dates;
   * datatypes with attributes are complex (structured) datatypes.
   */
  DATATYPE = 'datatype',

  /**
   * A type whose instances are abstract entities outside of space-time,
   * e.g., `Proposition`, `Number`.
   */
  ABSTRACT = 'abstract',

  /**
   * A high-order type whose instances are themselves types, e.g., a class
   * `Species` whose instances include `Dog` and `Cat`.
   */
  TYPE = 'type'
}

export const TYPE = ClassStereotype.TYPE;
export const HISTORICAL_ROLE = ClassStereotype.HISTORICAL_ROLE;
export const HISTORICAL_ROLE_MIXIN = ClassStereotype.HISTORICAL_ROLE_MIXIN;
export const EVENT = ClassStereotype.EVENT;
export const SITUATION = ClassStereotype.SITUATION;
export const CATEGORY = ClassStereotype.CATEGORY;
export const MIXIN = ClassStereotype.MIXIN;
export const ROLE_MIXIN = ClassStereotype.ROLE_MIXIN;
export const PHASE_MIXIN = ClassStereotype.PHASE_MIXIN;
export const KIND = ClassStereotype.KIND;
export const COLLECTIVE = ClassStereotype.COLLECTIVE;
export const QUANTITY = ClassStereotype.QUANTITY;
export const RELATOR = ClassStereotype.RELATOR;
export const QUALITY = ClassStereotype.QUALITY;
export const MODE = ClassStereotype.MODE;
export const SUBKIND = ClassStereotype.SUBKIND;
export const ROLE = ClassStereotype.ROLE;
export const PHASE = ClassStereotype.PHASE;
export const ENUMERATION = ClassStereotype.ENUMERATION;
export const DATATYPE = ClassStereotype.DATATYPE;
export const ABSTRACT = ClassStereotype.ABSTRACT;

/**
 * The stereotypes of non-sortal classes: types that classify entities that
 * follow different identity principles and, thus, do not themselves provide
 * or carry a single identity principle.
 */
export const NON_SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  CATEGORY,
  MIXIN,
  PHASE_MIXIN,
  ROLE_MIXIN,
  HISTORICAL_ROLE_MIXIN
];

/**
 * The stereotypes of ultimate sortal classes: sortals that provide the
 * identity principle followed by their instances. Every endurant must
 * instantiate exactly one ultimate sortal.
 */
export const ULTIMATE_SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  KIND,
  COLLECTIVE,
  QUANTITY,
  RELATOR,
  QUALITY,
  MODE
];

/**
 * The stereotypes of base sortal classes: sortals that do not provide an
 * identity principle themselves, but inherit one from the ultimate sortal
 * they specialize.
 */
export const BASE_SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  SUBKIND,
  PHASE,
  ROLE,
  HISTORICAL_ROLE
];

/**
 * The stereotypes of sortal classes: types whose instances all follow the
 * same identity principle, either provided by the class itself (ultimate
 * sortals) or inherited (base sortals).
 */
export const SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  ...ULTIMATE_SORTAL_STEREOTYPES,
  ...BASE_SORTAL_STEREOTYPES
];

/**
 * The stereotypes of rigid classes: types that necessarily apply to their
 * instances, i.e., that classify their instances in every world in which the
 * instances exist (e.g., a person can never cease to be a person).
 *
 * Note that this list adopts a broad notion of rigidity that includes
 * stereotypes whose UFO counterparts do not specialize Rigid (e.g., «event»,
 * «situation», «datatype»), as their instances also cannot cease to
 * instantiate them. This broad notion is the one assumed by the
 * OntoUML-to-gUFO transformation.
 */
export const RIGID_STEREOTYPES: readonly ClassStereotype[] = [
  KIND,
  QUANTITY,
  COLLECTIVE,
  MODE,
  QUALITY,
  RELATOR,
  SUBKIND,
  CATEGORY,
  EVENT,
  SITUATION,
  TYPE,
  ABSTRACT,
  DATATYPE,
  ENUMERATION
];

/**
 * The stereotypes of anti-rigid classes: types that contingently apply to
 * all of their instances, i.e., every instance can cease to be classified by
 * the type without ceasing to exist (e.g., every student can cease to be a
 * student).
 */
export const ANTI_RIGID_STEREOTYPES: readonly ClassStereotype[] = [
  ROLE,
  ROLE_MIXIN,
  HISTORICAL_ROLE,
  HISTORICAL_ROLE_MIXIN,
  PHASE,
  PHASE_MIXIN
];

/**
 * The stereotypes of semi-rigid classes: types that apply necessarily to
 * some of their instances and contingently to others.
 */
export const SEMI_RIGID_STEREOTYPES: readonly ClassStereotype[] = [MIXIN];

/**
 * The stereotypes of classes whose instances are moments: endurants that
 * existentially depend on other endurants in which they inhere.
 */
export const MOMENT_STEREOTYPES: readonly ClassStereotype[] = [
  MODE,
  QUALITY,
  RELATOR
];

/**
 * The stereotypes of classes whose instances are substantials:
 * existentially independent endurants.
 */
export const SUBSTANTIAL_STEREOTYPES: readonly ClassStereotype[] = [
  KIND,
  QUANTITY,
  COLLECTIVE
];

/**
 * The stereotypes of classes whose instances are endurants: entities that
 * persist in time while keeping their identity.
 */
export const ENDURANT_STEREOTYPES: readonly ClassStereotype[] = [
  ...SORTAL_STEREOTYPES,
  ...NON_SORTAL_STEREOTYPES
];

/**
 * The stereotypes of classes whose instances are abstract entities, i.e.,
 * entities outside of space-time.
 */
export const ABSTRACT_STEREOTYPES: readonly ClassStereotype[] = [
  ABSTRACT,
  DATATYPE,
  ENUMERATION
];

/**
 * The OntoUML stereotypes applicable to a {@link Relation}. Each stereotype
 * identifies the ontological nature of the relation, constraining the types
 * it can connect and the cardinalities of its ends.
 */
export enum RelationStereotype {
  /**
   * A relation between endurants that is founded on a relator, e.g., a
   * `married with` relation between spouses, founded on a marriage.
   */
  MATERIAL = 'material',

  /**
   * A relation connecting a material or comparative relation to the class
   * whose instances serve as its truthmakers, e.g., connecting `married
   * with` to the relator class `Marriage`.
   */
  DERIVATION = 'derivation',

  /**
   * A relation whose truth depends solely on intrinsic properties
   * (qualities) of the related entities, e.g., `heavier than` between
   * persons, which depends only on their weights.
   */
  COMPARATIVE = 'comparative',

  /**
   * A relation connecting a relator to an endurant it mediates, e.g.,
   * between a marriage and each of the spouses it binds.
   */
  MEDIATION = 'mediation',

  /**
   * A relation connecting a mode or quality to the endurant that bears it,
   * e.g., between a headache and the person who suffers from it.
   */
  CHARACTERIZATION = 'characterization',

  /**
   * A relation connecting an extrinsic mode to an endurant, other than its
   * bearer, on which the mode depends, e.g., between John's admiration for
   * Mary and Mary herself.
   */
  EXTERNAL_DEPENDENCE = 'externalDependence',

  /**
   * A parthood relation between functional complexes, in which the part
   * plays a functional role with respect to the whole, e.g., between an
   * engine and the car it is a component of.
   */
  COMPONENT_OF = 'componentOf',

  /**
   * A parthood relation between a member and the collective it belongs to,
   * e.g., between a tree and a forest.
   */
  MEMBER_OF = 'memberOf',

  /**
   * A parthood relation between collectives, e.g., between the north wing
   * of a forest and the forest as a whole.
   */
  SUBCOLLECTION_OF = 'subCollectionOf',

  /**
   * A parthood relation between quantities, e.g., between the alcohol and
   * the wine it is part of.
   */
  SUBQUANTITY_OF = 'subQuantityOf',

  /**
   * A relation connecting a high-order type to the type whose instances it
   * classifies, e.g., between `Species` and `Animal`.
   */
  INSTANTIATION = 'instantiation',

  /**
   * A relation connecting an endurant to the event that brings its
   * existence to an end, e.g., between a person and their death.
   */
  TERMINATION = 'termination',

  /**
   * A parthood relation between events, in which the part is the
   * participation of an endurant in the whole, e.g., between a keynote and
   * the conference it is part of.
   */
  PARTICIPATIONAL = 'participational',

  /**
   * A relation connecting an endurant to an event it participates in, e.g.,
   * between a groom and his wedding.
   */
  PARTICIPATION = 'participation',

  /**
   * A relation of historical dependence between entities, i.e., one whose
   * truth depends on some past configuration of the world, e.g., `was
   * married to` between former spouses.
   */
  HISTORICAL_DEPENDENCE = 'historicalDependence',

  /**
   * A relation connecting an endurant to the event that brings it into
   * existence, e.g., between a person and their birth.
   */
  CREATION = 'creation',

  /**
   * A relation connecting an event to the moment (e.g., a disposition) that
   * is manifested through its occurrence, e.g., between an earthquake and
   * the seismic potential of a geological fault.
   */
  MANIFESTATION = 'manifestation',

  /**
   * A relation connecting an event to a situation it brings about, e.g.,
   * between a wedding and the situation of two people being married.
   */
  BRINGS_ABOUT = 'bringsAbout',

  /**
   * A relation connecting a situation to the event it triggers when it
   * obtains, e.g., between a hazard and the accident it may cause.
   */
  TRIGGERS = 'triggers'
}

export const MATERIAL = RelationStereotype.MATERIAL;
export const DERIVATION = RelationStereotype.DERIVATION;
export const COMPARATIVE = RelationStereotype.COMPARATIVE;
export const MEDIATION = RelationStereotype.MEDIATION;
export const CHARACTERIZATION = RelationStereotype.CHARACTERIZATION;
export const EXTERNAL_DEPENDENCE = RelationStereotype.EXTERNAL_DEPENDENCE;
export const COMPONENT_OF = RelationStereotype.COMPONENT_OF;
export const MEMBER_OF = RelationStereotype.MEMBER_OF;
export const SUBCOLLECTION_OF = RelationStereotype.SUBCOLLECTION_OF;
export const SUBQUANTITY_OF = RelationStereotype.SUBQUANTITY_OF;
export const INSTANTIATION = RelationStereotype.INSTANTIATION;
export const TERMINATION = RelationStereotype.TERMINATION;
export const PARTICIPATIONAL = RelationStereotype.PARTICIPATIONAL;
export const PARTICIPATION = RelationStereotype.PARTICIPATION;
export const HISTORICAL_DEPENDENCE = RelationStereotype.HISTORICAL_DEPENDENCE;
export const CREATION = RelationStereotype.CREATION;
export const MANIFESTATION = RelationStereotype.MANIFESTATION;
export const BRINGS_ABOUT = RelationStereotype.BRINGS_ABOUT;
export const TRIGGERS = RelationStereotype.TRIGGERS;

/**
 * The relation stereotypes that imply existential dependence on the entity
 * at the source end of the relation.
 */
export const EXISTENTIAL_DEPENDENCE_ON_SOURCE_STEREOTYPES = [
  BRINGS_ABOUT,
  CREATION,
  MANIFESTATION,
  PARTICIPATION,
  PARTICIPATIONAL,
  TERMINATION,
  TRIGGERS
];

/**
 * The relation stereotypes that imply existential dependence on the entity
 * at the target end of the relation.
 */
export const EXISTENTIAL_DEPENDENCE_ON_TARGET_STEREOTYPES = [
  BRINGS_ABOUT,
  CHARACTERIZATION,
  CREATION,
  EXTERNAL_DEPENDENCE,
  HISTORICAL_DEPENDENCE,
  MEDIATION,
  PARTICIPATIONAL
];

/**
 * The relation stereotypes that imply existential dependence between the
 * entities they connect, on either or both ends.
 */
export const EXISTENTIAL_DEPENDENCE_STEREOTYPES = [
  ...new Set([
    ...EXISTENTIAL_DEPENDENCE_ON_SOURCE_STEREOTYPES,
    ...EXISTENTIAL_DEPENDENCE_ON_TARGET_STEREOTYPES
  ])
];

/** The relation stereotypes that denote parthood (part-whole) relations. */
export const PartWholeRelationStereotypes = [
  COMPONENT_OF,
  MEMBER_OF,
  SUBCOLLECTION_OF,
  SUBQUANTITY_OF,
  PARTICIPATIONAL
];

/**
 * The OntoUML stereotypes applicable to a {@link Property}, used to mark the
 * temporal boundary attributes of entities.
 */
export enum PropertyStereotype {
  /** An attribute holding the instant at which an entity begins to exist. */
  BEGIN = 'begin',

  /** An attribute holding the instant at which an entity ceases to exist. */
  END = 'end'
}

export const BEGIN = PropertyStereotype.BEGIN;
export const END = PropertyStereotype.END;

/** All stereotypes defined in OntoUML. */
export const ONTOUML_STEREOTYPES = [
  ...Object.values(ClassStereotype),
  ...Object.values(RelationStereotype),
  ...Object.values(PropertyStereotype)
];
