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
  'CREATE TABLE IF NOT EXISTS super_class ( ' + '         super_class_id          INTEGER        NOT NULL IDENTITY PRIMARY KEY' + '); ';

const scriptAssociatedClass =
  'CREATE TABLE IF NOT EXISTS associated_class ( ' +
  '         associated_class_id     INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        super_class_id          INTEGER        NOT NULL' +
  '); ';

const scriptSuperClassType =
  'CREATE TABLE IF NOT EXISTS super_class_type ( ' +
  '         super_class_type_id     INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        super_class_id          INTEGER        NOT NULL' +
  ",        super_class_type_enum   ENUM('SUBCLASS1','SUBCLASS2')  NOT NULL" +
  '); ';

const scriptFKAssociated =
  'ALTER TABLE associated_class ADD FOREIGN KEY ( super_class_id ) REFERENCES super_class ( super_class_id );';
const scriptFKSuper =
  'ALTER TABLE super_class_type ADD FOREIGN KEY ( super_class_id ) REFERENCES super_class ( super_class_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_025_lifting_gs_overlapping_incomplete = new GraphChecker()
  .addNode(new NodeChecker('super_class').addProperty(new PropertyChecker('super_class_id', false)))
  .addNode(
    new NodeChecker('super_class_type')
      .addProperty(new PropertyChecker('super_class_type_id', false))
      .addProperty(new PropertyChecker('super_class_id', false))
      .addProperty(new PropertyChecker('super_class_type_enum', false, ['SUBCLASS1', 'SUBCLASS2']))
  )
  .addNode(
    new NodeChecker('associated_class')
      .addProperty(new PropertyChecker('associated_class_id', false))
      .addProperty(new PropertyChecker('super_class_id', false))
  )
  .addRelationship(new RelationshipChecker('super_class', Cardinality.C1, 'associated_class', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('super_class_type', Cardinality.C0_N, 'super_class', Cardinality.C1))
  .addTracker(new TrackerChecker('SuperClass', 'super_class'))
  .addTracker(new TrackerChecker('SubClass1', 'super_class'))
  .addTracker(new TrackerChecker('SubClass2', 'super_class'))
  .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'))
  .setNumberOfTablesToFindInScript(3)
  .setNumberOfFkToFindInScript(2)
  .addScriptChecker(new ScriptChecker(scriptSuper, 'The SUPER_CLASS table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAssociatedClass, 'The ASSOCIATED_CLASS table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptSuperClassType, 'The SUPER_CLASS_TYPE table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(
      scriptFKAssociated,
      'The FK between SUPER_CLASS and ASSOCIATED_CLASS not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKSuper, 'The FK between SUPER_CLASS and SUPER_CLASS_TYPE not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const overlapping = false;
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
model.createGeneralizationSet([genSubClass1, genSubClass2], overlapping, incomplete, null, 'SuperClassType');
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
export const test_025: TestResource = {
  title: '025 - Lifting with a overlapping and incomplete generalization set',
  checker: gChecker_025_lifting_gs_overlapping_incomplete,
  project,
  options
};
