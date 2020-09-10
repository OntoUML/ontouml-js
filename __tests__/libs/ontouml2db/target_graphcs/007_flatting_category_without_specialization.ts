import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';

export const gChecker_007_flatting_category_without_specialization = new GraphChecker()
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
    new NodeChecker('named_entity_a')
      .addProperty(new PropertyChecker('named_entity_a_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_a', true)),
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('NamedEntity', 'named_entity_a'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'));

it('should ignore', () => {
  expect(true).toBe(true);
});
