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
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        is_personal_customer    BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('ADULT','CHILD')  NOT NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '         employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptFKEmployment = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKTest = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scripts: string[] = [scriptPerson, scriptEmployment, scriptTest, scriptFKEmployment,
  scriptFKTest];

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
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
const employee = model.createRole('Employee');
const personalCustomer = model.createRole('PersonalCustomer');
const employment = model.createRelator('Employment');
const test = model.createRelator('Test');
// CREATE GENERALIZATIONS
const genAdult = model.createGeneralization(person, adult);
const genChild = model.createGeneralization(person, child);
model.createGeneralization(adult, employee);
model.createGeneralization(adult, personalCustomer);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genAdult, genChild], disjoint, complete, null, 'LifePhase');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(personalCustomer, test, 'has1');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();
const relation2 = model.createMediationRelation(employee, employment, 'has2');
relation2.getSourceEnd().cardinality.setOneToOne();
relation2.getTargetEnd().cardinality.setOneToMany();

// ****************************************
export const test_027: TestResource = {
  title: '027 - Lifting when one subclass has two indirect associations',
  project,
  scripts,
  obdaMapping,
};
