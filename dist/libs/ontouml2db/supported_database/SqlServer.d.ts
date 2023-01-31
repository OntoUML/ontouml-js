import { DbmsInterface } from '../../ontouml2db/supported_database/DbmsInterface';
import { Generic } from '../../ontouml2db/supported_database/Generic';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
export declare class SqlServer extends Generic implements DbmsInterface {
    constructor();
    createTableDescription(): string;
    getPKDescription(property: NodeProperty): string;
    getConnectionToProtege(options: Ontouml2DbOptions): string;
}
