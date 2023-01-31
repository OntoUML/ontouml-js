import { Graph } from '../../ontouml2db/graph/Graph';
import { Tracker } from '../../ontouml2db/tracker/Tracker';
export interface IStrategy {
    run(graph: Graph, tracker: Tracker): void;
}
