import { Package } from './package';

/**
 * Class that represents an OntoUML literal.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export abstract class Literal extends Element {}

/**
 * Class that represents an OntoUML generalization set.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Enumaration extends Element {
  container: Package;
}
