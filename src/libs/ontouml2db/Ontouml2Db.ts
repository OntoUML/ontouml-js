/**
 * Responsible for transforming the OntoUML model for Entity-Relationship, generating the
 * database creation script and producing the integration files with Ontop.
 *
 * Author: Gustavo L. Guidoni
 */

import { Factory } from '@libs/ontouml2db/factory/Factory';
import { IStrategy } from '@libs/ontouml2db/approaches/IStrategy';
import { OneTablePerClass } from '@libs/ontouml2db/approaches/one_table_per_class/OneTablePerClass';
import { OneTablePerKind } from '@libs/ontouml2db/approaches/one_table_per_kind/OneTablePerKind';
import { ToEntityRelationship } from '@libs/ontouml2db/convert/ToEntityRelationship';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { ToRelationalSchema } from '@libs/ontouml2db/convert/ToRelationalSchema';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { GenerateObda } from '@libs/ontouml2db/obda/GenerateObda';
import { GenerateConnection } from './obda/GenerateConnection';

import { Project } from '@libs/ontouml';
import { Service, ServiceIssue } from '..';
import { DbmsSupported } from './constants/DbmsSupported';
import { OneTablePerConcreteClass } from './approaches/one_table_per_concrete_class/OneTablePerConcreteClass';

export class Ontouml2Db implements Service {
  private graph: Graph;
  private tracker: Tracker;
  private options: Ontouml2DbOptions;

  constructor(project: Project, opt?: Partial<Ontouml2DbOptions>) {
    let factory = new Factory(project);
    this.graph = factory.mountGraph();
    this.tracker = new Tracker(this.graph);

    this.options = opt ? new Ontouml2DbOptions(opt) : new Ontouml2DbOptions();
  }

  // TODO: review the implementation of run(), move the actual behavior into the method, and delete unnecessary methods.
  run(): { result: any; issues?: ServiceIssue[] } {
    this.validate();
    this.doMapping();
    this.transformToEntityRelationship();
    return {
      result: {
        schema: this.getRelationalSchema(),
        obda: this.getOBDAFile(),
        connection: this.getProtegeConnection()
      }
    };
  }

  /**
   * Validte if is possible to make the transformation.
   */
  validate(): void {
    if (this.options.targetDBMS === DbmsSupported.GENERIC_SCHEMA && this.options.enumFieldToLookupTable === false) {
      throw new Error('It is not possible to make lookup tables for a GENERIC database.');
    }
  }

  /**
   * Performs the transformation according to the selected strategy.
   */
  doMapping(): void {
    let strategy: IStrategy;

    switch (this.options.mappingStrategy) {
      case StrategyType.ONE_TABLE_PER_CLASS:
        strategy = new OneTablePerClass();
        break;
      case StrategyType.ONE_TABLE_PER_KIND:
        strategy = new OneTablePerKind();
        break;
      case StrategyType.ONE_TABLE_PER_CONCRETE_CLASS:
        strategy = new OneTablePerConcreteClass();
        break;
      default:
        console.log('ops');
        break;
    }

    strategy.run(this.graph, this.tracker);
  }

  /**
   * Adds database constructs to the graph.
   */
  transformToEntityRelationship(): void {
    ToEntityRelationship.run(this.graph, this.tracker, this.options.isStandardizeNames, this.options.enumFieldToLookupTable);
  }

  /**
   * Returns the relational schema form the transformed OntoUML model.
   *
   * @param options
   */
  getRelationalSchema(): string {
    return ToRelationalSchema.getSchema(this.graph, this.options.targetDBMS);
  }

  /**
   * Returns the OBDA file of the OntoUML model. For this, the selected transformation strategy is applied.
   * @param options
   */
  getOBDAFile(): string {
    return GenerateObda.getFile(this.options, this.tracker);
  }

  /**
   * Returns de connection file. This a specific file for Protegé.
   */
  getProtegeConnection(): string {
    return GenerateConnection.getFile(this.options);
  }

  /**
   * Returns the model read from the json file as a graph
   */
  getSourceGraph(): Graph {
    return this.graph;
  }

  /**
   * Return the tracking between the source and target graph nodes
   */
  getTracker(): Tracker {
    return this.tracker;
  }

  /**
   * Returns the configuration options.
   */
  getOptions(): Ontouml2DbOptions {
    return this.options;
  }
}
