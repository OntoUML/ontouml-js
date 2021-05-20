/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptSuper =
  'CREATE TABLE IF NOT EXISTS super_class ( ' +
  '         super_class_id          INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  '); ';

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

const scripts: string[] = [scriptSuper, scriptAssociatedClass, scriptSuperClassType,
  scriptFKAssociated, scriptFKSuper];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

// ****************************************
//       M O D E L
// ****************************************
const overlapping = false;
const complete = true;

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
model.createGeneralizationSet([genSubClass1, genSubClass2], overlapping, complete, null);
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(subClass2, assocated, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();


// ****************************************
export const test_024: TestResource = {
  title: '024 - Lifting with a overlapping and complete generalization set',
  project,
  scripts,
  obdaMapping,
};
