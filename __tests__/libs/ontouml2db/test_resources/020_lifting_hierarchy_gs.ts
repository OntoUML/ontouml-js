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

const gChecker_020_lifting_hierarchy_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(
        new PropertyChecker('life_phase_enum', false, [
          'CHILD',
          'TEENAGER',
          'ADULT',
        ]),
      )
      .addProperty(
        new PropertyChecker('teenager_phase_enum', true, [
          'TEENAGERA',
          'TEENAGERB',
        ]),
      )
      .addProperty(
        new PropertyChecker('adult_phase_enum', true, ['ADULTA', 'ADULTB']),
      )
      .addProperty(new PropertyChecker('test_teenager_b', true))
      .addProperty(new PropertyChecker('test_adult_a', true))
      .addProperty(new PropertyChecker('test_adult_b', true)),
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
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('TeenagerA', 'person'))
  .addTracker(new TrackerChecker('TeenagerB', 'person'))
  .addTracker(new TrackerChecker('AdultA', 'person'))
  .addTracker(new TrackerChecker('AdultB', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'));

export const test_020: TestResource = {
  title: '020 Evaluate the lifting with hierarchy of generalization sets',
  model: require('./test_020_lifting_hierarchy_gs.json'),
  checker: gChecker_020_lifting_hierarchy_gs,
};
