/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsInterface } from '@libs/ontouml2db/supported_database/DbmsInterface';
import { Generic } from '@libs/ontouml2db/supported_database/Generic';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/NodePropertyEnumeration';
import { Util } from '@libs/ontouml2db/util/Util';

export class Postgre extends Generic implements DbmsInterface {
  constructor() {
    super();
    this.types.set('boolean', 'BOOLEAN');
    this.types.set('byte', 'BYTEA(4)');
    this.types.set('double', 'FLOAT(8)');
    this.types.set('float', 'FLOAT(4)');
    this.types.set('int', 'INTEGER');
  }

  createTableDescription() {
    return 'CREATE TABLE IF NOT EXISTS ';
  }

  getPKDescription(property: NodeProperty): string {
    if (property.isPrimaryKey()) return ' PRIMARY KEY';
    else return '';
  }

  getColumnType(property: NodeProperty): string {
    let ddl: string = '';
    let first: boolean;

    if (property instanceof NodePropertyEnumeration) {
      ddl = 'ENUM(';
      first = true;
      for (let value of property.getValues()) {
        if (first) {
          ddl += "'" + value + "'";
          first = false;
        } else {
          ddl += ",'" + value + "'";
        }
      }
      ddl += ')';
    } else {
      if (property.isPrimaryKey()) {
        ddl += 'SERIAL ';
      } else {
        if (this.types.has(property.getDataType())) {
          ddl = this.types.get(property.getDataType());
        } else {
          ddl = property.getDataType().toUpperCase();
        }
      }
    }
    ddl += Util.getSpaces(ddl, 13);

    return ddl;
  }
  /*
  createForeignKeys(graph: Graph): string {
    let ddl: string = '';

    for (let node of graph.getNodes()) {
      for (let property of node.getProperties()) {
        if (property.isForeignKey()) {
          ddl += '\n\nALTER TABLE ';
          ddl += node.getName();
          ddl += ' ADD CONSTRAINT ';
          ddl +=
            'fk_' +
            node.getName() +
            '_x_' +
            graph.getNodeById(property.getForeignKeyNodeID()).getName() +
            '_' +
            Increment.getNext().toString() +
            ' ';
          ddl += '\nFOREIGN KEY ( ';
          ddl += property.getName();
          ddl += ' ) REFERENCES ';
          ddl += graph.getNodeById(property.getForeignKeyNodeID()).getName();
          ddl += ' ( ';
          ddl += graph.getNodeById(property.getForeignKeyNodeID()).getPKName();
          ddl += ' );';
        }
      }
    }
    return ddl;
  }
*/
  getConnectionToProtege(options: Ontouml2DbOptions): string {
    let stringConnection: string = '';

    let today = new Date();

    stringConnection += '#Ontouml2DB ' + today.toDateString() + '\n';
    stringConnection += 'jdbc.url=jdbc:postgre:tcp:' + '//' + options.hostName + '/' + options.databaseName + '\n';
    stringConnection += 'jdbc.driver=org.postgre.Driver' + '\n';
    stringConnection += 'jdbc.user=' + options.userConnection + '\n';
    stringConnection += 'jdbc.name=ontouml2-db00-ufes-nemo-000000000001' + '\n';
    stringConnection += 'jdbc.password=' + options.passwordConnection + '\n';

    return stringConnection;
  }
}
