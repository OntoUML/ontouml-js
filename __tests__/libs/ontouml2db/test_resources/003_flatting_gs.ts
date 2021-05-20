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
  ',        birth_date              DATE           NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NULL' +
  '); ';

const scripts: string[] = [scriptPerson, scriptOrganization];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaE1 =
'mappingId    UndefinedProjectName-NamedEntity'+
'target       :UndefinedProjectName/person/{person_id} a :NamedEntity ; :name {name}^^xsd:string .'+
'source       SELECT person.person_id, person.name '+
'             FROM person ';

const obdaE2 = 
'mappingId    UndefinedProjectName-NamedEntity3'+
'target       :UndefinedProjectName/organization/{organization_id} a :NamedEntity ; :name {name}^^xsd:string .'+
'source       SELECT organization.organization_id, organization.name '+
'             FROM organization ';

const obdaP =
'mappingId    UndefinedProjectName-Person'+
'target       :UndefinedProjectName/person/{person_id} a :Person ; :birthDate {birth_date}^^xsd:dateTime .'+
'source       SELECT person.person_id, person.birth_date '+
'             FROM person ';

const obdaO =
'mappingId    UndefinedProjectName-Organization'+
'target       :UndefinedProjectName/organization/{organization_id} a :Organization ; :address {address}^^xsd:string .'+
'source       SELECT organization.organization_id, organization.address '+
'             FROM organization ';

const obdaMapping: string[] = [obdaE1, obdaE2, obdaP, obdaO];

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
const person = model.createCategory('Person');
const organization = model.createCategory('Organization');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setZeroToOne();
organization.createAttribute(_string, 'address').cardinality.setZeroToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');


// ****************************************
export const test_003: TestResource = {
  title: '003 - Flattening involving only one generalizations set',
  project,
  scripts,
  obdaMapping,
};
