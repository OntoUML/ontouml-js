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
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NULL' +
  ',        x1                      VARCHAR(20)    NULL' +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_034_lifting_with_duplicate_attributes = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', true))
      .addProperty(new PropertyChecker('x1', true))
  )
  .addNode(
    new NodeChecker('nationality')
      .addProperty(new PropertyChecker('nationality_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('nationality_enum', false, ['BRAZILIANCITIZEN', 'ITALIANCITIZEN']))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'person'))

  .setNumberOfTablesToFindInScript(1)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const overlappig = false;
const incomplete = false;

const project = new Project();
const model = project.createModel();

// CREATE TYPES
const _int = model.createDatatype('int');
const _string = model.createDatatype('string');
// CREATE CLASSES
const person = model.createKind('Person');
const brazilianCitizen = model.createSubkind('BrazilianCitizen');
const italianCitizen = model.createSubkind('ItalianCitizen');
// CREATE PROPERTIES
person.createAttribute(_string, 'name').cardinality.setOneToOne();
brazilianCitizen.createAttribute(_int, 'x1').cardinality.setOneToOne();
italianCitizen.createAttribute(_int, 'x1').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genPersonBrazilian = model.createGeneralization(person, brazilianCitizen);
const genersonItalian = model.createGeneralization(person, italianCitizen);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genPersonBrazilian, genersonItalian], overlappig, incomplete, null, 'Nationality');

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ******************************
export const test_034: TestResource = {
  title: '034 - Evaluates lifting of generalizations where there are attributes with the same name in the subclasses',
  checker: gChecker_034_lifting_with_duplicate_attributes,
  project,
  options
};
