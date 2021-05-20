/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptOrganizationA =
  'CREATE TABLE IF NOT EXISTS organization_a ( ' +
  '         organization_a_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationB =
  'CREATE TABLE IF NOT EXISTS organization_b ( ' +
  '         organization_b_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationC =
  'CREATE TABLE IF NOT EXISTS organization_c ( ' +
  '         organization_c_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationD =
  'CREATE TABLE IF NOT EXISTS organization_d ( ' +
  '         organization_d_id       INTEGER         NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_d_id       INTEGER        NULL' +
  ',        organization_c_id       INTEGER        NULL' +
  ',        organization_b_id       INTEGER        NULL' +
  ',        organization_a_id       INTEGER        NULL' +
  ',        test1                   INTEGER        NOT NULL' +
  '); ';

const scriptFKTestOrganizationA =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_a_id ) REFERENCES organization_a ( organization_a_id );';
const scriptFKTestOrganizationB =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_b_id ) REFERENCES organization_b ( organization_b_id );';
const scriptFKTestOrganizationC =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_c_id ) REFERENCES organization_c ( organization_c_id );';
const scriptFKTestOrganizationD =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_d_id ) REFERENCES organization_d ( organization_d_id );';

const scripts: string[] = [scriptOrganizationA, scriptOrganizationB, scriptOrganizationC, 
  scriptOrganizationD, scriptTest, scriptFKTestOrganizationA, scriptFKTestOrganizationB,
  scriptFKTestOrganizationC, scriptFKTestOrganizationD
];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

// ****************************************
//       M O D E L
// ****************************************
const overlapping = false;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _int = model.createDatatype('int');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const organizationA = model.createKind('OrganizationA');
const organizationB = model.createKind('OrganizationB');
const organizationC = model.createKind('OrganizationC');
const organizationD = model.createKind('OrganizationD');
const test = model.createKind('Test');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
organizationB.createAttribute(_string, 'address').cardinality.setOneToOne();
test.createAttribute(_int, 'test1').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityOrganizationA = model.createGeneralization(namedEntity, organizationA);
const genNamedEntityOrganizationB = model.createGeneralization(namedEntity, organizationB);
const genNamedEntityOrganizationC = model.createGeneralization(namedEntity, organizationC);
const genNamedEntityOrganizationD = model.createGeneralization(namedEntity, organizationD);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityOrganizationA, genNamedEntityOrganizationB], overlapping, incomplete, null, 'Set1');
model.createGeneralizationSet([genNamedEntityOrganizationC, genNamedEntityOrganizationD], overlapping, incomplete, null, 'Set');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(namedEntity, test, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setZeroToMany();


// ****************************************
export const test_011: TestResource = {
  title: '011 - Flatting with one association and multiples generalization sets',
  project,
  scripts,
  obdaMapping,
};
