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
  ',        is_test1                BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        test2                   INTEGER        NULL' +
  ',        is_test2                BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  '); ';

const scriptEmploymentA =
  'CREATE TABLE IF NOT EXISTS employment_a ( ' +
  '         employment_a_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptEmploymentB = 'CREATE TABLE IF NOT EXISTS employment_b ( ';
'         employment_b_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY';
',        person_id               INTEGER        NOT NULL';
'); ';

const scriptFKA = 'ALTER TABLE employment_a ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKB = 'ALTER TABLE employment_b ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scripts: string[] = [scriptPerson, scriptEmploymentA, scriptEmploymentB, scriptFKA, scriptFKB];

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
const _int = model.createDatatype('int');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const teenager = model.createPhase('Teenager');
const adult = model.createPhase('Adult');
const test1 = model.createRole('Test1');
const test2 = model.createRole('Test2');
const employmentA = model.createRelator('EmploymentA');
const employmentB = model.createRelator('EmploymentB');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
test2.createAttribute(_int, 'test2').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, test1);
model.createGeneralization(person, test2);
const genChild = model.createGeneralization(person, child);
const genTeenager = model.createGeneralization(person, teenager);
const genAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genChild, genTeenager, genAdult], disjoint, complete, null, 'LifePhase');
// CREATE ASSOCIATINS
const relationA = model.createMediationRelation(adult, employmentA, 'has');
relationA.getSourceEnd().cardinality.setOneToOne();
relationA.getTargetEnd().cardinality.setZeroToMany();
const relationB = model.createMediationRelation(test2, employmentB, 'has');
relationB.getSourceEnd().cardinality.setOneToOne();
relationB.getTargetEnd().cardinality.setZeroToMany();


// ****************************************
export const test_021: TestResource = {
  title: '021 - Lifting with generalizations, one generalization set and association in the subclasses',
  project,
  scripts,
  obdaMapping,
};
