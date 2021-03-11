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
const scriptSuper =
  'CREATE TABLE IF NOT EXISTS super_class ( ' +
  '         super_class_id            INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ",        super_class_type_enum     ENUM('SUBCLASS1','SUBCLASS2')  NULL" +
  '); ';

const scriptAssociatedClass =
  'CREATE TABLE IF NOT EXISTS associated_class ( ' +
  '         associated_class_id     INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        super_class_id          INTEGER        NOT NULL' +
  '); ';

const scriptFK = 'ALTER TABLE associated_class ADD FOREIGN KEY ( super_class_id ) REFERENCES super_class ( super_class_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_023_lifting_gs_disjoint_incomplete = new GraphChecker()
  .addNode(
    new NodeChecker('super_class')
      .addProperty(new PropertyChecker('super_class_id', false))
      .addProperty(new PropertyChecker('super_class_type_enum', true, ['SUBCLASS1', 'SUBCLASS2']))
  )
  .addNode(
    new NodeChecker('associated_class')
      .addProperty(new PropertyChecker('associated_class_id', false))
      .addProperty(new PropertyChecker('super_class_id', false))
  )
  .addRelationship(new RelationshipChecker('super_class', Cardinality.C1, 'associated_class', Cardinality.C0_N))
  .addTracker(new TrackerChecker('SuperClass', 'super_class'))
  .addTracker(new TrackerChecker('SubClass1', 'super_class'))
  .addTracker(new TrackerChecker('SubClass2', 'super_class'))
  .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'))
  .setNumberOfTablesToFindInScript(2)
  .setNumberOfFkToFindInScript(1)
  .addScriptChecker(new ScriptChecker(scriptSuper, 'The SUPER_CLASS table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAssociatedClass, 'The ASSOCIATED_CLASS table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFK, 'The FK between SUPER_CLASS and ASSOCIATED_CLASS not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE CLASSES
const superClass = model.createKind('SuperClass');
const subClass1 = model.createRole('SubClass1');
const subClass2 = model.createRole('SubClass2');
const assocated = model.createRelator('AssociatedClass');
// CREATE GENERALIZATIONS
const genSubClass1 = model.createGeneralization(superClass, subClass1);
const genSubClass2 = model.createGeneralization(superClass, subClass2);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genSubClass1, genSubClass2], disjoint, incomplete, null, 'SuperClassType');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(subClass2, assocated, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLoocupTable: false
};

// ****************************************
export const test_023: TestResource = {
  title: '023 - Lifting with a disjoint and incomplete generalization set',
  checker: gChecker_023_lifting_gs_disjoint_incomplete,
  project,
  options
};
