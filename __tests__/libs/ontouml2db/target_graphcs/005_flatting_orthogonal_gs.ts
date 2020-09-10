import { GraphChecker } from "@libs/ontouml2db/graph/graph_tester/GraphChecker";
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';

export const gChecker_005_flatting_orthogonal_gs = new GraphChecker()
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
    new NodeChecker('person_x')
        .addProperty(new PropertyChecker('person_x_id', false))
        .addProperty(new PropertyChecker('name', false)),
    )
    .addNode(
    new NodeChecker('organization_x')
        .addProperty(new PropertyChecker('organization_x_id', false))
        .addProperty(new PropertyChecker('name', false)),
    )
    .addNode(
    new NodeChecker('test_x')
        .addProperty(new PropertyChecker('test_x_id', false))
        .addProperty(new PropertyChecker('name', false))
        .addProperty(new PropertyChecker('test', true)),
    )
    .addTracker(new TrackerChecker('NamedEntity', 'person'))
    .addTracker(new TrackerChecker('NamedEntity', 'organization'))
    .addTracker(new TrackerChecker('NamedEntity', 'person_x'))
    .addTracker(new TrackerChecker('NamedEntity', 'organization_x'))
    .addTracker(new TrackerChecker('NamedEntity', 'test_x'))
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('Organization', 'organization'))
    .addTracker(new TrackerChecker('PersonX', 'person_x'))
    .addTracker(new TrackerChecker('OrganizationX', 'organization_x'))
    .addTracker(new TrackerChecker('TestX', 'test_x')
);

it('should ignore', () => {
    expect(true).toBe(true);
  });