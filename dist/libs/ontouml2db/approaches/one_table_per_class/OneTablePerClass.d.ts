import { IStrategy } from '../../../ontouml2db/approaches/IStrategy';
import { Graph } from '../../../ontouml2db/graph/Graph';
import { Tracker } from '../../../ontouml2db/tracker/Tracker';
export declare class OneTablePerClass implements IStrategy {
    run(graph: Graph, tracker: Tracker): void;
}
