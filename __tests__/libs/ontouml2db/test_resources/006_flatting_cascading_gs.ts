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
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_b                  VARCHAR(20)    NULL' +
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_a                  VARCHAR(20)    NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scripts: string[] = [scriptPerson, scriptOrganization];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];


// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const complete = true;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const namedEntityA = model.createCategory('NamedEntityA');
const namedEntityB = model.createCategory('NamedEntityB');
const person = model.createKind('Person');
const organization = model.createKind('Organization');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
namedEntityA.createAttribute(_string, 'nameA').cardinality.setZeroToOne();
namedEntityB.createAttribute(_string, 'nameB').cardinality.setZeroToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityEntityA = model.createGeneralization(namedEntity, namedEntityA);
const genNamedEntityEntityB = model.createGeneralization(namedEntity, namedEntityB);
model.createGeneralization(namedEntityB, person);
model.createGeneralization(namedEntityA, organization);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityEntityA, genNamedEntityEntityB], disjoint, complete, null, 'NamedEntityType');

// ****************************************
export const test_006: TestResource = {
  title: '006 - Flattening involving a generalization set, where the subclasses are superclasses of other classes',
  project,
  scripts,
  obdaMapping,
};
