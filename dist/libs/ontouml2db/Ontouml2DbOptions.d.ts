import { StrategyType } from '../ontouml2db/constants/StrategyType';
import { DbmsSupported } from '../ontouml2db/constants/DbmsSupported';
import { ServiceOptions } from '..';
export declare class Ontouml2DbOptions implements ServiceOptions {
    mappingStrategy: StrategyType;
    targetDBMS: DbmsSupported;
    isStandardizeNames: boolean;
    baseIri: String;
    generateSchema: boolean;
    generateConnection: boolean;
    hostName: string;
    databaseName: string;
    userConnection: string;
    passwordConnection: string;
    enumFieldToLookupTable: boolean;
    constructor(base?: Partial<Ontouml2DbOptions>);
}
