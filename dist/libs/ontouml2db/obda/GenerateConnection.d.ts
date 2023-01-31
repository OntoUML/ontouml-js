import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
import { DbmsInterface } from '../../ontouml2db/supported_database/DbmsInterface';
import { DbmsSupported } from '../../ontouml2db/constants/DbmsSupported';
export declare class GenerateConnection {
    static getFile(options: Ontouml2DbOptions): string;
    static getDatabase(db: DbmsSupported): DbmsInterface;
}
