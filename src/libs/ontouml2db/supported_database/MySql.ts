/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IDBMS } from '@libs/ontouml2db/supported_database/IDBMS';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';

export class MySql extends Generic implements IDBMS {
  constructor() {
    super();
    this.types.set('boolean', 'TINYINT(1)');
    this.types.set('byte', 'BINARY(8)');
  }

  createTableDescription() {
    return 'CREATE TABLE IF NOT EXISTS ';
  }

  getPKDescription(property: NodeProperty): string {
    if (property.isPrimaryKey()) {
      if (property.isPrimaryKeyAutoIncrement()) return ' AUTO_INCREMENT PRIMARY KEY';
      return ' PRIMARY KEY';
    }
    return '';
  }

  getConnectionToProtege(options: OntoUML2DBOptions): string {
    let stringConnection: string = '';

    let today = new Date();

    stringConnection += '#Ontouml2DB ' + today.toDateString() + '\n';
    stringConnection += 'jdbc.url=jdbc:mysql:tcp:' + '//' + options.hostName + '/' + options.databaseName + '\n';
    stringConnection += 'jdbc.driver=org.mysql.Driver' + '\n';
    stringConnection += 'jdbc.user=' + options.userConnection + '\n';
    stringConnection += 'jdbc.name=ontouml2-db00-ufes-nemo-000000000001' + '\n';
    stringConnection += 'jdbc.password=' + options.passwordConnection + '\n';

    return stringConnection;
  }
}
