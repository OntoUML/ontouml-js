/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { H2 } from '@libs/ontouml2db/supported_database/H2';
import { DbmsInterface } from '@libs/ontouml2db/supported_database/DbmsInterface';
import { MySql } from '@libs/ontouml2db/supported_database/MySql';
import { Oracle } from '@libs/ontouml2db/supported_database/Oracle';
import { Postgre } from '@libs/ontouml2db/supported_database/Postgre';
import { SqlServer } from '@libs/ontouml2db/supported_database/SqlServer';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { Generic } from '../supported_database/Generic';

export class GenerateConnection {
  static getFile(options: Ontouml2DbOptions): string {
    let database: DbmsInterface;

    database = this.getDatabase(options.targetDBMS);

    return database.getConnectionToProtege(options);
  }

  static getDatabase(db: DbmsSupported): DbmsInterface {
    switch (db) {
      case DbmsSupported.GENERIC_SCHEMA: {
        return new Generic();
      }
      case DbmsSupported.H2: {
        return new H2();
      }
      case DbmsSupported.MYSQL: {
        return new MySql();
      }
      case DbmsSupported.ORACLE: {
        return new Oracle();
      }
      case DbmsSupported.POSTGRE: {
        return new Postgre();
      }
      case DbmsSupported.SQLSERVER: {
        return new SqlServer();
      }
      default:
        throw new Error('There is no support for the chosen database.');
    }
  }
}
