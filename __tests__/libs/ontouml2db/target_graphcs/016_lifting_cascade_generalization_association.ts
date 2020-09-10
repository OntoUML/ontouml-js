import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';


export const gChecker_016_lifting_cascade_generalization_association = new GraphChecker()
    .addNode(
    new NodeChecker('person')
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('birth_date', false))
        .addProperty(new PropertyChecker('test', true))
        .addProperty(new PropertyChecker('is_adult', false))
        .addProperty(new PropertyChecker('is_employee', false)),
    )
    .addNode(
    new NodeChecker('employment')
        .addProperty(new PropertyChecker('employment_id', false))
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('salary', false)),
    )
    .addRelationship(
    new RelationshipChecker(
        'person',
        Cardinality.C1,
        'employment',
        Cardinality.C0_N,
    ),
    )
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('Adult', 'person'))
    .addTracker(new TrackerChecker('Employee', 'person'))
    .addTracker(new TrackerChecker('Employment', 'employment')
);

it('should ignore', () => {
    expect(true).toBe(true);
  });