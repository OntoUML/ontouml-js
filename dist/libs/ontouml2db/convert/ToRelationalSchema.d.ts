import { Graph } from '../../ontouml2db/graph/Graph';
import { DbmsSupported } from '../../ontouml2db/constants/DbmsSupported';
export declare class ToRelationalSchema {
    static getSchema(graph: Graph, dbms: DbmsSupported): string;
}
