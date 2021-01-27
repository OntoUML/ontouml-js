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

const gChecker_027_lifting_multiple_relations_to_remake = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('is_personal_customer', false))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('person_id', false))
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('person_id', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'test', Cardinality.C0_N))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('PersonalCustomer', 'person'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .addTracker(new TrackerChecker('Test', 'test'));

const jsonModel = require('./test_027_lifting_multiple_relations_to_remake.json');

export const test_027: TestResource = {
  title: '027 Evaluate the lifting when one subclass has two indirect associations',
  checker: gChecker_027_lifting_multiple_relations_to_remake,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
