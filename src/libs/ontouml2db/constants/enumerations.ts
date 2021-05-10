/**
 * Concentrates all the enumerations used by the graph to perform the transformation.
 *
 * Author: Gustavo L. Guidoni
 */

export enum AssociationType {
  RELATION_TYPE = 'Relation',
  GENERALIZATION_TYPE = 'Generalization',
  GENERALIZATION_SET_TYPE = 'GeneralizationSet'
}

export enum Cardinality {
  C1 = '1',
  C0_1 = '0..1',
  C1_N = '1..*',
  C0_N = '0..*',
  X = 'uninformed'
}
