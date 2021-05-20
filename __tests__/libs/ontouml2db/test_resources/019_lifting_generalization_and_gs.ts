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
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        is_brazilian_citizen    BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        ci                      VARCHAR(20)    NULL' +
  ',        is_italian_citizen      BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  '); ';

const scripts: string[] = [scriptPerson];

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
const person = model.createKind('Person');
const child = model.createPhase('Child');
const teenager = model.createPhase('Teenager');
const adult = model.createPhase('Adult');
const brazilian = model.createRole('BrazilianCitizen');
const italian = model.createRole('ItalianCitizen');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
brazilian.createAttribute(_string, 'RG').cardinality.setOneToOne();
italian.createAttribute(_string, 'CI').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, brazilian);
model.createGeneralization(person, italian);
const genChild = model.createGeneralization(person, child);
const genTeenager = model.createGeneralization(person, teenager);
const genAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genChild, genTeenager, genAdult], disjoint, complete, null, 'LifePhase');


// ****************************************
export const test_019: TestResource = {
  title: '019 - Lifting with one generalization set and two simple generalizations',
  project,
  scripts,
  obdaMapping,
};
