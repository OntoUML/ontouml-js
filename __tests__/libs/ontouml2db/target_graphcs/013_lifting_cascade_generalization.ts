import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';


export const gChecker_013_lifting_cascade_generalization = new GraphChecker()
    .addNode(
    new NodeChecker('person')
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('birth_date', false))
        .addProperty(new PropertyChecker('test_role_x', true))
        .addProperty(new PropertyChecker('test_employee', true))
        .addProperty(new PropertyChecker('is_role_x', false))
        .addProperty(new PropertyChecker('is_employee', false)),
    )
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('RoleX', 'person'))
    .addTracker(new TrackerChecker('Employee', 'person')
);

it('should ignore', () => {
    expect(true).toBe(true);
  });