/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Project } from '@libs/ontouml';
import { TestResource } from './TestResource';

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

const scripts: string[] = [scriptPerson];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

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
export const test_013: TestResource = {
  title: '013 - Lifting with cascading generalizations',
  project,
  scripts,
  obdaMapping,
};
