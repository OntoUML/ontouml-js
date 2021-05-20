/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

// ****************************************
//       SCHEMA RESULT
// **************************************** 
const scriptPerson =
  '    CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ');';


// const scripts: string[] = ['    CREATE TABLE IF NOT EXISTS person ( ',
// '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' ,
// ',        name                    VARCHAR(20)    NOT NULL' ,
// ',        birth_date              DATE           NOT NULL' ,
// ');'];

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
  project,
  scripts,
  obdaMapping,
};
