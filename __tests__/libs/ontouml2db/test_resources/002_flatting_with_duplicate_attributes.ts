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
  ',        x2                      VARCHAR(20)    NULL' +
  ',        x1                      INTEGER        NULL' +
  ',        x3                      VARCHAR(20)    NULL' +
  ');';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_002_flatting_with_duplicate_attributes = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('x1', true))
      .addProperty(new PropertyChecker('x2', true))
      .addProperty(new PropertyChecker('x3', true))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .setNumberOfTablesToFindInScript(1)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
const model = project.createModel();

// CREATE TYPES
const _int = model.createDatatype('int');
const _string = model.createDatatype('string');

// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
// CREATE PROPERTIES
namedEntity.createAttribute(_int, 'x1');
namedEntity.createAttribute(_string, 'x2');
person.createAttribute(_int, 'x1');
person.createAttribute(_string, 'x3');
// CREATE GENERALIZATIONS
model.createGeneralization(namedEntity, person);

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
  passwordConnection: 'sa'
};

// ****************************************
export const test_002: TestResource = {
  title: '002 - Flattening where there are attributes with the same name in the superclass and subclass',
  checker: gChecker_002_flatting_with_duplicate_attributes,
  project,
  options
};
