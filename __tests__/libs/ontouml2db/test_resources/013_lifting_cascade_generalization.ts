/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Project } from '@libs/ontouml';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        test_role_x             INTEGER        NULL' +
  ',        is_role_x               BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        test_employee           INTEGER        NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_013_lifting_cascade_generalization = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test_role_x', true))
      .addProperty(new PropertyChecker('test_employee', true))
      .addProperty(new PropertyChecker('is_role_x', false))
      .addProperty(new PropertyChecker('is_employee', false))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('RoleX', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .setNumberOfTablesToFindInScript(1)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _date = model.createDatatype('Date');
const _int = model.createDatatype('int');
// CREATE CLASSES
const person = model.createKind('Person');
const roleX = model.createRole('RoleX');
const employee = model.createRole('Employee');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
roleX.createAttribute(_int, 'testRoleX').cardinality.setOneToOne();
employee.createAttribute(_int, 'testEmployee').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, roleX);
model.createGeneralization(person, employee);

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  standardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_013: TestResource = {
  title: '013 - Lifting with cascading generalizations',
  checker: gChecker_013_lifting_cascade_generalization,
  project,
  options
};
