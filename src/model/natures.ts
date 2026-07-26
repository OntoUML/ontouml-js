/**
 * The ontological natures that instances of a {@link Class} may have,
 * according to the UFO foundational ontology. The natures a class is
 * restricted to are recorded in {@link Class.restrictedTo} and constrain
 * which stereotypes and specializations are admissible for the class.
 */
export enum Nature {
  /**
   * The nature of functional complexes: objects whose parts play different
   * functional roles with respect to the whole, such as a person or a car.
   */
  FUNCTIONAL_COMPLEX = 'functional-complex',

  /**
   * The nature of collectives: objects whose parts (members) play the same
   * role with respect to the whole, such as a forest or a crowd.
   */
  COLLECTIVE = 'collective',

  /**
   * The nature of quantities: maximally connected amounts of matter, such as
   * a portion of water or gold.
   */
  QUANTITY = 'quantity',

  /**
   * The nature of relators: moments that connect two or more endurants and
   * are the truthmakers of material relations, such as a marriage or an
   * enrollment.
   */
  RELATOR = 'relator',

  /**
   * The nature of intrinsic modes: moments that depend on a single bearer
   * and are not measurable in a quality space, such as a skill or a belief.
   */
  INTRINSIC_MODE = 'intrinsic-mode',

  /**
   * The nature of extrinsic modes: moments that, in addition to their
   * bearer, depend on other entities, such as John's admiration for Mary.
   */
  EXTRINSIC_MODE = 'extrinsic-mode',

  /**
   * The nature of qualities: intrinsic moments that are measurable in a
   * quality space, such as a weight or a color.
   */
  QUALITY = 'quality',

  /**
   * The nature of events: perdurants that unfold in time, such as a wedding
   * or a football match.
   */
  EVENT = 'event',

  /**
   * The nature of situations: particular configurations of entities that can
   * be factual (i.e., obtain in the world), such as John being sick.
   */
  SITUATION = 'situation',

  /**
   * The nature of high-order types: entities whose instances are themselves
   * types, such as an animal species.
   */
  TYPE = 'type',

  /**
   * The nature of abstract entities: entities outside of space-time, such as
   * numbers and propositions.
   */
  ABSTRACT = 'abstract'
}

/** All ontological natures. */
export const Natures: readonly Nature[] = [
  Nature.FUNCTIONAL_COMPLEX,
  Nature.COLLECTIVE,
  Nature.QUANTITY,
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR,
  Nature.EVENT,
  Nature.SITUATION,
  Nature.TYPE,
  Nature.ABSTRACT
];

/**
 * The natures of endurants — entities that persist in time while keeping
 * their identity — comprising the substantial natures, the moment natures,
 * and the type nature.
 */
export const EndurantNatures: readonly Nature[] = [
  Nature.FUNCTIONAL_COMPLEX,
  Nature.COLLECTIVE,
  Nature.QUANTITY,
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR,
  Nature.TYPE
];

/**
 * The natures of substantials — existentially independent endurants, i.e.,
 * functional complexes, collectives, and quantities.
 */
export const SubstantialNatures: readonly Nature[] = [
  Nature.FUNCTIONAL_COMPLEX,
  Nature.COLLECTIVE,
  Nature.QUANTITY
];

/**
 * The natures of moments — endurants that existentially depend on other
 * endurants in which they inhere, i.e., modes, qualities, and relators.
 */
export const MomentNatures: readonly Nature[] = [
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR
];

/**
 * The natures of intrinsic moments — moments that depend on a single bearer,
 * i.e., intrinsic modes and qualities.
 */
export const IntrinsicMomentNatures: readonly Nature[] = [
  Nature.INTRINSIC_MODE,
  Nature.QUALITY
];

/**
 * The natures of extrinsic moments — moments that depend on entities other
 * than their bearers, i.e., extrinsic modes and relators.
 */
export const ExtrinsicMomentNatures: readonly Nature[] = [
  Nature.EXTRINSIC_MODE,
  Nature.RELATOR
];
