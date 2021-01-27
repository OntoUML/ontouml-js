/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IDBMS } from '@libs/ontouml2db/supported_database/IDBMS';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';

export class SqlServer extends Generic implements IDBMS {
  constructor() {
    super();
    this.types = new Map();
    this.types.set('boolean', 'BIT');
    this.types.set('byte', 'BINARY(8)');
    this.types.set('double', 'REAL');
    this.types.set('float', 'FLOAT(53)');
  }

  createTableDescription() {
    return 'CREATE TABLE ';
  }

  getPKDescription(property: NodeProperty): string {
    if (property.isPrimaryKey()) {
      if (property.isPrimaryKeyAutoIncrement()) return ' IDENTITY(1,1) PRIMARY KEY';
      return ' PRIMARY KEY';
    }
    return '';
  }

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
