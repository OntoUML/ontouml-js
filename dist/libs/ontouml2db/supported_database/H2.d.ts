import { DbmsInterface } from '../../ontouml2db/supported_database/DbmsInterface';
import { Graph } from '../../ontouml2db/graph/Graph';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { Generic } from '../../ontouml2db/supported_database/Generic';
import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
export declare class H2 extends Generic implements DbmsInterface {
    constructor();
    getSchema(graph: Graph): string;
    createTableDescription(): string;
    getPKDescription(property: NodeProperty): string;
    getConnectionToProtege(options: Ontouml2DbOptions): string;
}
