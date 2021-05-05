/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { ServiceOptions } from '..';

export class Ontouml2DbOptions implements ServiceOptions {
  mappingStrategy: StrategyType;
  targetDBMS: DbmsSupported;
  standardizeNames: boolean;
  baseIri: String;
  generateSchema: boolean;
  generateObdaFile: boolean;
  generateConnection: boolean;
  generateIndexes: boolean;
  hostName: string;
  databaseName: string;
  userConnection: string;
  passwordConnection: string;
  enumFieldToLookupTable: boolean;
  

  constructor(base: Partial<Ontouml2DbOptions> = {}) {
    this.mappingStrategy = base?.mappingStrategy  || StrategyType.ONE_TABLE_PER_KIND;
    this.targetDBMS = base?.targetDBMS || DbmsSupported.GENERIC_SCHEMA;
    this.standardizeNames = base?.standardizeNames != null ? base?.standardizeNames : true ;
    this.baseIri = base?.baseIri || 'https://example.com';
    this.generateSchema = base?.generateSchema != null ? base?.generateSchema : true;
    this.generateObdaFile = base?.generateObdaFile != null ? base?.generateObdaFile : false;
    this.generateConnection = base?.generateConnection != null ?  base?.generateConnection : false;
    this.generateIndexes = base?.generateIndexes != null ? base?.generateIndexes : false;
    this.hostName = base?.hostName || "";
    this.databaseName = base?.databaseName || "";
    this.userConnection = base?.userConnection || "";
    this.passwordConnection = base?.passwordConnection || "";
    this.enumFieldToLookupTable = base?.enumFieldToLookupTable != null ? base?.enumFieldToLookupTable : true;
  }
}
