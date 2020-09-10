import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';

export const gChecker_008_flatting_root_association = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false)),
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false)),
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('organization_id', true))
      .addProperty(new PropertyChecker('person_id', true)),
  )
  .addRelationship(
    new RelationshipChecker(
      'organization',
      Cardinality.C0_1,
      'test',
      Cardinality.C0_N,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'person',
      Cardinality.C0_1,
      'test',
      Cardinality.C0_N,
    ),
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .addTracker(new TrackerChecker('Test', 'test'));

it('should ignore', () => {
  expect(true).toBe(true);
});
