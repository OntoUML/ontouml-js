import { GraphChecker } from "@libs/ontouml2db/graph/graph_tester/GraphChecker";
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';

export const gChecker_003_flatting_gs = new GraphChecker()
    .addNode(
    new NodeChecker('person')
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('name', false))
        .addProperty(new PropertyChecker('birth_date', true)),
    )
    .addNode(
    new NodeChecker('organization')
        .addProperty(new PropertyChecker('organization_id', false))
        .addProperty(new PropertyChecker('name', false))
        .addProperty(new PropertyChecker('address', true)),
    )
    .addTracker(new TrackerChecker('NamedEntity', 'person'))
    .addTracker(new TrackerChecker('NamedEntity', 'organization'))
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('Organization', 'organization')
    );

it('should ignore', () => {
    expect(true).toBe(true);
});