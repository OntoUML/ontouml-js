import { RELATION_TYPE } from '@constants/';
import { Property } from './property';
import { Package } from './package';
import { Classifier } from '.';

/**
 * Class that represents an OntoUML relation (either a regular relation, derivation relation, or ternary relation).
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Relation extends Classifier {
  container: Package | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    stereotypes?: string[],
    properties?: Property[],
    isAbstract?: boolean,
    isDerived?: boolean,
    container?: Package,
  ) {
    super(
      RELATION_TYPE,
      id,
      enableHash,
      name,
      description,
      stereotypes,
      properties,
      isAbstract,
      isDerived,
      container,
    );

    // if (enableHash) {}
  }
}
