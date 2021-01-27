import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_021_lifting_generalization_and_gs_association = new GraphChecker()
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
  .addTracker(new TrackerChecker('EmploymentB', 'employment_b'));

const jsonModel = require('./test_021_lifting_Generalization_and_gs_association.json');

export const test_021: TestResource = {
  title:
    '021 Evaluate the lifting with generalizations, one generalization set and association in the subclasses',
  checker: gChecker_021_lifting_generalization_and_gs_association,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
