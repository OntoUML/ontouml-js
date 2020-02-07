import { Package } from './package';
import { Classifier, Element } from '.';
import { GENERALIZATION_TYPE } from '@constants/.';

/**
 * Class that represents an OntoUML generalization.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Generalization extends Element {
  container: Package | null;
  general: Classifier | null;
  specific: Classifier | null;

  constructor(
    id: string,
    enableMemoization = false,
    name?: string,
    description?: string,
    general?: Classifier,
    specific?: Classifier,
    container?: Package,
  ) {
    super(
      GENERALIZATION_TYPE,
      id,
      enableMemoization,
      name,
      description,
      container,
    );
    this.general = general;
    this.specific = specific;

    // if(enableMemoization) {}
  }
}
