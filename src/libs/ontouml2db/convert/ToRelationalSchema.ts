/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { IDBMS } from '@libs/ontouml2db/supported_database/IDBMS';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { H2 } from '@libs/ontouml2db/supported_database/H2';
import { MySql } from '../supported_database/MySql';
import { Oracle } from '../supported_database/Oracle';
import { Postgre } from '../supported_database/Postgre';
import { SqlServer } from '../supported_database/SqlServer';

export class ToRelationalSchema {
  static getSchema(graph: Graph, dbms: DBMSSupported): string {
    let targetDBMS: IDBMS;

    switch (dbms) {
      case DBMSSupported.H2: {
        targetDBMS = new H2();
        break;
      }
      case DBMSSupported.MYSQL: {
        targetDBMS = new MySql();
        break;
      }
      case DBMSSupported.ORACLE: {
        targetDBMS = new Oracle();
        break;
      }
      case DBMSSupported.POSTGRE: {
        targetDBMS = new Postgre();
        break;
      }
      case DBMSSupported.SQLSERVER: {
        targetDBMS = new SqlServer();
        break;
      }

      default:
        targetDBMS = new Generic();
        break;
    }

    return targetDBMS.getSchema(graph);
  }
}
