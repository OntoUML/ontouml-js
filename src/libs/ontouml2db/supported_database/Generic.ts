/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsInterface } from './DbmsInterface';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Util } from '@libs/ontouml2db/util/Util';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/NodePropertyEnumeration';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';

export class Generic implements DbmsInterface {
  types: Map<string, string>;

  constructor() {
    this.types = new Map();
    this.types.set('boolean', 'BIT');
    this.types.set('byte', 'BIT(8)');
    this.types.set('char', 'CHAR(3)');
    this.types.set('double', 'DOUBLE');
    this.types.set('float', 'FLOAT');
    this.types.set('int', 'INTEGER');
    this.types.set('long', 'BIGINT');
    this.types.set('short', 'SMALLINT');
    this.types.set('string', 'VARCHAR(20)');
  }

  getSchema(graph: Graph): string {
    let ddl: string = '';

    ddl = this.createTables(graph);

    ddl += this.createForeignKeys(graph);

    return ddl;
  }
  // ************************************************************************
  createTables(graph: Graph): string {
    let ddl: string = '';
    for (let node of graph.getNodes()) {
      ddl += this.createTable(node);
    }
    return ddl;
  }

  createTable(node: Node): string {
    let ddl: string = '';
    let firstColumn: boolean = true;

    ddl += this.createTableDescription() + node.getName() + ' ( ';

    for (let property of node.getProperties()) {
      ddl += this.createColumn(property, firstColumn);
      firstColumn = false;
    }

    ddl += this.getConstraintTable(node);

    ddl += '\n); \n\n';
    return ddl;
  }

  createTableDescription() {
    return 'CREATE TABLE ';
  }

  getConstraintTable(node: Node): string {
    return '';
  }

  createColumn(property: NodeProperty, firstColumn: boolean): string {
    let ddl: string = '';
    let comma: string = '';
    let columnName: string = '';
    let columnType: string = '';
    let primaryKey: string = '';
    let nullable: string = '';
    let defaultValue: string = '';

    if (firstColumn) comma = '\n' + Util.getSpaces('', 8);
    else comma = '\n,' + Util.getSpaces(',', 8);

    columnName = property.getName() + Util.getSpaces(property.getName(), 23);

    columnType = this.getColumnName(property);

    primaryKey = this.getPKDescription(property);

    nullable = this.getNullable(property);

    defaultValue = this.getDefaultValue(property);

    ddl += comma;
    ddl += columnName;
    ddl += columnType;
    ddl += nullable;
    ddl += primaryKey;
    ddl += defaultValue;

    return ddl;
  }

  getPKDescription(property: NodeProperty): string {
    if (property.isPrimaryKey()) return ' PRIMARY KEY';
    else return '';
  }

  getNullable(property: NodeProperty): string {
    if (property.isNullable()) return ' NULL';
    else return ' NOT NULL';
  }

  getColumnName(property: NodeProperty): string {
    return this.getColumnType(property);
  }

  getDefaultValue(property: NodeProperty): string {
    if (property.getDefaultValue() != null) return (' DEFAULT ' + property.getDefaultValue()).toUpperCase();
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
      if (this.types.has(property.getDataType())) {
        ddl = this.types.get(property.getDataType());
      } else {
        ddl = property.getDataType().toUpperCase();
      }
    }
    ddl += Util.getSpaces(ddl, 13);

    return ddl;
  }

  // ***************************************************************************

  createForeignKeys(graph: Graph): string {
    let ddl: string = '';

    for (let node of graph.getNodes()) {
      for (let property of node.getProperties()) {
        if (property.isForeignKey()) {
          ddl += '\n\nALTER TABLE ';
          ddl += node.getName();
          ddl += ' ADD FOREIGN KEY ( ';
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

  //*****************************************************************************************
  getConnectionToProtege(options: Ontouml2DbOptions): string {
    let stringConnection: string = '';

    let today = new Date();

    stringConnection += '#Ontouml2DB ' + today.toDateString() + '\n';
    stringConnection += 'jdbc.url=' + options.hostName + '/' + options.databaseName + '\n';
    stringConnection += 'jdbc.driver=[PUT_DRIVE_HERE]' + '\n';
    stringConnection += 'jdbc.user=' + options.userConnection + '\n';
    stringConnection += 'jdbc.name=ontouml2-db00-ufes-nemo-000000000001' + '\n';
    stringConnection += 'jdbc.password=' + options.passwordConnection + '\n';

    return stringConnection;
  }
}
