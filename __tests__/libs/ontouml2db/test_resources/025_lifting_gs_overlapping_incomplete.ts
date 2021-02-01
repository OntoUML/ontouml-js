import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

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
  .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'));

const jsonModel = require('./test_025_lifting_gs_overlapping_incomplete.json');

export const test_025: TestResource = {
  title: '025 Evaluate the lifting with a overlapping and incomplete generalization set',
  checker: gChecker_025_lifting_gs_overlapping_incomplete,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
