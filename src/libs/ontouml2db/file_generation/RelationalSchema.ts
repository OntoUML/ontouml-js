/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { DBMSType } from './DMBSType';
import { IDBMSSchema } from './dbms_schemas/IDBMSSchema';
import { GenericSchema } from './dbms_schemas/GenericSchema';
import { H2Schema } from './dbms_schemas/H2Schema';

export class RelationalSchema {
  public static getSchema(graph: IGraph, dbms: DBMSType): string {
    let targetDBMS: IDBMSSchema;

    switch (dbms) {
      case DBMSType.H2: {
        targetDBMS = new H2Schema();
        break;
      }
      default:
        targetDBMS = new GenericSchema();
        break;
    }

    return targetDBMS.getSchema(graph);
  }
}
