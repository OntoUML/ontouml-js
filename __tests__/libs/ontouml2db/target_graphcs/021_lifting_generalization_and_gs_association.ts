import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';


export const gChecker_021_lifting_generalization_and_gs_association = new GraphChecker()
    .addNode(
    new NodeChecker('person')
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('birth_date', false))
        .addProperty(
        new PropertyChecker('life_phase_enum', false, [
            'CHILD',
            'TEENAGER',
            'ADULT',
        ]),
        )
        .addProperty(new PropertyChecker('is_test1', false))
        .addProperty(new PropertyChecker('is_test2', false))
        .addProperty(new PropertyChecker('test2', true)),
    )
    .addNode(
    new NodeChecker('employment_a')
        .addProperty(new PropertyChecker('employment_a_id', false))
        .addProperty(new PropertyChecker('person_id', false)),
    )
    .addNode(
    new NodeChecker('employment_b')
        .addProperty(new PropertyChecker('employment_b_id', false))
        .addProperty(new PropertyChecker('person_id', false)),
    )
    .addRelationship(
    new RelationshipChecker(
        'person',
        Cardinality.C1,
        'employment_a',
        Cardinality.C0_N,
    ),
    )
    .addRelationship(
    new RelationshipChecker(
        'person',
        Cardinality.C1,
        'employment_b',
        Cardinality.C0_N,
    ),
    )
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('Adult', 'person'))
    .addTracker(new TrackerChecker('Teenager', 'person'))
    .addTracker(new TrackerChecker('Child', 'person'))
    .addTracker(new TrackerChecker('Test1', 'person'))
    .addTracker(new TrackerChecker('Test2', 'person'))
    .addTracker(new TrackerChecker('EmploymentA', 'employment_a'))
    .addTracker(new TrackerChecker('EmploymentB', 'employment_b')
);

it('should ignore', () => {
    expect(true).toBe(true);
  });