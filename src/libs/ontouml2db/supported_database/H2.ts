/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IDBMS } from '@libs/ontouml2db/supported_database/IDBMS';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';

export class H2 extends Generic implements IDBMS {
  constructor() {
    super();
    this.types.set('boolean', 'BOOLEAN');
    this.types.set('byte', 'BINARY(8)');
  }

  getSchema(graph: Graph): string {
    let ddl: string = '';

    ddl = this.createTables(graph);

    ddl += this.createForeignKeys(graph);

    return ddl;
  }

  createTableDescription() {
    return 'CREATE TABLE IF NOT EXISTS ';
  }

  getPKDescription(property: NodeProperty): string {
    if (property.isPrimaryKey()) {
      if (property.isPrimaryKeyAutoIncrement()) return ' IDENTITY PRIMARY KEY';
      return ' PRIMARY KEY';
    }
    return '';
  }

  //*****************************************************************************************
  getConnectionToProtege(options: OntoUML2DBOptions): string {
    let stringConnection: string = '';

    let today = new Date();

    stringConnection += '#Ontouml2DB ' + today.toDateString() + '\n';
    stringConnection += 'jdbc.url=jdbc:h2:tcp:' + '//' + options.hostName + '/' + options.databaseName + '\n';
    stringConnection += 'jdbc.driver=org.h2.Driver' + '\n';
    stringConnection += 'jdbc.user=' + options.userConnection + '\n';
    stringConnection += 'jdbc.name=ontouml2-db00-ufes-nemo-000000000001' + '\n';
    stringConnection += 'jdbc.password=' + options.passwordConnection + '\n';

    return stringConnection;
  }
}
