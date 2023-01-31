import { Graph } from '../../ontouml2db/graph/Graph';
import { Tracker } from '../../ontouml2db/tracker/Tracker';
export declare class ToEntityRelationship {
    static run(graph: Graph, tracker: Tracker, applyStandardizeNames: boolean, enumFiledToLookupTable: boolean): void;
}
