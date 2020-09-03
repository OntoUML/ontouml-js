import { IStrategy } from '../IStrategy';
import { IGraph } from '@libs/ontouml2db/graph/IGraph';

export class OneTablePerClass implements IStrategy {
  run(graph: IGraph): void {
    //Do nothing. The target diagram is the same as the source diagram.
  }
}
