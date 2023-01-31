import { DbmsInterface } from '../../ontouml2db/supported_database/DbmsInterface';
import { Node } from '../../ontouml2db/graph/Node';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
import { Generic } from '../../ontouml2db/supported_database/Generic';
export declare class Oracle extends Generic implements DbmsInterface {
    constructor();
    createTableDescription(): string;
    getPKDescription(property: NodeProperty): string;
    getConstraintTable(node: Node): string;
    getConnectionToProtege(options: Ontouml2DbOptions): string;
}
