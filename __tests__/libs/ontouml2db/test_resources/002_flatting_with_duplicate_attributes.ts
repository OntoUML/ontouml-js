// import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

// const jsonModel = require('./test_002_flatting_with_duplicate_attributes.json');

const gChecker_002_flatting_with_duplicate_attributes = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('x1', true))
      .addProperty(new PropertyChecker('x2', true))
      .addProperty(new PropertyChecker('x3', true))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'));

const project = new Project();
const model = project.createModel();
const namedEntity = model.createCategory('Named Entity');
const person = model.createKind('Person');
const _int = model.createDatatype('int');
const _string = model.createDatatype('string');

model.createGeneralization(namedEntity, person);
person.createAttribute(_int, 'x1');
person.createAttribute(_string, 'x3');
namedEntity.createAttribute(_int, 'x1');
namedEntity.createAttribute(_string, 'x2');

export const test_002: TestResource = {
  title:
    '002 - Evaluates flattening involving only one generalization where there are attributes with the same name in the superclass and subclass',
  checker: gChecker_002_flatting_with_duplicate_attributes,
  project
  // model: jsonModel,
  // modelManager: new ModelManager(jsonModel)
};
