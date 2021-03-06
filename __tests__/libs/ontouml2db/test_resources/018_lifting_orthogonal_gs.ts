/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  '); ';

const scriptNationality =
  'CREATE TABLE IF NOT EXISTS nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ",        nationality_enum        ENUM('BRAZILIANCITIZEN','ITALIANCITIZEN')  NOT NULL" +
  '); ';

const scriptFK = 'ALTER TABLE nationality ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_018_lifting_orthogonal_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('rg', true))
      .addProperty(new PropertyChecker('ci', true))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'TEENAGER', 'ADULT']))
  )
  .addNode(
    new NodeChecker('nationality')
      .addProperty(new PropertyChecker('nationality_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('nationality_enum', false, ['BRAZILIANCITIZEN', 'ITALIANCITIZEN']))
  )
  .addRelationship(new RelationshipChecker('nationality', Cardinality.C0_N, 'person', Cardinality.C1))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'person'))
  .setNumberOfTablesToFindInScript(2)
  .setNumberOfFkToFindInScript(1)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptNationality, 'The PERSON table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFK, 'The FK between PERSON and NATIONALITY not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const overlapping = false;
const complete = true;
const incomplete = false;

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
const genBrazilian = model.createGeneralization(person, brazilian);
const genItalian = model.createGeneralization(person, italian);
const genChild = model.createGeneralization(person, child);
const genTeenager = model.createGeneralization(person, teenager);
const genAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genBrazilian, genItalian], overlapping, incomplete, null, 'Nationality');
model.createGeneralizationSet([genChild, genTeenager, genAdult], disjoint, complete, null, 'LifePhase');

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_018: TestResource = {
  title: '018 - Lifting with orthogonal generalization sets',
  checker: gChecker_018_lifting_orthogonal_gs,
  project,
  options
};
