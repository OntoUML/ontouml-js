/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsInterface } from '@libs/ontouml2db/supported_database/DbmsInterface';
import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { Util } from '@libs/ontouml2db/util/Util';

export class Oracle extends Generic implements DbmsInterface {
  constructor() {
    super();
    this.types.set('boolean', 'CHAR(1)');
    this.types.set('byte', 'RAW(1)');
    this.types.set('char', 'CHAR(3)');
    this.types.set('double', 'NUMBER(20,4)');
    this.types.set('float', 'NUMBER(10,2)');
    this.types.set('int', 'NUMBER(10,0)');
    this.types.set('long', 'NUMBER(20,0)');
    this.types.set('short', 'NUMBER(3,0)');
    this.types.set('string', 'VARCHAR2(20)');
  }

  createTableDescription() {
    return 'CREATE TABLE ';
  }

  getPKDescription(property: NodeProperty): string {
    if (property.isPrimaryKey() && property.isPrimaryKeyAutoIncrement()) {
      return ' GENERATED ALWAYS AS IDENTITY ';
    }
    return '';
  }

  getConstraintTable(node: Node): string {
    return (
      '\n,' +
      Util.getSpaces(',', 8) +
      'CONSTRAINT pk_' +
      node.getName() +
      ' PRIMARY KEY( ' +
      node.getPrimaryKey().getName() +
      ' )'
    );
  }

  getConnectionToProtege(options: Ontouml2DbOptions): string {
    let stringConnection: string = '';

    let today = new Date();

    stringConnection += '#Ontouml2DB ' + today.toDateString() + '\n';
    stringConnection += 'jdbc.url=jdbc:oracle:tcp:' + '//' + options.hostName + '/' + options.databaseName + '\n';
    stringConnection += 'jdbc.driver=org.oracle.Driver' + '\n';
    stringConnection += 'jdbc.user=' + options.userConnection + '\n';
    stringConnection += 'jdbc.name=ontouml2-db00-ufes-nemo-000000000001' + '\n';
    stringConnection += 'jdbc.password=' + options.passwordConnection + '\n';

    return stringConnection;
  }
}
