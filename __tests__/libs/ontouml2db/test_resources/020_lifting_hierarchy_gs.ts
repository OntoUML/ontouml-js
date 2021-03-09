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
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { Project } from '@libs/ontouml';
import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        test_teenager_b         VARCHAR(20)    NULL' +
  ',        test_adult_b            VARCHAR(20)    NULL' +
  ',        test_adult_a            INTEGER        NULL' +
  ',        is_employee             BIT            NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  ",        teenager_phase_enum     ENUM('TEENAGERA','TEENAGERB')  NULL" +
  ",        adult_phase_enum        ENUM('ADULTA','ADULTB')  NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE employment (' +
  '         employment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        salary                  FLOAT          NOT NULL' +
  '); ';

const scriptFK = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_020_lifting_hierarchy_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'TEENAGER', 'ADULT']))
      .addProperty(new PropertyChecker('teenager_phase_enum', true, ['TEENAGERA', 'TEENAGERB']))
      .addProperty(new PropertyChecker('adult_phase_enum', true, ['ADULTA', 'ADULTB']))
      .addProperty(new PropertyChecker('test_teenager_b', true))
      .addProperty(new PropertyChecker('test_adult_a', true))
      .addProperty(new PropertyChecker('test_adult_b', true))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('salary', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('TeenagerA', 'person'))
  .addTracker(new TrackerChecker('TeenagerB', 'person'))
  .addTracker(new TrackerChecker('AdultA', 'person'))
  .addTracker(new TrackerChecker('AdultB', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .setNumberOfTablesToFindInScript(2)
  .setNumberOfFkToFindInScript(1)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The PERSON table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFK, 'The FK between PERSON and NATIONALITY not exists or is different than expected.')
  );

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
export const test_020: TestResource = {
  title: '020 - Lifting with hierarchy of generalization sets',
  checker: gChecker_020_lifting_hierarchy_gs,
  project,
  options
};
