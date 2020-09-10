import { IStrategy } from '../IStrategy';
import { Graph } from '@libs/ontouml2db/graph/Graph';

export class OneTablePerClass implements IStrategy {
  run(graph: Graph): void {
    //Do nothing. The target diagram is the same as the source diagram.
  }
}
