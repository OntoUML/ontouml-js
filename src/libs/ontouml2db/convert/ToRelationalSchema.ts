/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { DbmsInterface } from '@libs/ontouml2db/supported_database/DbmsInterface';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { H2 } from '@libs/ontouml2db/supported_database/H2';
import { MySql } from '../supported_database/MySql';
import { Oracle } from '../supported_database/Oracle';
import { Postgre } from '../supported_database/Postgre';
import { SqlServer } from '../supported_database/SqlServer';

export class ToRelationalSchema {
  static getSchema(graph: Graph, dbms: DbmsSupported): string {
    let targetDBMS: DbmsInterface;

    switch (dbms) {
      case DbmsSupported.H2: {
        targetDBMS = new H2();
        break;
      }
      case DbmsSupported.MYSQL: {
        targetDBMS = new MySql();
        break;
      }
      case DbmsSupported.ORACLE: {
        targetDBMS = new Oracle();
        break;
      }
      case DbmsSupported.POSTGRE: {
        targetDBMS = new Postgre();
        break;
      }
      case DbmsSupported.SQLSERVER: {
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
