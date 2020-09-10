import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';

export const gChecker_018_lifting_orthogonal_gs = new GraphChecker()
    .addNode(
    new NodeChecker('person')
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('birth_date', false))
        .addProperty(new PropertyChecker('rg', true))
        .addProperty(new PropertyChecker('ci', true))
        .addProperty(
        new PropertyChecker('life_phase_enum', false, [
            'CHILD',
            'TEENAGER',
            'ADULT',
        ]),
        ),
    )
    .addNode(
    new NodeChecker('nationality')
        .addProperty(new PropertyChecker('nationality_id', false))
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(
        new PropertyChecker('nationality_enum', false, [
            'BRAZILIANCITIZEN',
            'ITALIANCITIZEN',
        ]),
        ),
    )
    .addRelationship(
    new RelationshipChecker(
        'nationality',
        Cardinality.C0_N,
        'person',
        Cardinality.C1,
    ),
    )
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('Adult', 'person'))
    .addTracker(new TrackerChecker('Teenager', 'person'))
    .addTracker(new TrackerChecker('Child', 'person'))
    .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
    .addTracker(new TrackerChecker('ItalianCitizen', 'person')
);

it('should ignore', () => {
    expect(true).toBe(true);
  });