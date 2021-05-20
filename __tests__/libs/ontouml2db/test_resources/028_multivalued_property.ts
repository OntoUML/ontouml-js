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
  '); ';

const scriptTel =
  'CREATE TABLE IF NOT EXISTS tel ( ' +
  '         tel_id                  INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        tel                     VARCHAR(20)    NOT NULL' +
  '); ';

const scriptAddress =
  'CREATE TABLE IF NOT EXISTS address ( ' +
  '         address_id              INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptFKTel = 'ALTER TABLE tel ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKAddress = 'ALTER TABLE address ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scripts: string[] = [scriptPerson, scriptTel, scriptAddress, scriptFKTel, scriptFKAddress];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************

const obdaNamedEntity = 
'mappingId    Test28-NamedEntity'+
'target       :Test28/person/{person_id} a :NamedEntity ; :name {name}^^xsd:string ; :tel {tel}^^xsd:string .'+
'source       SELECT person.person_id, person.name, tel.tel '+
'             FROM person '+
'             INNER JOIN tel'+
'                     ON person.person_id = tel.person_id ';

const obdaPerson = 
'mappingId    Test28-Person'+
'target       :Test28/person/{person_id} a :Person ; :address {address}^^xsd:string .'+
'source       SELECT person.person_id, address.address '+
'             FROM person '+
'             INNER JOIN address'+
'                     ON person.person_id = address.person_id ';


const obdaMapping: string[] = [obdaNamedEntity, obdaPerson];

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
project.setName('Test28');
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
// CREATE GENERALIZATIONS
model.createGeneralization(namedEntity, person);
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
namedEntity.createAttribute(_string, 'tel').cardinality.setZeroToMany();
person.createAttribute(_string, 'address').cardinality.setOneToMany();


// ****************************************
export const test_028: TestResource = {
  title: '028 - Evaluates the multivalued property',
  project,
  scripts,
  obdaMapping,
};
