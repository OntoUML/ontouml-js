import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';

export const gChecker_027_lifting_multiple_relations_to_remake = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(
        new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']),
      )
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('is_personal_customer', false)),
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('person_id', false)),
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('person_id', false)),
  )
  .addRelationship(
    new RelationshipChecker(
      'person',
      Cardinality.C1,
      'employment',
      Cardinality.C0_N,
    ),
  )
  .addRelationship(
    new RelationshipChecker('person', Cardinality.C1, 'test', Cardinality.C0_N),
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('PersonalCustomer', 'person'))
  .addTracker(new TrackerChecker('Employment', 'employment'));

it('should ignore', () => {
  expect(true).toBe(true);
});
