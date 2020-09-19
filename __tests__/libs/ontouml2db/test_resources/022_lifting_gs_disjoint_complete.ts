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

const gChecker_022_lifting_gs_disjoint_complete = new GraphChecker()
  .addNode(
    new NodeChecker('super_class')
      .addProperty(new PropertyChecker('super_class_id', false))
      .addProperty(
        new PropertyChecker('super_class_type_enum', false, [
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

export const test_022: TestResource = {
  title:
    '022 Evaluate the lifting with a disjoint and complete generalization set',
  model: require('./test_022_lifting_gs_disjoint.json'),
  checker: gChecker_022_lifting_gs_disjoint_complete,
};
