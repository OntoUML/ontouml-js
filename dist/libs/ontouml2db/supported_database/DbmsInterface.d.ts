import { Graph } from '../../ontouml2db/graph/Graph';
import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
export interface DbmsInterface {
    getSchema(graph: Graph): string;
    getConnectionToProtege(options: Ontouml2DbOptions): string;
}
