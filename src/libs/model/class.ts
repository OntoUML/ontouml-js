import { Classifier } from '.';
import { Package } from './package';
import { Property } from './property';
import { CLASS_TYPE } from '@constants/.';

/**
 * Class that represents an OntoUML class.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Class extends Classifier {
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
      CLASS_TYPE,
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
