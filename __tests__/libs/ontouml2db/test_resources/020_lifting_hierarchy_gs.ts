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
  ',        birth_date              DATE           NOT NULL' +
  ',        test_teenager_b         VARCHAR(20)    NULL' +
  ',        test_adult_b            VARCHAR(20)    NULL' +
  ',        test_adult_a            INTEGER        NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  ",        teenager_phase_enum     ENUM('TEENAGERA','TEENAGERB')  NULL" +
  ",        adult_phase_enum        ENUM('ADULTA','ADULTB')  NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment (' +
  '         employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        salary                  FLOAT          NOT NULL' +
  '); ';

const scriptFK = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scripts: string[] = [scriptPerson, scriptEmployment, scriptFK];


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
const _int = model.createDatatype('int');
const _float = model.createDatatype('float');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const teenager = model.createPhase('Teenager');
const teenagerA = model.createPhase('TeenagerA');
const teenagerB = model.createPhase('TeenagerB');
const adult = model.createPhase('Adult');
const adultA = model.createPhase('AdultA');
const adultB = model.createPhase('AdultB');
const employee = model.createRole('Employee');
const employment = model.createRelator('Employment');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
teenagerB.createAttribute(_string, 'testTeenagerB').cardinality.setOneToOne();
adultA.createAttribute(_int, 'testAdultA').cardinality.setOneToOne();
adultB.createAttribute(_string, 'testAdultB').cardinality.setOneToOne();
employment.createAttribute(_float, 'salary').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genChild = model.createGeneralization(person, child);
const genTeenager = model.createGeneralization(person, teenager);
const genAdult = model.createGeneralization(person, adult);
const genTeenagerA = model.createGeneralization(teenager, teenagerA);
const genTeenagerB = model.createGeneralization(teenager, teenagerB);
const genAdultA = model.createGeneralization(adult, adultA);
const genAdultB = model.createGeneralization(adult, adultB);
model.createGeneralization(adultA, employee);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genChild, genTeenager, genAdult], disjoint, complete, null, 'LifePhase');
model.createGeneralizationSet([genTeenagerA, genTeenagerB], disjoint, complete, null, 'TeenagerPhase');
model.createGeneralizationSet([genAdultA, genAdultB], disjoint, complete, null, 'AdultPhase');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(employee, employment, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();


// ****************************************
export const test_020: TestResource = {
  title: '020 - Lifting with hierarchy of generalization sets',
  project,
  scripts,
  obdaMapping,
};
