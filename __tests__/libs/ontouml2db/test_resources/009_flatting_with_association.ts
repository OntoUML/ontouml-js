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
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_b_id       INTEGER        NULL' +
  ',        person_b_id             INTEGER        NULL' +
  ',        organization_id         INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  '); ';

const scriptPersonB =
  'CREATE TABLE IF NOT EXISTS person_b ( ' +
  '         person_b_id             INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_b                  VARCHAR(20)    NOT NULL' +
  ',        birth_date_b            DATE           NOT NULL' +
  '); ';

const scriptOrganizationB =
  'CREATE TABLE IF NOT EXISTS organization_b ( ' +
  '         organization_b_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_b                  VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptFKTestPerson = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKTestOrganization =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';
const scriptFKTestPersonB = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKTestOrganizationB =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scripts: string[] = [scriptPerson, scriptOrganization, scriptTest, scriptPersonB, scriptOrganizationB,
  scriptFKTestPerson, scriptFKTestOrganization, scriptFKTestPersonB, scriptFKTestOrganizationB];

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
const person = model.createKind('Person');
const organization = model.createKind('Organization');
const test = model.createKind('Test');
const namedEntityB = model.createCategory('NamedEntityB');
const personB = model.createKind('PersonB');
const organizationB = model.createKind('OrganizationB');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
namedEntityB.createAttribute(_string, 'nameB').cardinality.setOneToOne();
personB.createAttribute(_date, 'birthDateB').cardinality.setOneToOne();
organizationB.createAttribute(_string, 'address').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
model.createGeneralization(namedEntity, namedEntityB);
const genNamedEntityBPersonB = model.createGeneralization(namedEntityB, personB);
const genNamedEntityBOrganizationB = model.createGeneralization(namedEntityB, organizationB);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');
model.createGeneralizationSet(
  [genNamedEntityBPersonB, genNamedEntityBOrganizationB],
  disjoint,
  complete,
  null,
  'NamedEntityType'
);
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(namedEntity, test, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setZeroToMany();

// ****************************************
export const test_009: TestResource = {
  title: '009 - Flattening involving a generalization set and a hierarchy of nonSortals',
  project,
  scripts,
  obdaMapping,
};
