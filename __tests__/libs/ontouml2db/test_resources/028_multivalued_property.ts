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

const gChecker_028_multivalued_property = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false)),
  )
  .addNode(
    new NodeChecker('tel')
      .addProperty(new PropertyChecker('tel_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('tel', false)),
  )
  .addNode(
    new NodeChecker('address')
      .addProperty(new PropertyChecker('address_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('address', false)),
  )
  .addRelationship(
    new RelationshipChecker('person', Cardinality.C1, 'tel', Cardinality.C0_N),
  )
  .addRelationship(
    new RelationshipChecker(
      'person',
      Cardinality.C1,
      'address',
      Cardinality.C0_N,
    ),
  )
  .addTracker(new TrackerChecker('Person', 'person'));

export const test_028: TestResource = {
  title: '028 Evaluates the multivalued property',
  model: require('./test_028_multivalued_property.json'),
  checker: gChecker_028_multivalued_property,
};
