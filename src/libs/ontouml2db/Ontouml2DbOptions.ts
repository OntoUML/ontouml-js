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
  isStandardizeNames: boolean;
  baseIri: String;
  generateSchema: boolean;
  generateConnection: boolean;
  hostName: string;
  databaseName: string;
  userConnection: string;
  passwordConnection: string;
  enumFieldToLookupTable: boolean;

  constructor(base: Partial<Ontouml2DbOptions> = {}) {
    this.mappingStrategy = StrategyType.ONE_TABLE_PER_KIND;
    this.targetDBMS = DbmsSupported.GENERIC_SCHEMA;
    this.isStandardizeNames = true;
    this.baseIri = 'https://example.com';
    this.generateSchema = true;
    this.generateConnection = false;
    this.enumFieldToLookupTable = true;

    Object.keys(base).forEach(key => (this[key] = base[key]));
  }
}
