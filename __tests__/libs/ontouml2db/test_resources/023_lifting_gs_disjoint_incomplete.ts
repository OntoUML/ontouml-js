import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_023_lifting_gs_disjoint_incomplete = new GraphChecker()
  .addNode(
    new NodeChecker('super_class')
      .addProperty(new PropertyChecker('super_class_id', false))
      .addProperty(
        new PropertyChecker('super_class_type_enum', true, [
          'SUBCLASS1',
          'SUBCLASS2',
        ]),
      ),
  )
  .addNode(
    new NodeChecker('associated_class')
      .addProperty(new PropertyChecker('associated_class_id', false))
      .addProperty(new PropertyChecker('super_class_id', false)),
  )
  .addRelationship(
    new RelationshipChecker(
      'super_class',
      Cardinality.C1,
      'associated_class',
      Cardinality.C0_N,
    ),
  )
  .addTracker(new TrackerChecker('SuperClass', 'super_class'))
  .addTracker(new TrackerChecker('SubClass1', 'super_class'))
  .addTracker(new TrackerChecker('SubClass2', 'super_class'))
  .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'));

export const test_023: TestResource = {
  title:
    '023 Evaluate the lifting with a disjoint and incomplete generalization set',
  model: require('./test_023_lifting_gs_disjoint_incomplete.json'),
  checker: gChecker_023_lifting_gs_disjoint_incomplete,
};
