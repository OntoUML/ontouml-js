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
  '    CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        x1                      INTEGER        NULL' +
  ',        x2                      VARCHAR(20)    NULL' +
  ',        x3                      VARCHAR(20)    NULL' +
  ');';

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
const _string = model.createDatatype('string');

// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');

// CREATE PROPERTIES
const x1 = namedEntity.createAttribute(_int, 'x1');
const x2 = namedEntity.createAttribute(_string, 'x2');
const x1_2 = person.createAttribute(_int, 'x1');
const x3 = person.createAttribute(_string, 'x3');

x1.cardinality.setZeroToOne();
x2.cardinality.setZeroToOne();
x1_2.cardinality.setZeroToOne();
x3.cardinality.setZeroToOne();

// CREATE GENERALIZATIONS
model.createGeneralization(namedEntity, person);


// ****************************************
export const test_002: TestResource = {
  title: '002 - Flattening where there are attributes with the same name.',
  project,
  scripts,
  obdaMapping,
};
