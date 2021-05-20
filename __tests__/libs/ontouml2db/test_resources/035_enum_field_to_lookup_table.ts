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
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        life_phase_id           INTEGER        NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  '); ';

const scriptNationality =
  'CREATE TABLE nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL PRIMARY KEY' +
  ',        nationality             VARCHAR(20)    NOT NULL' +
  '); ';

const scriptLifePhase =
  'CREATE TABLE life_phase ( ' +
  '         life_phase_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',        life_phase              VARCHAR(20)    NOT NULL' +
  '); ';

const scriptNationalityPerson =
  'CREATE TABLE nationality_person ( ' +
  '         nationality_person_id   INTEGER        NOT NULL PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        nationality_id          INTEGER        NOT NULL' +
  '); ';

const scriptFKPersonLifePhase = 'ALTER TABLE person ADD FOREIGN KEY ( life_phase_id ) REFERENCES life_phase ( life_phase_id )';

const scriptFKNationalityPersonPerson =
  'ALTER TABLE nationality_person ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKNationalityNationalityPerson =
  'ALTER TABLE nationality_person ADD FOREIGN KEY ( nationality_id ) REFERENCES nationality ( nationality_id )';

const scripts: string[] = [scriptPerson, scriptNationality, scriptLifePhase, scriptNationalityPerson,
  scriptFKPersonLifePhase, scriptFKNationalityPersonPerson, scriptFKNationalityNationalityPerson];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaPerson = 
'mappingId    UndefinedProjectName-Person'+
'target       :UndefinedProjectName/person/{person_id} a :Person ; :birthDate {birth_date}^^xsd:dateTime ; :has_LifePhase :UndefinedProjectName/life_phase/{life_phase_id}  .'+
'source       SELECT person.person_id, person.birth_date, person.life_phase_id ';
'             FROM person '

const obdaBrazilian = 
'mappingId    UndefinedProjectName-BrazilianCitizen'+
'target       :UndefinedProjectName/person/{person_id} a :BrazilianCitizen ; :RG {rg}^^xsd:string ; :has_LifePhase :UndefinedProjectName/life_phase/{life_phase_id}  .'+
'source       SELECT person.person_id, person.rg, person.life_phase_id '+
'             FROM person '+
'             INNER JOIN nationality_person'+
'                     ON person.person_id = nationality_person.person_id'+
'             INNER JOIN nationality'+
'                     ON nationality_person.nationality_id = nationality.nationality_id'+
"                     AND nationality.nationality = 'BRAZILIANCITIZEN'";

const obdaItalian = 
'mappingId    UndefinedProjectName-ItalianCitizen'+
'target       :UndefinedProjectName/person/{person_id} a :ItalianCitizen ; :CI {ci}^^xsd:string ; :has_LifePhase :UndefinedProjectName/life_phase/{life_phase_id}  .'+
'source       SELECT person.person_id, person.ci, person.life_phase_id '+
'             FROM person '+
'             INNER JOIN nationality_person'+
'                     ON person.person_id = nationality_person.person_id'+
'             INNER JOIN nationality'+
'                     ON nationality_person.nationality_id = nationality.nationality_id'+
"                     AND nationality.nationality = 'ITALIANCITIZEN' ";

const obdaChild = 
'mappingId    UndefinedProjectName-Child'+
'target       :UndefinedProjectName/person/{person_id} a :Child ; :has_LifePhase :UndefinedProjectName/life_phase/{life_phase_id}  .'+
'source       SELECT person.person_id, person.life_phase_id '+
'             FROM person '+
'             INNER JOIN life_phase'+
'                     ON person.life_phase_id = life_phase.life_phase_id'+
"                     AND life_phase.life_phase = 'CHILD' ";

const obdaAdult = 
'mappingId    UndefinedProjectName-Adult'+
'target       :UndefinedProjectName/person/{person_id} a :Adult ; :has_LifePhase :UndefinedProjectName/life_phase/{life_phase_id}  .'+
'source       SELECT person.person_id, person.life_phase_id '+
'             FROM person '+
'             INNER JOIN life_phase'+
'                     ON person.life_phase_id = life_phase.life_phase_id'+
"                     AND life_phase.life_phase = 'ADULT' ";

const obdaNationality =
'mappingId    UndefinedProjectName-has_Nationality'+
'target       :UndefinedProjectName/person/{person_id} :has_Nationality :UndefinedProjectName/nationality/{nationality_id}.'+
'source       SELECT nationality_person.nationality_person_id, nationality_person.person_id, nationality_person.nationality_id '+
'             FROM nationality_person ';

const obdaMapping: string[] = [obdaPerson, obdaBrazilian, obdaItalian, obdaChild, obdaAdult, obdaNationality];

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
export const test_035: TestResource = {
  title: '035 - Evaluates the transformation of enumerations into lookup tables.',
  project,
  scripts,
  obdaMapping,
};
