import { NodePropertyEnumeration } from '../../ontouml2db/graph/NodePropertyEnumeration';
import { Graph } from '../../ontouml2db/graph/Graph';
export declare class SolvesName {
    static solves(graph: Graph): void;
    static adjustEnumerationValues(enumeration: NodePropertyEnumeration): void;
    static adjust(name: string): string;
}
