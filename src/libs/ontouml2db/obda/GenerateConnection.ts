/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
import { H2 } from '@libs/ontouml2db/supported_database/H2';
import { IDBMS } from '@libs/ontouml2db/supported_database/IDBMS';
import { MySql } from '@libs/ontouml2db/supported_database/MySql';
import { Oracle } from '@libs/ontouml2db/supported_database/Oracle';
import { Postgre } from '@libs/ontouml2db/supported_database/Postgre';
import { SqlServer } from '@libs/ontouml2db/supported_database/SqlServer';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { Generic } from '../supported_database/Generic';

export class GenerateConnection {
  static getFile(options: OntoUML2DBOptions): string {
    let database: IDBMS;

    database = this.getDatabase(options.targetDBMS);

    return database.getConnectionToProtege(options);
  }

  static getDatabase(db: DBMSSupported): IDBMS {
    switch (db) {
      case DBMSSupported.GENERIC_SCHEMA: {
        return new Generic();
      }
      case DBMSSupported.H2: {
        return new H2();
      }
      case DBMSSupported.MYSQL: {
        return new MySql();
      }
      case DBMSSupported.ORACLE: {
        return new Oracle();
      }
      case DBMSSupported.POSTGRE: {
        return new Postgre();
      }
      case DBMSSupported.SQLSERVER: {
        return new SqlServer();
      }
      default:
        throw new Error('There is no support for the chosen database.');
    }
  }
}
