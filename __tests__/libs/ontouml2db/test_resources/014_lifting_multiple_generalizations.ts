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
  ',        test1                   INTEGER        NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        test2                   INTEGER        NULL' +
  ',        is_role_x               BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        test3                   INTEGER        NULL' +
  ',        is_role_y               BOOLEAN        NOT NULL DEFAULT FALSE' +
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
  project,
  scripts,
  obdaMapping,
};
