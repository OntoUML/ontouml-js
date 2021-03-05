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

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  '    CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ');';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_001_simple_flattening: GraphChecker = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false))
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
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
const _string = model.createDatatype('string');
const date = model.createDatatype('Date');

model.createGeneralization(namedEntity, person);
const name = namedEntity.createAttribute(_string, 'name');
const birthDate = person.createAttribute(date, 'birthDate');

name.cardinality.setOneToOne();
birthDate.cardinality.setOneToOne();

// ****************************************
export const test_001: TestResource = {
  title: '001 - Flattening involving only one generalization test',
  checker: gChecker_001_simple_flattening,
  project
};
