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

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        test1                   INTEGER        NULL' +
  ',        is_employee             BIT            NOT NULL DEFAULT FALSE' +
  ',        test2                   INTEGER        NULL' +
  ',        is_role_x               BIT            NOT NULL DEFAULT FALSE' +
  ',        test3                   INTEGER        NULL' +
  ',        is_role_y               BIT            NOT NULL DEFAULT FALSE' +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_014_lifting_multiple_generalizations = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test1', true))
      .addProperty(new PropertyChecker('test2', true))
      .addProperty(new PropertyChecker('test3', true))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('is_role_x', false))
      .addProperty(new PropertyChecker('is_role_y', false))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('RoleX', 'person'))
  .addTracker(new TrackerChecker('RoleY', 'person'))
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
const _int = model.createDatatype('int');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const employee = model.createRole('Employee');
const roleX = model.createRole('RoleX');
const roleY = model.createRole('RoleY');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
employee.createAttribute(_int, 'test1').cardinality.setOneToOne();
roleX.createAttribute(_int, 'test2').cardinality.setOneToOne();
roleY.createAttribute(_int, 'test3').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, employee);
model.createGeneralization(person, roleX);
model.createGeneralization(person, roleY);

// ****************************************
export const test_014: TestResource = {
  title: '014 - Lifting with multiple generalizations, without forming a generalization set',
  checker: gChecker_014_lifting_multiple_generalizations,
  project
};
