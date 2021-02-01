import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

const gChecker_001_simple_flattening: GraphChecker = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'));

const project = new Project();
const model = project.createModel();
const namedEntity = model.createCategory('Named Entity');
const person = model.createKind('Person');
const _string = model.createDatatype('string');
const date = model.createDatatype('Date');

model.createGeneralization(namedEntity, person);
person.createAttribute(_string, 'name');
person.createAttribute(date, 'birthDate');

// const jsonModel = require('./test_001_simple_flattening.json');

export const test_001: TestResource = {
  title: '001 - Flattening involving only one generalization test',
  checker: gChecker_001_simple_flattening,
  project
  // model: jsonModel,
  // modelManager: new ModelManager(jsonModel)
};
