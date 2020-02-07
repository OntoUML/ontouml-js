import { Element } from '.';
import { Package } from './package';
import { Class } from './class';
import { Generalization } from './generalization';
import { GENERALIZATION_SET_TYPE } from '@constants/.';

/**
 * Class that represents an OntoUML generalization set.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class GeneralizationSet extends Element {
  container: Package | null;
  isDisjoint: boolean | null;
  isComplete: boolean | null;
  categorizer: Class;
  generalizations: Generalization[] | null;

  constructor(
    id: string,
    enableMemoization = false,
    name?: string,
    description?: string,
    container?: Package,
  ) {
    super(
      GENERALIZATION_SET_TYPE,
      id,
      enableMemoization,
      name,
      description,
      container,
    );
    this.isComplete = this.isComplete;
    this.isDisjoint = this.isDisjoint;

    // if(enableMemoization) {}
  }
}
