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
  ',        name                    VARCHAR(20)    NULL' +
  ',        x1                      VARCHAR(20)    NULL' +
  '); ';

const scripts: string[] = [scriptPerson];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

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


// ******************************
export const test_034: TestResource = {
  title: '034 - Evaluates lifting of generalizations where there are attributes with the same name in the subclasses',
  project,
  scripts,
  obdaMapping,
};
