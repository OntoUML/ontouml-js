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

const gChecker_026_flatting_to_class_association = new GraphChecker()
  .addNode(new NodeChecker('person').addProperty(new PropertyChecker('person_id', false)))
  .addNode(new NodeChecker('associated_class1').addProperty(new PropertyChecker('associated_class1_id', false)))
  .addNode(new NodeChecker('associated_class2').addProperty(new PropertyChecker('associated_class2_id', false)))
  .addNode(new NodeChecker('associated_class3').addProperty(new PropertyChecker('person_id', false)))
  .addNode(new NodeChecker('associated_class4').addProperty(new PropertyChecker('person_id', false)))
  .addNode(
    new NodeChecker('person_associated_class1')
      .addProperty(new PropertyChecker('person_associated_class1_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('associated_class1_id', false))
  )
  .addNode(
    new NodeChecker('person_associated_class2')
      .addProperty(new PropertyChecker('person_associated_class2_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('associated_class2_id', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'person_associated_class1', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'person_associated_class2', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'associated_class3', Cardinality.C0_1))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'associated_class4', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person_associated_class1', Cardinality.C0_N, 'associated_class1', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person_associated_class2', Cardinality.C0_N, 'associated_class2', Cardinality.C1))
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('AssociatedClass1', 'associated_class1'))
  .addTracker(new TrackerChecker('AssociatedClass2', 'associated_class2'))
  .addTracker(new TrackerChecker('AssociatedClass3', 'associated_class3'))
  .addTracker(new TrackerChecker('AssociatedClass4', 'associated_class4'))
  .addTracker(new TrackerChecker('PersonAssociatedClass1', 'person_associated_class1'))
  .addTracker(new TrackerChecker('PersonAssociatedClass2', 'person_associated_class2'));

const jsonModel = require('./test_026_flatting_to_class_association.json');

export const test_026: TestResource = {
  title: '026 Evaluate the cardinality of the association with the superclass in the event of a flattening',
  checker: gChecker_026_flatting_to_class_association,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
