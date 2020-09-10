/**
 *
 * Author: Gustavo Ludovico Gudoni
 */

import { IDBMSSchema } from './IDBMSSchema';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { GenericSchema } from './GenericSchema';

export class H2Schema extends GenericSchema implements IDBMSSchema {
  constructor() {
    super();
    this.types = new Map();
    this.types.set('boolean', 'BOOLEAN');
    this.types.set('byte', 'BINARY(8)');
    this.types.set('char', 'CHAR(3)');
    this.types.set('double', 'DOUBLE');
    this.types.set('float', 'FLOAT');
    this.types.set('int', 'INT');
    this.types.set('long', 'BIGINT');
    this.types.set('short', 'SMALLINT');
    this.types.set('string', 'VARCHAR(20)');
  }

  getSchema(graph: Graph): string {
    let ddl: string = '';

    ddl = this.createTables(graph);

    ddl += this.createForeingKeys(graph);

    return ddl;
  }

  createTableDescription() {
    return 'CREATE TABLE IF NOT EXISTS ';
  }

  getPKDescription(property: NodeProperty) {
    if (property.isPrimaryKey()) return ' IDENTITY PRIMARY KEY';
    else return '';
  }
}
