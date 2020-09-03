/**
 * Responsible for transforming the OntoUML model for Entity-Relationship, generating the 
 * database creation script and producing the integration files with Ontop.
 * 
 * Author: Gustavo L. Guidoni
 */

import { IPackage } from '@types';
import { IGraph } from './graph/IGraph';
import { Factory } from './factory/Factory';
import { IStrategy } from './strategies/IStrategy';
import { OneTablePerClass } from './strategies/one_table_per_class/OneTablePerClass';
import { OneTablePerKind } from './strategies/one_table_per_kind/OneTablePerKind';
import { ToEntityRelationship } from './convert/ToEntityRelationship';
import { StrategyType } from './strategies/StrategyType';
import { RelationalSchema } from './file_generation/RelationalSchema';
import { DBMSType } from './file_generation/DMBSType';

export class Transformation2DB{

	private sourceGraph: IGraph;
	private targetGraph: IGraph;
	private strategyType: StrategyType; //0- One Table per Class; 1 - One Table per Kind.
	private standardizeDatabaseNomenclature: boolean;//false: the tables and columns names are the same of the classes and attributes names.

	constructor(model: IPackage) {
		let factory = new Factory(model);
		this.sourceGraph = factory.mountGraph();
		this.targetGraph = null;
		this.strategyType = StrategyType.ONTE_TABLE_PER_KIND;
		this.standardizeDatabaseNomenclature = true;
	}

	/**
	 * Ontology transformation strategy for the relational schema. The transformation 
	 * pattern is "One Table per Kind".
	 * 
	 * @param strategy 0- One Table per Class; 1 - One Table per Kind.
	 */
	public setStrategy(strategyType: StrategyType): void{
		this.strategyType = strategyType;
	}

	/**
	 * Adapts the nomenclature of classes and attributes to a standard of names for tables
	 * and columns. Lowercase names and separated by underline ("_") when there is a
	 * uppercase letter in the middle of the name. Example .: NamedEntity for named_entity.
	 * 
	 * @param flag True standardizes the names, False does nothing.
	 */
	public setStandardizeDatabaseNomenclature(flag: boolean): void{
		this.standardizeDatabaseNomenclature = flag;
	}

	public getSourceGraph(): IGraph{
		return this.sourceGraph;
	}

	public getTargetGraph(): IGraph{
		return this.targetGraph;
	}

	/**
	 * Performs the transformation according to the selected strategy.
	 */
	public doMapping(): void{
		
		this.appliesMappingStrategy();

		ToEntityRelationship.run(this.targetGraph, this.standardizeDatabaseNomenclature);
	}

	/**
	 * Returns the relational schema form the transformed graph.
	 * 
	 * @param dbms DBMS for which the relational scheme will be generated.
	 */
	public getSchema(dbms: DBMSType): string{

		if( this.targetGraph == null ){
			this.doMapping();
		}
		
		let script = RelationalSchema.getSchema(this.targetGraph, dbms);

		return script;
	}

	private appliesMappingStrategy(): void{
		let strategy: IStrategy;

		switch (this.strategyType) {
			case StrategyType.ONE_TEBLE_PER_CLASS:
				strategy = new OneTablePerClass();
				break;
			case StrategyType.ONTE_TABLE_PER_KIND:
				strategy = new OneTablePerKind();  
				break;
			default:
				break;
		}
	
		this.targetGraph = this.sourceGraph.clone();

		strategy.run(this.targetGraph);
	}
} 



