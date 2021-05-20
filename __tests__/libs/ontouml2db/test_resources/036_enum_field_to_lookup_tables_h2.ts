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
  ',        life_phase_id           INTEGER        NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  '); ';

const scriptNationality =
  'CREATE TABLE IF NOT EXISTS nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        nationality             VARCHAR(20)    NOT NULL' +
  '); ';

const scriptLifePhase =
  'CREATE TABLE IF NOT EXISTS life_phase ( ' +
  '         life_phase_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        life_phase              VARCHAR(20)    NOT NULL' +
  '); ';

const scriptNationalityPerson =
  'CREATE TABLE IF NOT EXISTS nationality_person ( ' +
  '         nationality_person_id   INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        nationality_id          INTEGER        NOT NULL' +
  '); ';

const scriptFKPersonLifePhase = 'ALTER TABLE person ADD FOREIGN KEY ( life_phase_id ) REFERENCES life_phase ( life_phase_id )';

const scriptFKNationalityPersonPerson =
  'ALTER TABLE nationality_person ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKNationalityNationalityPerson =
  'ALTER TABLE nationality_person ADD FOREIGN KEY ( nationality_id ) REFERENCES nationality ( nationality_id )';

const scripts: string[] = [scriptPerson, scriptNationality, scriptLifePhase, scriptNationalityPerson, scriptFKPersonLifePhase,
  scriptFKNationalityPersonPerson, scriptFKNationalityNationalityPerson];


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
// CREATE CLASSES
const person = model.createKind('Person');
const brazilianCitizen = model.createRole('BrazilianCitizen');
const italianCitizen = model.createRole('ItalianCitizen');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
brazilianCitizen.createAttribute(_string, 'RG').cardinality.setOneToOne();
italianCitizen.createAttribute(_string, 'CI').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genPersonBrazilian = model.createGeneralization(person, brazilianCitizen);
const genPersonItalian = model.createGeneralization(person, italianCitizen);
const genPersonChild = model.createGeneralization(person, child);
const genPersonAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genPersonBrazilian, genPersonItalian], overlappig, incomplete, null, 'Nationality');
model.createGeneralizationSet([genPersonChild, genPersonAdult], disjoint, complete, null, 'LifePhase');


// ****************************************
export const test_036: TestResource = {
  title: '036 - Evaluates the transformation of enumerations into lookup tables for a specific database(H2).',
  project,
  scripts,
  obdaMapping,
};
