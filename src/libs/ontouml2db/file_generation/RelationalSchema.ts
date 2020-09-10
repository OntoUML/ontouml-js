/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '../graph/Graph';
import { DBMSType } from './DMBSType';
import { IDBMSSchema } from './dbms_schemas/IDBMSSchema';
import { GenericSchema } from './dbms_schemas/GenericSchema';
import { H2Schema } from './dbms_schemas/H2Schema';

export class RelationalSchema {
  
  static getSchema(graph: Graph, dbms: DBMSType): string {
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
