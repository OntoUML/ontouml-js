/**
 * Responsible for transforming the OntoUML model for Entity-Relationship, generating the
 * database creation script and producing the integration files with Ontop.
 *
 * Author: Gustavo L. Guidoni
 */

import { IPackage } from '@types';
import { Factory } from './factory/Factory';
import { IStrategy } from './strategies/IStrategy';
import { OneTablePerClass } from './strategies/one_table_per_class/OneTablePerClass';
import { OneTablePerKind } from './strategies/one_table_per_kind/OneTablePerKind';
import { ToEntityRelationship } from './convert/ToEntityRelationship';
import { StrategyType } from './strategies/StrategyType';
import { RelationalSchema } from './file_generation/RelationalSchema';
import { DBMSType } from './file_generation/DMBSType';
import { Graph } from './graph/Graph';
import { IOntoUML2DBOptions } from './IOntoUML2DBOptions';

export class OntoUML2DB {
  private sourceGraph: Graph;
  private targetGraph: Graph;
  //private strategyType: StrategyType; //0- One Table per Class; 1 - One Table per Kind.
  //private standardizeNames: boolean; //false: the tables and columns names are the same of the classes and attributes names.

  constructor(model: IPackage) {
    let factory = new Factory(model);
    this.sourceGraph = factory.mountGraph();
    this.targetGraph = null;
    //this.strategyType = StrategyType.ONE_TABLE_PER_KIND;
    //this.standardizeNames = true;
  }

  /**
   * Ontology transformation strategy for the relational schema. The transformation
   * pattern is "One Table per Kind".
   *
   * @param strategy 0- One Table per Class; 1 - One Table per Kind.
   */
  //setStrategy(strategyType: StrategyType): void {
  //  this.strategyType = strategyType;
  //}

  /**
   * Adapts the nomenclature of classes and attributes to a standard of names for tables
   * and columns. Lowercase names and separated by underline ("_") when there is a
   * uppercase letter in the middle of the name. Example .: NamedEntity for named_entity.
   *
   * @param flag True standardizes the names, False does nothing.
   */
  //setStandardizeDatabaseNomenclature(flag: boolean): void {
  //  this.standardizeDatabaseNomenclature = flag;
  //}

  getSourceGraph(): Graph {
    return this.sourceGraph;
  }

  getTargetGraph(): Graph {
    return this.targetGraph;
  }

  /**
   * Returns the relational schema form the transformed graph.
   *
   * @param dbms DBMS for which the relational scheme will be generated.
   */
  //getSchema(dbms: DBMSType): string {
  //getSchema (
  //  strategyType = StrategyType.ONE_TABLE_PER_KIND,
  //  dbms = DBMSType.GENERIC_SCHEMA,
  //  standardizeNames = true,
  //): string {
  getSchema(options: IOntoUML2DBOptions): string {
    if (this.targetGraph == null) {
      this.doMapping(options.strategyType, options.standardizeNames);
    }

    let script = RelationalSchema.getSchema(this.targetGraph, options.dbms);

    return script;
  }

  getTest(options: IOntoUML2DBOptions) {
    console.log(options);
  }
  /**
   * Performs the transformation according to the selected strategy.
   */
  doMapping(strategyType: StrategyType, standardizeNames: boolean): void {
    this.appliesMappingStrategy(strategyType);

    ToEntityRelationship.run(this.targetGraph, standardizeNames);
  }

  appliesMappingStrategy(strategyType: StrategyType): void {
    let strategy: IStrategy;

    switch (strategyType) {
      case StrategyType.ONE_TABLE_PER_CLASS:
        strategy = new OneTablePerClass();
        break;
      case StrategyType.ONE_TABLE_PER_KIND:
        strategy = new OneTablePerKind();
        break;
      default:
        break;
    }

    this.targetGraph = this.sourceGraph.clone();

    strategy.run(this.targetGraph);
  }
}
