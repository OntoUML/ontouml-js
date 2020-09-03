/**
 * 
 * Author: Gustavo Ludovico Guidoni
 */

import { IDBMSSchema } from './IDBMSSchema';
import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { INode } from '@libs/ontouml2db/graph/INode';
import { INodeProperty } from '@libs/ontouml2db/graph/INodeProperty';
import { Util } from '@libs/ontouml2db/graph/util/Util';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/impl/NodePropertyEnumeration';

 export class GenericSchema implements IDBMSSchema{

    protected types: Map <string, string>;

    constructor(){
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

    public getSchema(graph: IGraph): string {
        let ddl: string = "";
		
		ddl = this.createTables( graph );
		
        ddl += this.createForeingKeys( graph );
        
        return ddl;
	}
	// ************************************************************************
	protected createTables( graph: IGraph): string {
		let ddl: string = "";
		for(let node of graph.getNodes() ) {
			ddl += this.createTable( node );
		}
		return ddl;
	}

	protected createTable( node: INode ): string {
		let ddl: string = "";
		let firstColumn: boolean = true;
		
		ddl += this.createTableDescription() + node.getName() + " ( ";
		
		for( let property of node.getProperties() ) {
			ddl += this.createColumn( property, firstColumn );
			firstColumn = false;
		}
		ddl += "\n); \n\n";
		return ddl;
	}

	protected createTableDescription(){
		return "CREATE TABLE ";
	}

	protected createColumn(property: INodeProperty, firstColumn: boolean): string {
		let ddl: string = "";
		let comma: string = "";
		let columnName: string = "";
		let columnType: string = "";
		let primaryKey: string = "";
		let nullable: string = "";
		let defalutValue: string = "";
		
		if(firstColumn)
			comma = "\n" + Util.getSpaces( "", 8 );
		else comma = "\n," + Util.getSpaces( ",", 8 );

		columnName = property.getName() + Util.getSpaces( property.getName(), 23 );

		columnType = this.getColumnName(property);

		primaryKey = this.getPKDescription(property);

		nullable = this.getNullable(property);

		defalutValue = this.getDefaultValue(property);
		
		ddl += comma;
		ddl += columnName;
		ddl += columnType;
		ddl += nullable;
		ddl += primaryKey;

		return ddl;
	}
	
	protected getPKDescription(property: INodeProperty): string{
		if(property.isPrimaryKey()) 
			return " PRIMARY KEY";
		else return "";
	}

	protected getNullable(property: INodeProperty): string{
		if( property.isNullable() )
			return " NULL";
		else return " NOT NULL";
	}

	protected getColumnName(property: INodeProperty): string{
		return this.getColumnType(property);	
	}

	protected getDefaultValue(property: INodeProperty): string{
		if(property.getDefaultValue() != null) 
			return (" DEFAULT " +  property.getDefaultValue()).toUpperCase();
		else return "";
	}

	protected getColumnType(property: INodeProperty): string{
		let ddl: string = "";
		let first: boolean;

		if( property instanceof NodePropertyEnumeration ) {
			ddl = "ENUM(";
			first = true;
			for(let value of property.getValues()) {
				if(first) {
					ddl += "'"+value+"'";
					first = false;
				}
				else {
					ddl += ",'"+value+"'";
				}
			}
			ddl += ")";
		}
		else{
			if( this.types.has(property.getDataType()) ){
				ddl = this.types.get( property.getDataType() );
			}
			else {
				ddl = property.getDataType().toUpperCase();
			}
		}
		ddl += Util.getSpaces( ddl, 13 );

		return ddl;
	}
	
	// ***************************************************************************

	protected createForeingKeys( graph: IGraph): string {
		let ddl: string = "";
		
		for(let node of graph.getNodes()) {
			for(let property of node.getProperties() ) {
				if( property.isForeignKey() ) {
					ddl +=  "\n\nALTER TABLE ";
					ddl +=  node.getName();
					ddl +=  " ADD FOREIGN KEY ( ";
					ddl +=  property.getName();
					ddl +=  " ) REFERENCES ";
					ddl +=  graph.getNodeById( property.getForeignKeyNodeID() ).getName();
					ddl +=  " ( ";
					ddl +=   graph.getNodeById( property.getForeignKeyNodeID() ).getPKName();
					ddl +=  " );";
				}
			}
		}
		return ddl;
	}
	
 }