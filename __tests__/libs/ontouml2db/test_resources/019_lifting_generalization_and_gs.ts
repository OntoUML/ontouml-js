/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Project } from '@libs/ontouml';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        is_brazilian_citizen    BIT            NOT NULL DEFAULT FALSE' +
  ',        ci                      VARCHAR(20)    NULL' +
  ',        is_italian_citizen      BIT            NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_019_lifting_generalization_and_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('rg', true))
      .addProperty(new PropertyChecker('ci', true))
      .addProperty(new PropertyChecker('is_brazilian_citizen', false))
      .addProperty(new PropertyChecker('is_italian_citizen', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'TEENAGER', 'ADULT']))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'person'))
  .setNumberOfTablesToFindInScript(1)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'));

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
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.GENERIC_SCHEMA,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

// ****************************************
export const test_019: TestResource = {
  title: '019 - Lifting with one generalization set and two simple generalizations',
  checker: gChecker_019_lifting_generalization_and_gs,
  project,
  options
};
