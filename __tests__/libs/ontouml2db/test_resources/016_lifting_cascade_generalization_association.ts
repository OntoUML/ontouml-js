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

const gChecker_016_lifting_cascade_generalization_association = new GraphChecker()
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
  .addTracker(new TrackerChecker('Employment', 'employment'));

const jsonModel = require('./test_016_lifting_cascade_generalization_association.json');

export const test_016: TestResource = {
  title:
    '016 Evaluate the lifting with cascading generalizations and one association with the subclass',
  checker: gChecker_016_lifting_cascade_generalization_association,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
