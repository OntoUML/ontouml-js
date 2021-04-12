/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { ServiceOptions } from './../';

export class OntoUML2DBOptions implements ServiceOptions {
  mappingStrategy: StrategyType;
  targetDBMS: DBMSSupported;
  isStandardizeNames: boolean;
  baseIri: String;
  generateSchema: boolean;
  generateConnection: boolean;
  hostName: string;
  databaseName: string;
  userConnection: string;
  passwordConnection: string;
  enumFieldToLookupTable: boolean;

  constructor(base: Partial<OntoUML2DBOptions> = {}) {
    this.mappingStrategy = StrategyType.ONE_TABLE_PER_KIND;
    this.targetDBMS = DBMSSupported.GENERIC_SCHEMA;
    this.isStandardizeNames = true;
    this.baseIri = 'https://example.com';
    this.generateSchema = true;
    this.generateConnection = false;
    this.enumFieldToLookupTable = false;

    Object.keys(base).forEach(key => (this[key] = base[key]));
  }
}
