/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  '    CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ');';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_001_simple_flattening: GraphChecker = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .setNumberOfTablesToFindInScript(1)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
const model = project.createModel();
const person = model.createKind('Person');
const date = model.createDatatype('Date');

const birthDate = person.createAttribute(date, 'birthDate');

birthDate.cardinality.setOneToOne();

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.GENERIC_SCHEMA,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLoocupTable: false
};

// ****************************************
export const test_037: TestResource = {
  title: '037 - Evaluate the transformatino for GEBERIC dbms with lookup table ',
  checker: gChecker_001_simple_flattening,
  project,
  options
};
