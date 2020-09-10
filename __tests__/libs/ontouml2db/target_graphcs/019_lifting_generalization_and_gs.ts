import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';


export const gChecker_019_lifting_generalization_and_gs = new GraphChecker()
    .addNode(
    new NodeChecker('person')
        .addProperty(new PropertyChecker('person_id', false))
        .addProperty(new PropertyChecker('birth_date', false))
        .addProperty(new PropertyChecker('rg', true))
        .addProperty(new PropertyChecker('ci', true))
        .addProperty(new PropertyChecker('is_brazilian_citizen', false))
        .addProperty(new PropertyChecker('is_italian_citizen', false))
        .addProperty(
        new PropertyChecker('life_phase_enum', false, [
            'CHILD',
            'TEENAGER',
            'ADULT',
        ]),
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