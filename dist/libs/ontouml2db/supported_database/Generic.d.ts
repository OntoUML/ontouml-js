import { DbmsInterface } from './DbmsInterface';
import { Graph } from '../../ontouml2db/graph/Graph';
import { Node } from '../../ontouml2db/graph/Node';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
export declare class Generic implements DbmsInterface {
    types: Map<string, string>;
    constructor();
    getSchema(graph: Graph): string;
    createTables(graph: Graph): string;
    createTable(node: Node): string;
    createTableDescription(): string;
    getConstraintTable(node: Node): string;
    createColumn(property: NodeProperty, firstColumn: boolean): string;
    getPKDescription(property: NodeProperty): string;
    getNullable(property: NodeProperty): string;
    getColumnName(property: NodeProperty): string;
    getDefaultValue(property: NodeProperty): string;
    getColumnType(property: NodeProperty): string;
    createForeignKeys(graph: Graph): string;
    getConnectionToProtege(options: Ontouml2DbOptions): string;
}
