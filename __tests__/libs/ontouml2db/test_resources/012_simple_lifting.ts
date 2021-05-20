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
  ',        test                    VARCHAR(20)    NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  '); ';

const scripts: string[] = [scriptPerson];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdatPerson = 
'mappingId    test012-Person' +
'target       :test012/person/{person_id} a :Person ; :birthDate {birth_date}^^xsd:dateTime .' +
'source       SELECT person.person_id, person.birth_date ' +
'             FROM person ';

const obdaEmployee =
'mappingId    test012-Employee' +
'target       :test012/person/{person_id} a :Employee ; :test {test}^^xsd:string .' +
'source       SELECT person.person_id, person.test ' +
'             FROM person '+
'             WHERE is_employee = TRUE ';

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [obdatPerson, obdaEmployee];

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
project.setName('test012');
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const employee = model.createRole('Employee');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
employee.createAttribute(_string, 'test').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, employee);

// ****************************************
export const test_012: TestResource = {
  title: '012 - Lifting with a simple generalization',
  project,
  scripts,
  obdaMapping,
};
