/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        test                    INTEGER        NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        is_adult                BOOLEAN        NOT NULL DEFAULT FALSE' +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '         employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        salary                  DOUBLE         NOT NULL' +
  '); ';

const scriptFKTestPerson = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scripts: string[] = [scriptPerson, scriptEmployment, scriptFKTestPerson];

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
const _double = model.createDatatype('double');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const adult = model.createPhase('Adult');
const employee = model.createRole('Employee');
const employment = model.createRelator('Employment');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
employee.createAttribute(_int, 'test').cardinality.setOneToOne();
employment.createAttribute(_double, 'salary').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, adult);
model.createGeneralization(adult, employee);
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(employee, employment, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();

// ****************************************
export const test_016: TestResource = {
  title: '016 - Lifting with cascading generalizations and one association with the subclass',
  project,
  scripts,
  obdaMapping,
};
