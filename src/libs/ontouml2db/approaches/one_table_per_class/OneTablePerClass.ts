import { IStrategy } from '@libs/ontouml2db/approaches/IStrategy';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Increment } from '@libs/ontouml2db/util/Increment';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { Util } from '@libs/ontouml2db/util/Util';

export class OneTablePerClass implements IStrategy {

  run(graph: Graph, tracker: Tracker): void {
    Util.transformGeneralizationToRelation1to1(graph);
    
  }
}
