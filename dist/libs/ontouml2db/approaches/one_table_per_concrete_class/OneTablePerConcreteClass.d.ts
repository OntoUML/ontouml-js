import { IStrategy } from '../../../ontouml2db/approaches/IStrategy';
import { Graph } from '../../../ontouml2db/graph/Graph';
import { Tracker } from '../../../ontouml2db/tracker/Tracker';
export declare class OneTablePerConcreteClass implements IStrategy {
    run(graph: Graph, tracker: Tracker): void;
}
