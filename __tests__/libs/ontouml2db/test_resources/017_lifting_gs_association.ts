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
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        test                    INTEGER        NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','ADULT')  NOT NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '         employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        salary                  FLOAT          NOT NULL' +
  '); ';

const scriptFK = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_017_lifting_gs_association = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test', true))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']))
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
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .setNumberOfTablesToFindInScript(2)
  .setNumberOfFkToFindInScript(1)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The EMPLOYMENT table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFK, 'The FK between EMPLOYEE and EMPLOYMENT not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const complete = true;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _int = model.createDatatype('int');
const _float = model.createDatatype('float');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
const employee = model.createRole('Employee');
const employment = model.createRelator('Employment');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
employee.createAttribute(_int, 'test').cardinality.setOneToOne();
employment.createAttribute(_float, 'salary').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genPersonChild = model.createGeneralization(person, child);
const genPersonAdult = model.createGeneralization(person, adult);
model.createGeneralization(adult, employee);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genPersonChild, genPersonAdult], disjoint, complete, null, 'LifePhase');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(employee, employment, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  standardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_017: TestResource = {
  title: '017 - Lifting with one generalization set, where one subclass has one specialization and one association',
  checker: gChecker_017_lifting_gs_association,
  project,
  options
};
