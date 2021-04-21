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
  ',        test1                   INTEGER        NULL' +
  ',        test2                   INTEGER        NULL' +
  ",        person_phase_enum       ENUM('CHILD','ADULT')  NOT NULL" +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_015_lifting_multiple_generalizations_duplicate_attributes = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test1', true))
      .addProperty(new PropertyChecker('test2', true))
      .addProperty(new PropertyChecker('person_phase_enum', false, ['CHILD', 'ADULT']))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .setNumberOfTablesToFindInScript(1)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const complete = true;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _int = model.createDatatype('int');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
child.createAttribute(_int, 'test1').cardinality.setOneToOne();
child.createAttribute(_int, 'test2').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genPersonChild = model.createGeneralization(person, child);
const genPersonAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genPersonChild, genPersonAdult], disjoint, complete, null, 'PersonPhase');

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

// ****************************************
export const test_015: TestResource = {
  title: '015 - Lifting a generalization set with the attribute name repeated in both subclasses',
  checker: gChecker_015_lifting_multiple_generalizations_duplicate_attributes,
  project,
  options
};
