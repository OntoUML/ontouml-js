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
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptPersonX =
  'CREATE TABLE IF NOT EXISTS person_x ( ' +
  '         person_x_id             INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationX =
  'CREATE TABLE IF NOT EXISTS organization_x ( ' +
  '         organization_x_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptTestX =
  'CREATE TABLE IF NOT EXISTS test_x ( ' +
  '         test_x_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        test                    BOOLEAN        NULL' +
  '); ';

const scripts: string[] = [scriptPerson, scriptOrganization, scriptPersonX, scriptOrganizationX, scriptTestX];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const overlappig = false;
const complete = true;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _date = model.createDatatype('Date');
const _boolean = model.createDatatype('boolean');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
const organization = model.createKind('Organization');
const personX = model.createKind('PersonX');
const organizationX = model.createKind('OrganizationX');
const testX = model.createKind('TestX');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
testX.createAttribute(_boolean, 'test').cardinality.setZeroToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
const genNamedEntityPersonX = model.createGeneralization(namedEntity, personX);
const genNamedEntityOrganizationX = model.createGeneralization(namedEntity, organizationX);
const genNamedEntityTestX = model.createGeneralization(namedEntity, testX);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');
model.createGeneralizationSet(
  [genNamedEntityPersonX, genNamedEntityOrganizationX, genNamedEntityTestX],
  overlappig,
  incomplete,
  null,
  'GSType'
);


// ****************************************
export const test_005: TestResource = {
  title: '005 - Flattening involving two orthogonal generalizations sets to each other',
  project,
  scripts,
  obdaMapping,
};
